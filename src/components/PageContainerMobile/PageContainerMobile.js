import React from 'react';
import styled from 'styled-components';

const PageContainerMobile = ({ children }) => {
	return (
		<Wrapper>
			<Container>{children}</Container>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 10px 8px 0 8px;
`;

const Container = styled.div`
	position: relative;
	width: 100%;
	margin: 0 auto;
	padding: 0 5px;
	overflow: hidden;
	min-height: 835px;
`;

export default PageContainerMobile;
