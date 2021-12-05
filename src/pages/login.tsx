import React from 'react';

import { GetStaticProps, NextPage } from 'next';
import { getProviders, signIn } from 'next-auth/react';

import CustomHeader from '../components/CustomHeader';

type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

export interface LoginProps {
	providers: Awaited<ReturnType<typeof getProviders>>;
}

const Login: NextPage<LoginProps> = ({ providers }) => {
	return (
		<>
			<CustomHeader />

			<main className="h-screen overflow-hidden flex flex-col justify-center items-center bg-black text-white">
				<img className="w-52 mb-5" src="https://links.papareact.com/9xl" alt="logo" />

				{providers &&
					Object.values(providers).map((provider, i) => (
						<div key={i}>
							<button
								className="bg-[#18D860] p-5 rounded-full"
								onClick={() => {
									signIn(provider.id, { callbackUrl: '/' });
								}}
							>
								Login with {provider.name}
							</button>
						</div>
					))}
			</main>
		</>
	);
};

export const getStaticProps: GetStaticProps<LoginProps> = async () => {
	const providers = await getProviders();

	return {
		props: { providers },
	};
};

export default Login;
