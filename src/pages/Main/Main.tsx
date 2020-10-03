import React, { FC } from 'react';
import styled from 'styled-components';

import MintrPanel from 'screens/MintrPanel';

const Main: FC = () => (
	<MainWrapper>
		<MintrPanel />
	</MainWrapper>
);

const MainWrapper = styled.div`
	display: flex;
	width: 100%;
`;

export default Main;
