import React from 'react';

import { GetServerSideProps, NextPage } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';

import Center from '../components/Center';
import CustomHeader from '../components/CustomHeader';
import Player from '../components/Player';
import Sidebar from '../components/Sidebar';

export interface PageProps {
	session: Session | null;
}

const Index: NextPage<PageProps> = () => {
	return (
		<>
			<CustomHeader />

			<main className="h-screen overflow-hidden flex flex-col justify-center items-center bg-black text-white">
				<div className="flex-1 flex justify-center items-center w-full overflow-hidden">
					{/* Sidebar */}
					<Sidebar />

					{/* Main Content */}
					<Center />
				</div>

				<div className="w-full">
					{/* Player */}
					<Player />
				</div>
			</main>
		</>
	);
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
	const session = await getSession(context);

	return {
		props: { session },
	};
};

export default Index;
