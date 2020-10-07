import React, { FC } from 'react';
import styled from 'styled-components';

import MintrPanelMobile from 'screens/MintrPanelMobile';

const MainMobile: FC = () => (
	<MainWrapper>
		<MintrPanelMobile />
	</MainWrapper>
);

const MainWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export default MainMobile;
