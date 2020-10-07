import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { bigNumberFormatter, formatCurrency } from 'helpers/formatters';

import { setCurrentTab, getCurrentTab } from '../../ducks/ui';
import { getModalState } from '../../ducks/modal';

import { LPRewardsMobile } from '../MintrTabs';
import { TabButton } from '../../components/Button';
import { GweiModal } from '../../components/Modal';
import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

import { shortenAddress } from '../../helpers/formatters';

import { getWalletDetails } from '../../ducks/wallet';
import snxJSConnector from 'helpers/snxJSConnector';

// import { WalletStatusButton } from '../../Button';

//import Header from '../../components/Header';

const renderScreen = screen => {
	switch (screen) {
		case 'home':
		default:
			return <LPRewardsMobile />;
		case 'lpRewards':
			return <LPRewardsMobile />;
	}
};

const MainContainer = ({ currentTab, modalState: { modalType, modalProps }, setCurrentTab, walletDetails }) => {
	const { t } = useTranslation();
	const { currentWallet, networkName } = walletDetails;
	// const { unipoolARIContract, aripoolARIContract, balpoolContract } = snxJSConnector;
	const [balances, setBalances] = useState(null);

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

		// aripoolARIContract.on('Staked', user => {
		// 	if (user === currentWallet) {
		// 		fetchData();
		// 	}
		// });

		// aripoolARIContract.on('Withdrawn', user => {
		// 	if (user === currentWallet) {
		// 		fetchData();
		// 	}
		// });

		// aripoolARIContract.on('RewardPaid', user => {
		// 	if (user === currentWallet) {
		// 		fetchData();
		// 	}
		// });

		// return () => {
		// 	if (snxJSConnector.initialized) {
		// 		aripoolARIContract.removeAllListeners('Staked');
		// 		aripoolARIContract.removeAllListeners('Withdrawn');
		// 		aripoolARIContract.removeAllListeners('RewardPaid');
		// 	}
		// };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);


	return (
		<MainContainerWrapper>
			<Overlay isVisible={modalType}></Overlay>			
			<Header>
				{['lpRewards'].map(tab => {
					return (						
						<TabButton
							key={tab}
							isSelected={tab === currentTab}
							onClick={() => setCurrentTab({ tab })}
						>
							{/* <ActionLogo src={"/images/ARI.png"} big /> */}
							{/* i18next-extract-disable-next-line */}
					{t(`mainNavigation.tabs.${tab}`)}
						</TabButton>
					);
				})}
			</Header>
			{renderScreen(currentTab)}
			{modalType === MODAL_TYPES_TO_KEY.GWEI ? <GweiModal {...modalProps} /> : null}
		</MainContainerWrapper>
	);
};

const MainContainerWrapper = styled('div')`
	width: 100%;
	background: rgb(60,4,84);
	background: radial-gradient(circle, rgba(60,4,84,1) 0%, rgba(37,0,53,1) 100%);
	position: relative;
`;

const Network = styled('span')`
	background-color: #222;
	border-bottom-left-radius: 15px;
	padding:10px;
	font-size:16px;
	float: right;
	right: 0;
	top: 0;
	position: absolute;
`;

const Home = styled('span')`
	background-color: #222;
	border-bottom-left-radius: 15px;
	padding:10px;
	font-size:16px;
	float: right;
	right: 0;
	top: 0;
	position: absolute;
`;

const Header = styled('div')`
	display: flex;
	justify-content: space-between;
	height: 80px;
	background-color: ${props => props.theme.colorStyles.background};
`;

const ActionLogo = styled.img`
	width: 64px;
	height: 64px;
`;

const Overlay = styled.div`
	visibility: ${props => (props.isVisible ? 'visible' : 'hidden')};
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	background: rgb(0, 0, 0, 0.7);
	z-index: 1000;
`;

const mapStateToProps = state => ({
	currentTab: getCurrentTab(state),
	walletDetails: getWalletDetails(state),
	modalState: getModalState(state),
});

const mapDispatchToProps = {
	setCurrentTab,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
