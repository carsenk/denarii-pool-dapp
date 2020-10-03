import React, { useContext } from 'react';
import { ThemeContext } from 'styled-components';

const Info = () => {
	const theme = useContext(ThemeContext);
	return (
		<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg">
			<g fill="none" fillRule="evenodd">
				<circle
					stroke={theme.colorStyles.background}
					fill={theme.colorStyles.tableBody}
					cx="12"
					cy="12"
					r="11.5"
				/>
				<path
					d="M9.4 10v-.832c0-.112.048-.16.16-.16h2.816c.112 0 .16.048.16.16v6.688h2.208c.112 0 .16.048.16.16v.864c0 .112-.048.16-.16.16H9.16c-.112 0-.16-.048-.16-.16v-.864c0-.112.048-.16.16-.16h2.128V10.16H9.56c-.112 0-.16-.048-.16-.16zm1.568-2.464V6.16c0-.112.048-.16.16-.16h1.376c.112 0 .16.048.16.16v1.376c0 .112-.048.16-.16.16h-1.376c-.112 0-.16-.048-.16-.16z"
					fill={theme.colorStyles.background}
				/>
			</g>
		</svg>
	);
};

export default Info;
