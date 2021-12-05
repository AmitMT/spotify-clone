import Document, { Html, Head, Main, NextScript } from 'next/document';

import { AppConfig } from '../utils/AppConfig';

// Need to create a custom _document because i18n support is not compatible with `next export`.
class MyDocument extends (Document as any) {
	render() {
		return (
			<Html lang={AppConfig.locale}>
				<Head />
				<body style={{ WebkitTapHighlightColor: 'transparent' }}>
					<Main />
					<NextScript />
				</body>
			</Html>
		);
	}
}

export default MyDocument;
