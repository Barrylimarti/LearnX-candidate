import { motion } from "framer-motion";
import { LineWave } from "react-loader-spinner";

export default function Button({
	theme,
	label,
	icon,
	iconPosition = "left",
	isLoading = false,
	loadingIndicator,
	...rest
}) {
	const variants = {
		primary: {
			normal: {
				backgroundColor: "#7A77FF",
				borderColor: "#7A77FF",
				color: "#ffffff",
			},
			hovered: {
				backgroundColor: "#7A77FF14",
				borderColor: "#7A77FF",
				color: "#7A77FF",
			},
		},
		secondary: {
			normal: {
				backgroundColor: "#7A77FF01",
				borderColor: "#7A77FF",
				color: "#7A77FF",
			},
			hovered: {
				backgroundColor: "#7A77FF28",
				borderColor: "#7A77FF",
				color: "#7A77FF",
			},
		},
		tertiary: {
			normal: {
				backgroundColor: "#343434",
				borderColor: "#343434",
				color: "#ffffff",
			},
			hovered: {
				backgroundColor: "#34343401",
				borderColor: "#343434",
				color: "#343434",
			},
		},
	};

	return (
		<motion.button
			transition={{ duration: 0.2 }}
			className="flex items-center justify-center gap-2 min-w-[5rem] py-1.5 px-2 border-2 rounded-lg text-xs font-medium"
			variants={variants[theme]}
			initial={"normal"}
			whileHover={!isLoading ? "hovered" : "normal"}
			disabled={isLoading}
			{...rest}
		>
			{!isLoading ? (
				<>
					{iconPosition == "left" ? icon : null}
					{label}
					{iconPosition == "right" ? icon : null}
				</>
			) : loadingIndicator ? (
				loadingIndicator
			) : (
				<LineWave
					height="16"
					width="16"
					color={variants[theme].normal.color}
					ariaLabel="line-wave"
					wrapperStyle={{}}
					wrapperClass="relative left-2 bottom-2 scale-[3.5]"
					visible={true}
					firstLineColor=""
					middleLineColor=""
					lastLineColor=""
				/>
			)}
		</motion.button>
	);
}
