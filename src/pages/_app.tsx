import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { AppProps as NextAppProps } from 'next/app';
import { RecoilRoot } from 'recoil';

import ModalError from '../components/ModalError';

import '../styles/main.css';

type CreateAppProps<P = any> = {
	pageProps: P;
} & Omit<NextAppProps<P>, 'pageProps'>;

type AppProps = CreateAppProps<{
	session: Session;
}>;

const MyApp = ({ Component, pageProps }: AppProps) => (
	<SessionProvider session={pageProps.session}>
		<RecoilRoot>
			<Component {...pageProps} />
			<ModalError />
		</RecoilRoot>
	</SessionProvider>
);

export default MyApp;
