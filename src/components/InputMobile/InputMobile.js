import React, { useState } from 'react';
import OutsideClickHandler from 'react-outside-click-handler';
import styled, { keyframes } from 'styled-components';

import { PLarge } from '../Typography';

import { withTranslation } from 'react-i18next';

// const getSynthList = (synths, search) => {
// 	if (!search) return synths;
// 	return synths.filter(synth => synth.name.toLowerCase().includes(search.toLowerCase()));
// };

const InputMobile = ({
	t,
	placeholder,
	onChange,
	value,
	// currentSynth,
	// synths,
	// singleSynth = false,
	// onSynthChange,
	isDisabled = false,
}) => {
	// const [listIsOpen, toggleList] = useState(false);
	// const [currentSearch, updateCurrentSearch] = useState('');
	// const synthList = getSynthList(synths, currentSearch);

	return (
			<InputWrapper disabled={isDisabled}>
				<InputInner>
					<InputElement value={value} onChange={onChange} placeholder={placeholder} type="text" />
				</InputInner>
			</InputWrapper>
	);
};

// const Dropdown = ({ onClick, synth, singleSynth }) => {
// 	const synthName = singleSynth || synth || 'sUSD';
// 	return (
// 		<Button disabled={singleSynth} onClick={onClick}>
// 			<CurrencyIcon src={`/images/currencies/${synthName}.svg`} />
// 			<PLarge>{synthName}</PLarge>
// 			<CaretDownIcon isHidden={singleSynth} src="/images/caret-down.svg" />
// 		</Button>
// 	);
// };

export const SimpleInputMobile = ({
	value,
	onChange,
	type = 'text',
	step,
	placeholder,
	name,
	className,
}) => {
	return (
		<InputWrapper className={className}>
			<InputInner>
				<InputElement
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					type={type}
					step={step}
					name={name}
				/>
			</InputInner>
		</InputWrapper>
	);
};

const Button = styled.button`
	cursor: pointer;
	max-width: 120px;
	z-index: 10;
	display: flex;
	align-items: center;
	text-align: center;
	padding: 0 16px;
	height: 100%;
	border: none;
	border-right: 1px solid ${props => props.theme.colorStyles.borders};
	justify-content: space-between;
	background-color: ${props => props.theme.colorStyles.buttonTertiaryBgFocus};
`;

const InputWrapper = styled.div`
	position: relative;
	width: 50%;
	margin: 0 auto;
	margin-right: 34px;
	color: #FFF;
	opacity: ${props => (props.disabled ? '0.6' : 1)};
	& input {
		pointer-events: ${props => (props.disabled ? 'none' : 'auto')};
	}
`;

const InputInner = styled.div`
	display: flex;
	width: 100%;
	border-radius: 10px;
	margin-right: 34px;
	height: 64px;
	border: 1px solid ${props => props.theme.colorStyles.borders};
	background-color: ${props => props.theme.colorStyles.panelButton};
	align-items: center;
	color: #FFF;
	justify-content: center;
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RightComponentWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: auto;
	padding: 16px;
`;

const InputElement = styled.input`
	width: 100%;
	height: 100%;
	padding: 16px;
	margin-right: 34px;
	border: none;
	background-color: ${props => props.theme.colorStyles.panelButton};
	outline: none;
	font-size: 20px;
	font-family: 'EuclidCircularB-regular';
	color: #FFF;
	border-radius: 10px;
`;

export default withTranslation()(InputMobile);
