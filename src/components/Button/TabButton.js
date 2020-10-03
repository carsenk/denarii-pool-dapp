import React from 'react';
import styled from 'styled-components';

const ContentHeaderButton = ({ children, isSelected, onClick, disabled }) => {
	return (
		<Button onClick={onClick} isSelected={isSelected} disabled={disabled}>
			{children}
		</Button>
	);
};

const Button = styled.button`
	height: 85px;
	outline: none;
	padding-top: 8px;
	border: none;
	flex: 1;
	font-size: 32px;
	transition: all ease-in 0.1s;
	font-family: 'archia-medium';
	background-color: ${props => props.theme.colorStyles.background};
	color: ${props => props.theme.colorStyles.subtext};
	&:disabled {
		opacity: 0.3;
	}
`;

export default ContentHeaderButton;
