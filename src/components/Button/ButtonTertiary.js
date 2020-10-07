import React from 'react';
import styled from 'styled-components';
import { ButtonTertiaryLabel } from '../Typography';

const ButtonTertiary = ({
	children,
	onClick,
	as = 'button',
	href = undefined,
	target = undefined,
	disabled,
	style,
}) => {
	return (
		<Button disabled={disabled} target={target} href={href} as={as} onClick={onClick} style={style}>
			<ButtonTertiaryLabel>{children}</ButtonTertiaryLabel>
		</Button>
	);
};

const Button = styled.button`
	background-color: ${props => props.theme.colorStyles.buttonSecondary};
	border: 0px solid ${props => props.theme.colorStyles.borders};
	height: 40px;
	padding: 2px 20px 0 20px;
	border-radius: 15px;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font-size: 16px;
	transition: all ease-in 0.1s;
	&:hover,
	&:focus {
		transform: translateY(-2px);
	}
	cursor: pointer;
	text-decoration: none;
	&:disabled {
		opacity: 0.4;
		pointer-events: none;
	}
`;

export default ButtonTertiary;
