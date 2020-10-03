import React from 'react';
import styled from 'styled-components';
import { ButtonSecondaryLabel } from '../Typography';

const ButtonSecondary = ({
	children,
	onClick,
	as = 'button',
	href = undefined,
	target = undefined,
	width,
	height,
}) => {
	return (
		<Button height={height} width={width} target={target} href={href} as={as} onClick={onClick}>
			<ButtonSecondaryLabel>{children}</ButtonSecondaryLabel>
		</Button>
	);
};

const Button = styled.button`
	width: ${props => (props.width ? props.width : '400px')};
	text-decoration: none;
	display: flex;
	justify-content: center;
	align-items: center;
	height: ${props => (props.height ? props.height : '72px')};
	text-transform: uppercase;
	cursor: pointer;
	background-color: ${props => props.theme.colorStyles.buttonSecondary};
	transition: all ease-in 0.1s;
	&:hover {
		background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
	}
	border-radius: 10px;
	border-style: none;
`;

export default ButtonSecondary;
