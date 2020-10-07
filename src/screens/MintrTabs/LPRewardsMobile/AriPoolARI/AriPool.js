import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';

import snxJSConnector from '../../../../helpers/snxJSConnector';
import { getWalletDetails } from '../../../../ducks/wallet';

import { bigNumberFormatter } from '../../../../helpers/formatters';

import PageContainerMobile from '../../../../components/PageContainerMobile';
import Spinner from '../../../../components/Spinner';

import SetAllowance from './SetAllowance';
import Stake from './Stake';

const AriPool = ({ goBack, walletDetails }) => {
	const [hasAllowance, setAllowance] = useState(false);
	const [stakeAmount, setStakeAmount] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const { currentWallet } = walletDetails;

	const fetchAllowance = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		const { aripoolStakeContract, aripoolARIContract } = snxJSConnector;
		try {
			setIsLoading(true);
			const allowance = await aripoolStakeContract.allowance(
				currentWallet,
				aripoolARIContract.address
			);
			setAllowance(!!bigNumberFormatter(allowance));
			setIsLoading(false);
		} catch (e) {
			console.log(e);
			setIsLoading(false);
			setAllowance(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet, snxJSConnector.initialized]);

	useEffect(() => {
		fetchAllowance();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [fetchAllowance]);

	useEffect(() => {
		if (!currentWallet) return;
		const { aripoolStakeContract, aripoolARIContract } = snxJSConnector;

		aripoolStakeContract.on('Approval', (owner, spender) => {
			if (owner === currentWallet && spender === aripoolARIContract.address) {
				setAllowance(true);
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				aripoolStakeContract.removeAllListeners('Approval');
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentWallet]);

	return (
		<PageContainerMobile>
			{isLoading ? (
				<SpinnerContainer>
					<Spinner />
				</SpinnerContainer>
			) : !hasAllowance ? (
				<SetAllowance goBack={goBack} />
			) : (
				<Stake goBack={goBack} />
			)}
		</PageContainerMobile>
	);
};

const SpinnerContainer = styled.div`
	margin: 100px;
`;

const mapStateToProps = state => ({
	walletDetails: getWalletDetails(state),
});

export default connect(mapStateToProps, {})(AriPool);
