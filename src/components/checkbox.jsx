import { forwardRef, useEffect, useState } from "react";

import { motion } from "framer-motion";

import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const CheckBox = forwardRef(({ label, value, onChange, defaultChecked, colors, ...rest }, ref) => {
	const [checked, setChecked] = useState(!!defaultChecked);

	useEffect(() => {
		if (onChange) onChange(checked);
	}, [checked]);

	return (
		<motion.div
			ref={ref}
			className="inline-flex items-center cursor-pointer"
			onClick={() => {
				setChecked((curr) => !curr);
			}}
		>
			<motion.div
				className="inline-flex w-4 h-4 border rounded-sm border-gray-500 mr-2 justify-center items-center shrink-0"
				transition={{
					type: "tween",
					duration: 0.4,
				}}
				animate={{
					borderColor: checked ? colors?.checked || "#7A77FF" : colors?.unchecked || "#777777",
					backgroundColor: checked ? colors?.checked || "#7A77FF" : colors?.unchecked || "#0000",
				}}
			>
				<FontAwesomeIcon icon={faCheck} className="text-xs" color="white" />
			</motion.div>
			<div className="select-none">{label}</div>
		</motion.div>
	);
});

export const CheckBoxLink = ({ link, label, ...rest }) => {
	return (
		<a href={link} onClick={(e) => e.stopPropagation()} {...rest}>
			{label}
		</a>
	);
};

export default CheckBox;
