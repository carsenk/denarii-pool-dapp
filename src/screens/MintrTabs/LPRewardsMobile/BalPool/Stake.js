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
	const { balpoolContract } = snxJSConnector;
	const [balances, setBalances] = useState(null);
	const [gasLimit, setGasLimit] = useState(TRANSACTION_DETAILS.stake.gasLimit);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { balpoolTokenContract, balpoolContract } = snxJSConnector;
			const [univ2Held, univ2Staked, rewards] = await Promise.all([
				balpoolTokenContract.balanceOf(currentWallet),
				balpoolContract.balanceOf(currentWallet),
				balpoolContract.earned(currentWallet),
			]);
			setBalances({
				univ2Held: bigNumberFormatter(univ2Held),
				univ2HeldBN: univ2Held,
				univ2Staked: bigNumberFormatter(univ2Staked),
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
		const { balpoolContract } = snxJSConnector;

		balpoolContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		balpoolContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		balpoolContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				balpoolContract.removeAllListeners('Staked');
				balpoolContract.removeAllListeners('Withdrawn');
				balpoolContract.removeAllListeners('RewardPaid');
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
					icon={<ActionLogo src={"/images/balpoola.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Held) : 0} BPT`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					icon={<ActionLogo src={"/images/balpool.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Staked) : 0} BPT`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					icon={<ActionLogo src={"/images/ARI.png"} big />}
					body={`${balances ? formatCurrency(balances.rewards) : 0} ARI`}
				/>
			</BoxRow>
			<ButtonBlock>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['stake'].gasLimit)}
						disabled={!balances || !balances.univ2Held}
						onClick={() =>
							setCurrentScenario({
								contract: 'balpoolContract',
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${balances && formatCurrency(balances.univ2Held)} BPT`,
								param: balances && balances.univ2HeldBN,
								...TRANSACTION_DETAILS['stake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.stake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['claim'].gasLimit)}
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								contract: 'balpoolContract',
								action: 'claim',
								label: t('lpRewards.shared.actions.claiming'),
								amount: `${balances && formatCurrency(balances.rewards)} ARI`,
								...TRANSACTION_DETAILS['claim'],
							})
						}
					>
						{t('lpRewards.shared.buttons.claim')}
					</ButtonAction>
				</ButtonRow>
				<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['unstake'].gasLimit)}
						disabled={!balances || !balances.univ2Staked}
						onClick={() =>
							setCurrentScenario({
								contract: 'balpoolContract',
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} BPT`,
								param: balances && balances.univ2StakedBN,
								...TRANSACTION_DETAILS['unstake'],
							})
						}
					>
						{t('lpRewards.shared.buttons.unstake')}
					</ButtonAction>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['exit'].gasLimit)}
						disabled={!balances || (!balances.univ2Staked && !balances.rewards)}
						onClick={() =>
							setCurrentScenario({
								contract: 'balpoolContract',
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} BPT & ${
									balances && formatCurrency(balances.rewards)
								} ARI`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonAction>
				</ButtonRow>
			</ButtonBlock>
			<StakeBox>
			<PT>{t('balpool.title')}</PT>
			<PALarge>{t('balpool.unlocked.subtitle')}</PALarge>
			</StakeBox>
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${balpoolContract.address}`}
				>
					 ↗ {t('lpRewards.shared.buttons.goToContract')}
				</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://pools.balancer.exchange/#/pool/0xa516b20aaa2ceaf619004fda6d7d31dcc98f342a`}
				>
					 + Add Liquidity
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
`;

const BoxRow = styled.div`
	margin-top: 42px;
	display: block;
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

const ButtonAction = styled(ButtonPrimary)`
	flex: 1;
	width: 10px;
	height: 64px;
	&:first-child {
		margin-right: 34px;
	}
	text-transform: none;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Stake);
