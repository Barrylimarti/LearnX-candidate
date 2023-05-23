import { forwardRef, useState } from "react";

import { XCircleFill } from "react-bootstrap-icons";

import Modal from "../Modal";

const PrimaryModalEx = forwardRef(({ title, child: Component, childProps }, ref) => {
	const [open, setOpen] = useState(false);
	const closeModal = () => {
		setOpen(false);
	};

	ref.current = {
		open: () => setOpen((_) => true),
		toggle: () => setOpen((o) => !o),
		close: () => setOpen((_) => false),
	};

	return (
		<Modal isOpen={open} onRequestClose={closeModal}>
			<div className="p-8">
				<div className="flex justify-between items-center">
					<h1 className="text-4xl font-semibold text-primary-default">{title}</h1>
					<button onClick={closeModal}>
						<XCircleFill size={"2rem"} color="red" />
					</button>
				</div>
				<div className="mt-8">
					{Component ? <Component closeModal={closeModal} {...childProps} /> : null}
				</div>
			</div>
		</Modal>
	);
});

export default PrimaryModalEx;
