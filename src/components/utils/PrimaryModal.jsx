import { forwardRef, useState } from "react";

import { XCircleFill } from "react-bootstrap-icons";

import Modal from "../Modal";

const PrimaryModal = forwardRef(({ title, children }, ref) => {
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
					<h1 className="text-xl font-semibold text-letters-secondary">{title}</h1>
					<button onClick={closeModal}>
						<XCircleFill size={"2rem"} color="red" />
					</button>
				</div>
				{children ? <div className="mt-8">{children(closeModal)}</div> : null}
			</div>
		</Modal>
	);
});

export default PrimaryModal;
