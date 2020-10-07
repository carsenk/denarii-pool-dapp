import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector from '../../../../helpers/snxJSConnector';

import { bigNumberFormatter, formatCurrency } from '../../../../helpers/formatters';
import TransactionPriceIndicator from '../../../../components/TransactionPriceIndicator';
import { getWalletDetails } from '../../../../ducks/wallet';

import { PageTitle, PLarge } from '../../../../components/Typography';
import DataBox from '../../../../components/DataBox';
import { ButtonTertiary, ButtonPrimary } from '../../../../components/Button';
import Input from '../../../../components/Input';
import ErrorMessage from '../../../../components/ErrorMessage';

import UnipoolActions from '../../../UnipoolActions';

import Logo from '../../../../components/Logo';

const TRANSACTION_DETAILS = {
	stake: {
		contractFunction: 'stake',
		gasLimit: 200000,
	},
	claim: {
		contractFunction: 'getReward',
		gasLimit: 200000,
	},
	unstake: {
		contractFunction: 'withdraw',
		gasLimit: 150000,
	},
	exit: {
		contractFunction: 'exit',
		gasLimit: 250000,
	},
};

const Stake = ({ walletDetails, goBack }) => {
	const { t } = useTranslation();
	const { aripoolARIContract } = snxJSConnector;
	const [balances, setBalances] = useState(null);
	const [stakeAmount, setStakeAmount] = useState('');
	const [gasLimit, setGasLimit] = useState(TRANSACTION_DETAILS.stake.gasLimit);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { aripoolStakeContract, aripoolARIContract } = snxJSConnector;
			const [univ2Held, univ2Staked, rewards] = await Promise.all([
				aripoolStakeContract.balanceOf(currentWallet),
				aripoolARIContract.balanceOf(currentWallet),
				aripoolARIContract.earned(currentWallet),
			]);
			setBalances({
				univ2Held: univ2Held / 1e8,
				univ2HeldBN: univ2Held,
				univ2Staked: univ2Staked / 1e8,
				univ2StakedBN: univ2Staked,
				rewards: rewards / 1e8,
			});
		} catch (e) {
			console.log(e);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, snxJSConnector.initialized]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	useEffect(() => {
		if (!currentWallet) return;
		const { aripoolARIContract } = snxJSConnector;

		aripoolARIContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		aripoolARIContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		aripoolARIContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				aripoolARIContract.removeAllListeners('Staked');
				aripoolARIContract.removeAllListeners('Withdrawn');
				aripoolARIContract.removeAllListeners('RewardPaid');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<Container>
			<UnipoolActions {...currentScenario} onDestroy={() => setCurrentScenario({})} />
			<BoxRow>
				<DataBox
					heading={t('lpRewards.shared.data.balance')}
					icon={<ActionLogo src={"/images/ARI.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Held) : 0} ARI`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					icon={<ActionLogo src={"/images/aristakepool.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Staked) : 0} ARI`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					icon={<ActionLogo src={"/images/ARI.png"} big />}
					body={`${balances ? formatCurrency(balances.rewards) : 0} ARI`}
				/>
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
				<Input
							onChange={e => setStakeAmount(e.target.value)}
							value={stakeAmount}
							placeholder="0.00"
						/>
				<ButtonActionNM
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['stake'].gasLimit)}
						disabled={!balances || !balances.univ2Held}
						onClick={() =>
							setCurrentScenario({
								contract: 'aripoolARIContract',
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${stakeAmount} ARI`, //`${balances && formatCurrency(balances.univ2Held)} ARI`,
								param: stakeAmount * 1e8,
								...TRANSACTION_DETAILS['stake'],
							})
						}
					>
						Stake ARI
					</ButtonActionNM>
				</ButtonRow>
				<ButtonRow>
				<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['claim'].gasLimit)}
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								contract: 'aripoolARIContract',
								action: 'claim',
								label: t('lpRewards.shared.actions.claiming'),
								amount: `${balances && formatCurrency(balances.rewards)} ARI`,
								...TRANSACTION_DETAILS['claim'],
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['unstake'].gasLimit)}
						disabled={!balances || !balances.univ2Staked}
						onClick={() =>
							setCurrentScenario({
								contract: 'aripoolARIContract',
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} ARI`,
								param: balances && balances.univ2StakedBN,
								...TRANSACTION_DETAILS['unstake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonActionNM
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['exit'].gasLimit)}
						disabled={!balances || (!balances.univ2Staked && !balances.rewards)}
						onClick={() =>
							setCurrentScenario({
								contract: 'aripoolARIContract',
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} ARI & ${
									balances && formatCurrency(balances.rewards)
								} ARI`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonActionNM>
				</ButtonRow>
			</ButtonBlock>
			<StakeBox>
			<PT>{t('aripoolARI.title')}</PT>
			<PALarge>{t('aripoolARI.unlocked.subtitle')}</PALarge>
			</StakeBox>
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${aripoolARIContract.address}`}
				>
					 ↗ {t('lpRewards.shared.buttons.goToContract')}
				</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670`}
				>
					 + Buy ARI
				</ButtonTertiary>
			</Navigation>
			<TransactionPriceIndicator gasLimit={gasLimit} canEdit={true} />
		</Container>
	);
};

const Container = styled.div`
	min-height: 850px;
`;

const Navigation = styled.div`
	display: flex;
	justify-content: space-between;
	margin-bottom: 40px;
`;

const StakeBox = styled.div`
	font-size: 16px;
	font-weight: 100;
	margin-bottom:30px;
	background-color:rgba(0,0,0,0.15);
	border-radius:15px;
	padding:30px;
`;

const PT = styled.div`
	font-size: 26px;
	font-weight: 100;
	color: #e5e5e5;
	margin-bottom:15px;
`;

const PALarge = styled.div`
	font-size: 16px;
	font-weight: 100;
	color: #e5e5e5;
	margin:0;
`;

const BoxRow = styled.div`
	margin-top: 35px;
	display: flex;
`;

const ButtonBlock = styled.div`
	margin-top: 58px;
`;

const ActionLogo = styled.img`
	width: 48px;
	height: 48px;
`;

const ButtonRow = styled.div`
	display: flex;
	margin-bottom: 28px;
`;

const ButtonActionNM = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	text-transform: none;
`;

const ButtonAction = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	margin-right: 34px;	
	text-transform: none;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
