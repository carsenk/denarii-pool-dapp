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

import UnipoolActions from '../../../UnipoolActions';
import Slider from '@material-ui/core/Slider';

import Logo from '../../../../components/Logo';
import { OutputFileType } from 'typescript';

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
	const { unipoolARIContract } = snxJSConnector;
	const [balances, setBalances] = useState(null);
	const [stakeUNIAmount, setUNIStakeAmount] = useState('');
	const [gasLimit, setGasLimit] = useState(TRANSACTION_DETAILS.stake.gasLimit);
	const [currentScenario, setCurrentScenario] = useState({});
	const { currentWallet } = walletDetails;

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { uniswapV2Contract, unipoolARIContract } = snxJSConnector;
			const [univ2Held, univ2Staked, rewards] = await Promise.all([
				uniswapV2Contract.balanceOf(currentWallet),
				unipoolARIContract.balanceOf(currentWallet),
				unipoolARIContract.earned(currentWallet),
				//unipoolARIContract.balanceOf(unipoolARIContract),
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
		const { unipoolARIContract } = snxJSConnector;

		unipoolARIContract.on('Staked', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		unipoolARIContract.on('Withdrawn', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		unipoolARIContract.on('RewardPaid', user => {
			if (user === currentWallet) {
				fetchData();
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				unipoolARIContract.removeAllListeners('Staked');
				unipoolARIContract.removeAllListeners('Withdrawn');
				unipoolARIContract.removeAllListeners('RewardPaid');
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
					icon={<ActionLogo src={"/images/aripooln.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Held) : 0} UNI-V2`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.staked')}
					icon={<ActionLogo src={"/images/aripool.png"} big />}
					body={`${balances ? formatCurrency(balances.univ2Staked) : 0} UNI-V2`}
				/>
				<DataBox
					heading={t('lpRewards.shared.data.rewardsAvailable')}
					icon={<ActionLogo src={"/images/ARI.png"} big />}
					body={`${balances ? formatCurrency(balances.rewards) : 0} ARI`}
				/>
			</BoxRow>
			<Output>{`${stakeUNIAmount} UNI-V2 LP (${balances && Math.trunc(stakeUNIAmount / formatCurrency(balances.univ2Held) * 100)}% of total)`}</Output>
			<ButtonBlock>				
				<ButtonRow>
				<InputSlider
							onChange={e => setUNIStakeAmount(e.target.value)}
							value={stakeUNIAmount}
							type="range"
							step="0.000000000000001"
							min="0.000000000000000000"
							max={balances && formatCurrency(balances.univ2Held)}
						/>
					<ButtonActionNM
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['stake'].gasLimit)}
						disabled={!balances || !balances.univ2Held}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolARIContract',
								action: 'stake',
								label: t('lpRewards.shared.actions.staking'),
								amount: `${stakeUNIAmount} UNI-V2 LP`,
								param: stakeUNIAmount * 1e18,
								...TRANSACTION_DETAILS['stake'],
							})
						}
					>
						Stake LP tokens
					</ButtonActionNM>
					</ButtonRow>
					<ButtonRow>
					<ButtonAction
						onMouseEnter={() => setGasLimit(TRANSACTION_DETAILS['claim'].gasLimit)}
						disabled={!balances || !balances.rewards}
						onClick={() =>
							setCurrentScenario({
								contract: 'unipoolARIContract',
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
								contract: 'unipoolARIContract',
								action: 'unstake',
								label: t('lpRewards.shared.actions.unstaking'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} UNI-V2`,
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
								contract: 'unipoolARIContract',
								action: 'exit',
								label: t('lpRewards.shared.actions.exiting'),
								amount: `${balances && formatCurrency(balances.univ2Staked)} UNI-V2 & ${
									balances && formatCurrency(balances.rewards)
								} ARI`,
								...TRANSACTION_DETAILS['exit'],
							})
						}
					>
						{t('lpRewards.shared.buttons.exit')}
					</ButtonActionNM>
				</ButtonRow>
					<StakeBox>
					<PT>{t('unipoolARI.title')}</PT>
					<PALarge>{t('unipoolARI.unlocked.subtitle')}</PALarge>
					</StakeBox>
			</ButtonBlock>
			<Navigation>
				<ButtonTertiary onClick={goBack}>{t('button.navigation.back')}</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://etherscan.io/address/${unipoolARIContract.address}`}
				>
					 ↗ {t('lpRewards.shared.buttons.goToContract')}
				</ButtonTertiary>
				<ButtonTertiary
					as="a"
					target="_blank"
					href={`https://uniswap.exchange/add/0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670/ETH`}
				>
					 + {t('lpRewards.shared.buttons.addLiquid')}
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
	background-color: rgba(0,0,0,0.15);
	border-radius:15px;
	margin-bottom:30px;
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
	margin-top: 35px;
	display: flex;
`;

const ButtonBlock = styled.div`
	margin-top: 12px;
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

const InputSlider = styled.input`
	width:350px;
	margin-right:34px;
	color: purple;
	background: transparent !important;
	border-color: purple !important;
`;

const Output = styled.div`
	text-align: center;
	color:#FFF;
	width:100%;
	margin: 0 auto;
	margin-top:5px;
	margin-bottom:5px;
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
