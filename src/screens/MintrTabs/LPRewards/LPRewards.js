import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import UnipoolARI from './UniPoolARI';
import UnipoolARIDAI from './UniPoolARIDAI';

import { getCurrentTheme } from 'ducks/ui';

import PageContainer from 'components/PageContainer';
import { Info } from 'components/Icons';
import Tooltip from 'components/Tooltip';

import { FlexDivCentered } from 'styles/common';
import { H1, PageTitle, Subtext, DataLarge, PMedium } from 'components/Typography';

import snxJSConnector from 'helpers/snxJSConnector';
import { formatCurrency } from 'helpers/formatters';

import Logo from 'components/Logo';

const POOLS_MAJOR = [
	{
		title: 'lpRewards.actions.unipoolARI.title',
		name: 'unipoolARI',
		image: '/images/ariswaps.png',
		contract: 'unipoolARIContract',
	},
	// { // Uncomment all these for unipoolARIDAIContract for balancer pool once setup CK
	// 	title: 'lpRewards.actions.balpoolARIDAI.title',
	// 	name: 'balpoolARIDAI',
	// 	image: '/images/ariswaps.png',
	// 	contract: 'unipoolARIDAIContract',
	// },
];

const LPRewards = ({ currentTheme }) => {
	const { t } = useTranslation();
	const [currentPool, setCurrentPool] = useState(null);
	const [distributions, setDistributions] = useState({});
	const goBack = () => setCurrentPool(null);

	useEffect(() => {
		const { unipoolARIContract } = snxJSConnector; //, unipoolARIDAIContract 

		const getRewardsAmount = async () => {
			try {
				const contracts = [unipoolARIContract];//, unipoolARIDAIContract
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
		getRewardsAmount();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const getPoolComponent = poolName => {
		switch (poolName) {
			case 'unipoolARI':
				return <UnipoolARI goBack={goBack} />;
			// case 'balpoolARIDAI':
			// 	return <UnipoolARIDAI goBack={goBack} />;
			default:
				return null;
		}
	};

	return (
		<PageContainer>
			{currentPool ? (
				getPoolComponent(currentPool)
			) : (
				<>
					<PageTitleCentered>{t('lpRewards.intro.title')}</PageTitleCentered>
					{[POOLS_MAJOR].map((pools, i) => {
						return (
							<ButtonRow key={`pool-${i}`}>
								{pools.map(({ title, name, image, contract }, i) => {
									const distribution = distributions[snxJSConnector[contract].address] || 0; //50000
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
											</ButtonContainer>
										</Button>
									);
								})}
							</ButtonRow>
						);
					})}
				</>
			)}
		</PageContainer>
	);
};

const PageTitleCentered = styled(PageTitle)`
	text-align: center;
	justify-content: center;
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

const Button = styled.button`
	cursor: pointer;
	height: 348px;
	background-color: ${props => props.theme.colorStyles.panelButton};
	border: 1px solid ${props => props.theme.colorStyles.borders};
	border-radius: 5px;
	box-shadow: 0px 5px 10px 5px ${props => props.theme.colorStyles.shadow1};
	transition: transform ease-in 0.2s;
	width: 222px;
	&:hover {
		transform: translateY(-2px);
	}
	margin-left: 20px;
	margin-right: 20px;
`;

const ButtonContainer = styled.div`
	padding: 10px;
	margin: 0 5px;
	height: 300px;
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
	flex-direction: row;
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
	font-size: 16px;
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

const SmallLogo = styled(Logo)`
	width: 75px;
	height: 75px;
	margin-right: 8px;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
});

export default connect(mapStateToProps, null)(LPRewards);
