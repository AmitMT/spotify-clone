import React, { FC, Fragment, useEffect, useState } from 'react';

import { Transition, Dialog } from '@headlessui/react';
import { useRecoilState } from 'recoil';

import { errorState } from '../atoms/errorAtom';

export interface ModalErrorProps {}

const ModalError: FC<ModalErrorProps> = ({ ...props }) => {
	const [error] = useRecoilState(errorState);
	const [show, setShow] = useState(!!error);

	useEffect(() => {
		if (error != null) setShow(true);
	}, [error]);

	return (
		<Transition appear show={show} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				onClose={() => {
					setShow(false);
				}}
			>
				<div className="min-h-screen px-4 text-center">
					<Transition.Child
						as={Fragment}
						enter="transition-all ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-all ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 backdrop-blur-md backdrop-brightness-90" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="inline-block h-screen align-middle" aria-hidden="true">
						&#8203;
					</span>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div
							className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-500 bg-opacity-10 backdrop-blur-md shadow-xl rounded-2xl"
							{...props}
						>
							<Dialog.Title as="h3" className="text-xl font-semibold text-white">
								{error?.title}
							</Dialog.Title>
							<div className="mt-2">
								<p className="text-gray-500">{error?.message}</p>
							</div>

							<button
								className="flex justify-center mt-6 px-4 py-2 text-sm font-medium bg-white border border-transparent rounded-md transition-transform hover:scale-110 active:!scale-100"
								onClick={() => {
									setShow(false);
								}}
							>
								Got it, thanks!
							</button>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default ModalError;
