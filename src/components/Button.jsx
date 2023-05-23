import { cx } from "classix";
import { motion } from "framer-motion";

export const IconButton = ({
	className,
	theme = "primary",
	color,
	size,
	square,
	icon,
	onClick,
	...rest
}) => {
	return (
		<button
			className={cx(
				className || "",
				// make the button flex and add an 8px gap to elements
				"flex items-center justify-center gap-2",

				// background properties
				theme == "ghost"
					? "bg-transparent"
					: theme == "primary"
					? color
						? `bg-${color}-default`
						: "bg-gradient-primary"
					: "bg-neutral-0",

				// border properties
				["link", "primary", "text"].includes(theme) ? "border-none" : "border-2",
				theme == "dashed" ? "border-dashed" : "border-solid",
				color ? `border-${color}-default` : "border-primary-default",
				square ? "rounded-none" : "rounded-full",

				//padding
				size == "lg" ? "p-3" : size == "sm" ? "p-1" : "p-2",

				// text properties
				theme == "primary"
					? "text-neutral-0"
					: color
					? `text-${color}-default`
					: "text-primary-default"
			)}
		>
			<div className="hidden bg-danger-default bg-info-default bg-success-default bg-warning-default"></div>
			{icon}
		</button>
	);
};

export default function Button({
	type = "button",
	className,
	as,
	theme,
	color,
	size,
	square,
	beforeIcon,
	afterIcon,
	label,
	onClick,
	...rest
}) {
	return (
		<motion.button
			type={type}
			className={cx(
				className || "",
				// make the button flex and add an 8px gap to elements
				"flex items-center justify-center gap-2",

				// background properties
				theme == "ghost"
					? "bg-transparent"
					: theme == "primary"
					? color
						? `bg-${color}-default`
						: "bg-gradient-primary"
					: "bg-neutral-0",

				// border properties
				["link", "primary", "text"].includes(theme) ? "border-none" : "border-2",
				theme == "dashed" ? "border-dashed" : "border-solid",
				color ? `border-${color}-default` : "border-primary-default",
				square ? "rounded-none" : "rounded-lg",

				//padding
				size == "lg" ? "px-9 py-4" : size == "sm" ? "px-4 py-2" : "px-6 py-3",

				// text properties
				theme == "primary"
					? "text-neutral-0"
					: color
					? `text-${color}-default`
					: "text-primary-default"
			)}
			onClick={onClick}
			{...rest}
		>
			<div className="hidden bg-danger-default bg-info-default bg-success-default bg-warning-default"></div>
			{beforeIcon && (
				<span className="inline-flex justify-center items-center w-6 h-6 overflow-hidden">
					{beforeIcon}
				</span>
			)}
			<span className="text-base">{label}</span>
			{!beforeIcon && afterIcon && <span>{afterIcon}</span>}
		</motion.button>
	);
}
