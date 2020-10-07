import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UnipoolARI from './UniPoolARI';
import AripoolARI from './AriPoolARI';
import Balpool from './BalPool';
import UnipoolARIDAI from './UniPoolARIDAI';

import { getCurrentTheme } from 'ducks/ui';

import { getWalletDetails } from '../../../ducks/wallet';

import PageContainerMobile from 'components/PageContainerMobile';
import { Info } from 'components/Icons';
import Tooltip from 'components/Tooltip';

import { FlexDivCentered } from 'styles/common';
import { H1, PageTitle, Subtext, DataLarge, PMedium } from 'components/Typography';

import snxJSConnector from 'helpers/snxJSConnector';
import { formatCurrency, formatCurrency2 } from 'helpers/formatters';

import { shortenAddress } from 'helpers/formatters';

import Logo from 'components/Logo';
// import BackgroundImage from '../public/images/cardbg.jpg';

const POOLS_MAJOR = [
	{
		title: 'lpRewards.actions.unipoolARI.title',
		name: 'unipoolARI',
		image: '/images/ariswaps.png',
		contract: 'unipoolARIContract',
	},
	{
		title: 'lpRewards.actions.aripoolARI.title',
		name: 'aripoolARI',
		image: '/images/ARI.png',
		contract: 'aripoolARIContract',
	},
	{
		title: 'lpRewards.actions.balpool.title',
		name: 'balpool',
		image: '/images/balancer.png',
		contract: 'balpoolContract',
	},
	// { // Uncomment all these for unipoolARIDAIContract for balancer pool once setup CK
	// 	title: 'lpRewards.actions.balpoolARIDAI.title',
	// 	name: 'balpoolARIDAI',
	// 	image: '/images/ariswaps.png',
	// 	contract: 'unipoolARIDAIContract',
	// },
];

const LPRewardsMobile = ({ currentTheme, walletDetails }) => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const [distributions, setDistributions] = useState({});
	const [distributions2, setDistributions2] = useState({});
	const goBack = () => setCurrentPool(null);
	const { currentWallet, networkName } = walletDetails;
	const [balances, setBalances] = useState(null);

	const fetchData = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		try {
			const { aripoolStakeContract, uniswapV2Contract, unipoolARIContract, aripoolARIContract } = snxJSConnector;
			const [ariPool, uniPool, univ3Held, uniHeld, univ2Held, univ2Staked, rewards] = await Promise.all([
				aripoolStakeContract.balanceOf('0x355999C9B568c17bc50de80478848075ef1daBB0'),
				uniswapV2Contract.balanceOf('0x4747cA5474f3044e3F9d3b8dC237E9C9f3A8fc04'),
				uniswapV2Contract.balanceOf(currentWallet),
				unipoolARIContract.balanceOf(currentWallet),
				aripoolStakeContract.balanceOf(currentWallet),
				aripoolARIContract.balanceOf(currentWallet),
				aripoolARIContract.earned(currentWallet),
			]);
			setBalances({
				ariPool: ariPool / 1e8 - 100000,
				ariPoolBN: ariPool,
				uniPool: uniPool / 1e18,
				uniPoolBN: uniPool,
				univ3Held: univ3Held / 1e18,
				univ3HeldBN: univ3Held,
				uniHeld: uniHeld / 1e18,
				uniHeldBN: uniHeld,
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
		const { unipoolARIContract, aripoolARIContract, balpoolContract } = snxJSConnector; //, unipoolARIDAIContract 

		const getRewardsAmount = async () => {
			try {
				const contracts = [unipoolARIContract, aripoolARIContract, balpoolContract];//, unipoolARIDAIContract
				const rewardsData = await Promise.all(
					contracts.map(contract => Promise.all([contract.DURATION(), contract.rewardRate()]))
				);
				let contractRewards = {};
				rewardsData.forEach(([duration, rate], i) => {
					contractRewards[contracts[i].address] = Math.trunc(Number(duration) * (rate / 1e8));
				});
				//console.log(contractRewards);
				setDistributions(contractRewards);
			} catch (e) {
				console.log(e);
				setDistributions({});
			}
		};
		const getRewardsTime = async () => {
			try {
				const contracts = [unipoolARIContract, aripoolARIContract, balpoolContract];//, unipoolARIDAIContract
				const timeData = await Promise.all(
					contracts.map(contract => Promise.all([contract.periodFinish()]))
				);
				let contractRewards2 = {};
				timeData.forEach(([period], i) => {
					contractRewards2[contracts[i].address] = Math.ceil(((period - new Date().getTime() / 1000) / 60) / 60);
				});
				//console.log(contractRewards);
				setDistributions2(contractRewards2);
			} catch (e) {
				console.log(e);
				setDistributions2({});
			}
		};
		getRewardsAmount();
		getRewardsTime();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPoolComponent = poolName => {
		switch (poolName) {
			case 'unipoolARI':
				return <UnipoolARI goBack={goBack} />;
			case 'aripoolARI':
				return <AripoolARI goBack={goBack} />;
			case 'balpool':
				return <Balpool goBack={goBack} />;
			// case 'balpoolARIDAI':
			// 	return <UnipoolARIDAI goBack={goBack} />;
			default:
				return null;
		}
	};

	return (
		<PageContainerMobile>
			{currentPool ? (
				getPoolComponent(currentPool)
			) : (
				<>
				<Network>{shortenAddress(currentWallet)} ♦ {networkName}</Network>
				<BalDiv><Balance><Balspan>Your Balance</Balspan><Bal>{`${balances ? formatCurrency(balances.univ2Held) : 0} ARI`}</Bal><SmallBal>Staking {`${balances ? formatCurrency(balances.univ2Staked) : 0} ARI`}</SmallBal><SmallBal>&nbsp;</SmallBal></Balance><Balance2><Balspan>Your LP Shares</Balspan><Bal>{`${balances ? formatCurrency(balances.univ3Held) : 0} UNI-V2`}</Bal><SmallBal>Staking {`${balances ? formatCurrency(balances.uniHeld) : 0} UNI-V2`}</SmallBal><SmallBal>Total Pooled: {`${balances ? formatCurrency(balances.uniPool) : 0} UNI-V2`}</SmallBal><SmallBal>Pool Control: {`${balances ? formatCurrency2(formatCurrency(balances.uniHeld) / formatCurrency(balances.uniPool) * 100) : 0}%`}</SmallBal></Balance2></BalDiv>
					<PageTitleCentered>{t('lpRewards.intro.title')}</PageTitleCentered>
					{[POOLS_MAJOR].map((pools, i) => {
						return (
							<ButtonRow key={`pool-${i}`}>
								{pools.map(({ title, name, image, contract }, i) => {
									const distribution = distributions[snxJSConnector[contract].address] || 0; //50000 Rewards
									const distribution2 = distributions2[snxJSConnector[contract].address] || 0; //50000 Time Left
									//console.log('DISTRIBUTION:!!!!!!', distributions[snxJSConnector[contract].address]);
									return (
										<Button key={`button-${i}`} onClick={() => setCurrentPool(name)}>
											<ButtonContainer>
												<ButtonHeading>													
													<StyledHeading>{t(title)}</StyledHeading>
													<ActionImage src={image} big />
												</ButtonHeading>
												<StyledSubtext>{t('lpRewards.shared.info.weeklyRewards')}:</StyledSubtext>
												{distribution !== 0 ? (
													<StyledDataLarge>{formatCurrency(distribution, 0)} ARI</StyledDataLarge>
												) : (
													<CompletedLabel>
														<CompletedLabelHeading>
															{t('lpRewards.intro.completed')}
														</CompletedLabelHeading>
														<Tooltip
															mode={currentTheme}
															title={t('tooltip.poolCompleted')}
															placement="top"
														>
															<TooltipIconContainer>
																<Info />
															</TooltipIconContainer>
														</Tooltip>
													</CompletedLabel>
												)}
												{distribution2 >= 0 ? (
													<StyledDataLarge2>~{distribution2} hours left</StyledDataLarge2>
												) : (
													<StyledDataLarge></StyledDataLarge>
												)}
											</ButtonContainer>
										</Button>
									);
								})}
							</ButtonRow>
						);
					})}
				</>
			)}
		</PageContainerMobile>
	);
};

const PageTitleCentered = styled(PageTitle)`
	text-align: center;
	justify-content: center;
	color: #d1d1d1;
`;

const PageMobile = styled.div`
	width:100%;
	min-height:835px;
`;

const CompletedLabel = styled(FlexDivCentered)`
	justify-content: center;
	border-radius: 1000px;
	background-color: ${props => props.theme.colorStyles.background};
	padding: 4px 15px;
`;

const CompletedLabelHeading = styled(PMedium)`
	margin: 0;
	font-size: 14px;
	text-transform: uppercase;
`;

const Network = styled.div`
	width:100%;
	background-color: rgba(0,0,0,0.15);
	color: #999;
	text-align: center;
	margin-top: 25px;
	padding: 15px;
	font-size: 19px;
	border-radius:15px;
`;

const Button = styled.button`
	cursor: pointer;
	height: 300px;
	background: rgb(73,0,130);
	background: linear-gradient(180deg, rgba(73,0,130,0.8113620448179272) 0%, rgba(116,14,168,0.6713060224089635) 100%);
	border: 1px solid #420060;
	border-radius: 25px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	width: 100%;
	&:hover {
		transform: translateY(-2px);
	}
	margin-left: 20px;
	margin-right: 20px;
	margin-bottom: 30px;
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 5px;
	height: 300px;
	margin-bottom:25px;
	display: flex;
	flex-direction: column;
`;

const ButtonHeading = styled.div`
	height: 128px;
	margin-bottom: 30px;
`;

const ButtonRow = styled.div`
	margin-top: 20px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ActionImage = styled.img`
	height: 64px;
	width: 64px;
`;

const ActionLogo = styled.img`
	height: 64px;
	width: 64px;
`;

const StyledHeading = styled(H1)`
	font-size: 22px;
	text-transform: none;
	color: ${props => props.theme.colorStyles.panelText};
`;

const StyledDataLarge = styled(DataLarge)`
	color: ${props => props.theme.colorStyles.panelText};
	font-size: 32px;
`;

const StyledDataLarge2 = styled(DataLarge)`
	color: ${props => props.theme.colorStyles.panelText};
	font-size: 16px;
	margin-top:15px;
	background-color: rgba(0,0,0,0.15);
	color:#a47bc1;
	padding:10px;
	border-radius:15px;
`;

const StyledSubtext = styled(Subtext)`
	text-transform: none;
	margin: 28px 0 12px 0;
	color: ${props => props.theme.colorStyles.panelText};
`;

const TooltipIconContainer = styled.div`
	margin-left: 6px;
	width: 23px;
	height: 23px;
`;

const BalDiv = styled.div`
	margin: 0 auto;
	width: 100%;
	text-align:center;
`;

const SmallBal = styled.div`
	color: #a47bc1;
	font-size: 16px;
`;

const Balance = styled.div`
	color: #FFF;
	font-size: 21px;
	width: 100%;
	margin: 0 auto;
	display: inline-block;
	font-weight: thin;
	text-align: center;
	margin-top:30px;
	background-color: rgba(0,0,0,0.15);
	border-radius: 15px;
	padding:30px;
	margin-right:33px;
`;

const Balance2 = styled.div`
	color: #FFF;
	font-size: 21px;
	width: 100%;
	display: inline-block;
	margin: 0 auto;
	margin-top:30px;
	font-weight: thin;
	text-align: center;
	background-color: rgba(0,0,0,0.15);
	border-radius: 15px;
	padding:30px;
`;

const Balspan = styled.div`
	color: #888;
`;

const Bal = styled.div`
	font-size: 26px;
	color: #fff;
`;

const SmallLogo = styled(Logo)`
	width: 75px;
	height: 75px;
	margin-right: 8px;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, null)(LPRewardsMobile);
