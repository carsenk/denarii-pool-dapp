import React from 'react';
import styled from 'styled-components';

import { DataHeaderLarge } from '../Typography';

const DataBox = ({ heading, icon, body }) => {
	return (
		<Box>
			<DataHeaderLarge>{heading}</DataHeaderLarge>
			<Image>{icon}</Image>
			<Amount>{body}</Amount>
		</Box>
	);
};

const Box = styled.div`
	flex: 1;
	padding: 18px;
	margin: 10px;
	white-space: nowrap;
	border: 4px solid #55007A;
	background-color: #300047;
	border-radius: 15px;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const Amount = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'EuclidCircularB-regular';
	font-size: 16px;
	margin: 16px 0px 0px 0px;
`;

const Image = styled.span`
	color: ${props => props.theme.colorStyles.hyperlink};
	font-family: 'EuclidCircularB-regular';
	font-size: 16px;
	margin: 16px 0px 0px 0px;
`;

export default DataBox;
