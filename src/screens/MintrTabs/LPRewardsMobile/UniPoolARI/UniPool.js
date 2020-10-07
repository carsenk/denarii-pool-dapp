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

const UniPool = ({ goBack, walletDetails }) => {
	const [hasAllowance, setAllowance] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [stakeUNIAmount, setUNIStakeAmount] = useState('');
	const { currentWallet } = walletDetails;

	const fetchAllowance = useCallback(async () => {
		if (!snxJSConnector.initialized) return;
		const { uniswapV2Contract, unipoolARIContract } = snxJSConnector;
		try {
			setIsLoading(true);
			const allowance = await uniswapV2Contract.allowance(
				currentWallet,
				unipoolARIContract.address
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
		const { uniswapV2Contract, unipoolARIContract } = snxJSConnector;

		uniswapV2Contract.on('Approval', (owner, spender) => {
			if (owner === currentWallet && spender === unipoolARIContract.address) {
				setAllowance(true);
			}
		});

		return () => {
			if (snxJSConnector.initialized) {
				uniswapV2Contract.removeAllListeners('Approval');
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

export default connect(mapStateToProps, {})(UniPool);
