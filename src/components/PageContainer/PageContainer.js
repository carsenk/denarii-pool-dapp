import React from 'react';
import styled from 'styled-components';

const PageContainer = ({ children }) => {
	return (
		<Wrapper>
			<Container>{children}</Container>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	padding: 10px 48px 0 48px;
`;

const Container = styled.div`
	position: relative;
	width: 80%;
	margin: 0 auto;
	padding: 0 5px;
	overflow: hidden;
	min-height: 835px;
`;

export default PageContainer;
