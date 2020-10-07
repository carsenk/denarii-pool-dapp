import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

import snxJSConnector, { connectToWallet } from '../../helpers/snxJSConnector';

import { setCurrentPage } from '../../ducks/ui';
import { updateWalletStatus, getWalletDetails } from '../../ducks/wallet';
import { getCurrentTheme } from '../../ducks/ui';

import {
	hasWeb3,
	SUPPORTED_WALLETS_MOBILE,
	onMetamaskAccountChange,
	SUPPORTED_WALLETS_MOBILE_MAP,
} from '../../helpers/networkHelper';
import { H1, H2, PMega, ButtonTertiaryLabel } from '../../components/Typography';
import Logo from '../../components/Logo';
// import Header from '../../components/Header';

import { PAGES_BY_KEY } from '../../constants/ui';
import { ExternalLink } from 'styles/common';

const onWalletClick = ({ wallet, derivationPath, updateWalletStatus, setCurrentPage }) => {
	return async () => {
		const walletStatus = await connectToWallet({ wallet, derivationPath });
		updateWalletStatus({ ...walletStatus, availableWallets: [] });
		if (walletStatus && walletStatus.unlocked && walletStatus.currentWallet) {
			if (walletStatus.walletType === SUPPORTED_WALLETS_MOBILE_MAP.METAMASK) {
				onMetamaskAccountChange(async () => {
					const address = await snxJSConnector.signer.getNextAddresses();
					const signer = new snxJSConnector.signers[SUPPORTED_WALLETS_MOBILE_MAP.METAMASK]({});
					snxJSConnector.setContractSettings({
						networkId: walletStatus.networkId,
						signer,
					});
					if (address && address[0]) {
						updateWalletStatus({ currentWallet: address[0] });
					}
				});
			}
			setCurrentPage(PAGES_BY_KEY.MAINMOBILE);
		} else setCurrentPage(PAGES_BY_KEY.WALLET_SELECTION);
	};
};

const OnBoardingMessage = () => {
	const { t } = useTranslation();
	return (
		<>
			<OnboardingH1>{t('onboarding.slides.welcome.title')}</OnboardingH1>
			<OnboardingIllustrationContainer>
				<OnboardingIllustration
					style={{ marginTop: '20px', marginBottom: '20px', width: '400px', height: '220px' }}
					src={`/images/arilp.png`}
				/>
			</OnboardingIllustrationContainer>
			<OnboardingPMega>{t('onboarding.slides.welcome.description')}</OnboardingPMega>
		</>
	);
};

const MobLanding = ({ currentTheme, walletDetails, updateWalletStatus, setCurrentPage }) => {
	const { t } = useTranslation();

	const { derivationPath } = walletDetails;
	return (
		<LandingPageContainer>
			<OnboardingContainer>
				<Header>
				</Header>
				<OnBoardingMessage />
			</OnboardingContainer>
			<WalletConnectContainer>
				<Wallets>
					<PMega m={'10px 0 20px 0'}>{t('onboarding.walletConnection.title')}</PMega>
					{SUPPORTED_WALLETS_MOBILE.map(wallet => {
						//const noMetamask = wallet === 'Metamask' && !hasWeb3();
						return (
							<Button
								//disabled={noMetamask}
								key={wallet}
								onClick={onWalletClick({
									wallet,
									derivationPath,
									updateWalletStatus,
									setCurrentPage,
								})}
							>
								<Icon src={`images/wallets/${wallet.toLowerCase()}.svg`} />
								<WalletConnectionH2>{wallet}</WalletConnectionH2>
							</Button>
						);
					})}
				</Wallets>
				<BottomLinks>
					<Link href="https://discord.gg/ryVyZDq" target="_blank">
						<ButtonTertiaryLabel>
							<LinkText>Discord</LinkText>
						</ButtonTertiaryLabel>
					</Link>
					<Link href={`https://ari.finance`} target="_blank">
						<ButtonTertiaryLabel><LinkText>{t('button.whatIsSynthetix')}</LinkText></ButtonTertiaryLabel>
					</Link>
					<ExternalLink href={`https://etherscan.io/token/0x8a8b5318d3a59fa6d1d0a83a1b0506f2796b5670`}>
						<VersionLabel>v1.0.4 Denarii [ARI] Mobile</VersionLabel>
					</ExternalLink>
					<ExternalLink href={`https://ipfs.io/ipns/k51qzi5uqu5dgj1au28jx96dzuo9hctce06kk92po2gd3x5n0r16fvqjeyjjhp/`}>
						<VersionLabel>IPFS Hosted and Mirrored: k51qzi5uqu5dgj1au28jx96dzuo9hctce06kk92po2gd3x5n0r16fvqjeyjjhp</VersionLabel>
					</ExternalLink>
				</BottomLinks>
			</WalletConnectContainer>
		</LandingPageContainer>
	);
};

const LandingPageContainer = styled.div`

`;

const OnboardingContainer = styled.div`
	width: 100%;
	padding: 42px;
	background-color: ${props => props.theme.colorStyles.panels};
	border-right: 1px solid ${props => props.theme.colorStyles.borders};
	justify-content: center;
`;

const OnboardingH1 = styled(H1)`
	text-transform: none;
	margin-bottom: 24px;
	text-align: center;
	justify-content: center;
`;

const OnboardingPMega = styled(PMega)`
	margin: 20px auto 0 auto;
	font-size: 18px;
	line-height: 25px;
	width: 100%;
	max-width: 600px;
`;

const OnboardingIllustrationContainer = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
	justify-content: center;
	text-align: center;
`;

const OnboardingIllustration = styled.img`
	width: 232px;
	height: 232px;
`;

const WalletConnectContainer = styled.div`
	z-index: 100;
	max-width: 500px;
	padding: 32px;
	text-align: center;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	background-color: ${props => props.theme.colorStyles.background};
`;

const Wallets = styled.div`
	display: flex;
	align-items: center;
	flex-direction: column;
	width: 100%;
`;

const Button = styled.button`
	height: 80px;
	width: 100%;
	padding: 16px 48px;
	margin: 10px 0;
	display: flex;
	justify-content: left;
	align-items: center;
	background-color: ${props => props.theme.colorStyles.panelButton};
	color: ${props => props.theme.colorStyles.tableBody};
	border-radius: 15px;
	border-style: none;
	box-shadow: 0px 0px 0px 0px ${props => props.theme.colorStyles.shadow1};
	opacity: ${props => (props.disabled ? '0.4' : 1)};
	cursor: pointer;
	transition: all 0.1s ease;
	:hover {
		transform: translateY(-2px);
	}
`;

const WalletConnectionH2 = styled(H2)`
	text-transform: capitalize;
	margin: 0;
	font-size: 18px;
	color: ${props => props.theme.colorStyles.panelText};
`;

const Icon = styled.img`
	width: 40px;
	height: 40px;
	margin-right: 24px;
`;

const LinkText = styled.span`
	color: ${props => props.theme.colorStyles.panelText};
	font-size: 16px;
`;

const Link = styled.a`
	background-color: ${props => props.theme.colorStyles.buttonPrimaryBg};
	border: 0px solid ${props => props.theme.colorStyles.borders};
	text-transform: none;
	font-size: 32px;
	text-decoration: none;
	width: 90%;
	cursor: pointer;
	height: 50px;
	border-radius: 15px;
	margin: 0 auto;
	margin-top: 20px;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const BottomLinks = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
`;

const Header = styled.div`
	width: 100%;
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const VersionLabel = styled.div`
	text-align: right;
	font-size: 12px;
	margin-top: 5px;
	color: ${props => props.theme.colorStyles.body};
	text-decoration: underline;
`;

const mapStateToProps = state => ({
	currentTheme: getCurrentTheme(state),
	walletDetails: getWalletDetails(state),
});

const mapDispatchToProps = {
	setCurrentPage,
	updateWalletStatus,
};

export default connect(mapStateToProps, mapDispatchToProps)(MobLanding);
