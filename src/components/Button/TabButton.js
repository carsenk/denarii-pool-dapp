import React from 'react';
import styled from 'styled-components';

const ContentHeaderButton = ({ children, isSelected, onClick, disabled }) => {
	return (
		<Button onClick={onClick} isSelected={isSelected} disabled={disabled}>
			<ActionLogo src={"/images/aristakepool.png"} big /><Title>{children}</Title>
		</Button>
	);
};

const Button = styled.button`
	height: 100px;
	outline: none;
	padding: 8px;
	border: none;
	flex: 1;
	font-size: 32px;
	transition: all ease-in 0.1s;
	font-family: 'Poppins';
	background-color: ${props => props.theme.colorStyles.background};
	color: ${props => props.theme.colorStyles.subtext};
	&:disabled {
		opacity: 0.3;
	}
`;

const ActionLogo = styled.img`
	width: 64px;
	height: 64px;
	margin-right:10px;
	vertical-align: middle;
`;

const Title = styled.span`
	font-size:26px;
	vertical-align: middle;
`;
export default ContentHeaderButton;
