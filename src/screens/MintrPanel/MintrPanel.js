import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import { setCurrentTab, getCurrentTab } from '../../ducks/ui';
import { getModalState } from '../../ducks/modal';

import { LPRewards } from '../MintrTabs';
import { TabButton } from '../../components/Button';
import { GweiModal } from '../../components/Modal';
import { MODAL_TYPES_TO_KEY } from '../../constants/modal';

import { shortenAddress } from '../../helpers/formatters';

import { getWalletDetails } from '../../ducks/wallet';

// import { WalletStatusButton } from '../../Button';

//import Header from '../../components/Header';

const renderScreen = screen => {
	switch (screen) {
		case 'home':
		default:
			return <LPRewards />;
		case 'lpRewards':
			return <LPRewards />;
	}
};

const MainContainer = ({ currentTab, modalState: { modalType, modalProps }, setCurrentTab, walletDetails }) => {
	const { t } = useTranslation();
	const { currentWallet, networkName } = walletDetails;
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
							{t(`mainNavigation.tabs.${tab}`)}<Network>{shortenAddress(currentWallet)} • {networkName}</Network>
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
	background-color: ${props => props.theme.colorStyles.panels};
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
