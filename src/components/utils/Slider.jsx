import { useRef, useState } from "react";

import { motion, useDragControls } from "framer-motion";

const clamp = (value, min, max) => {
	return Math.min(max, Math.max(value, min));
};
function round(num, scale) {
	if (!("" + num).includes("e")) {
		return +(Math.round(num + "e+" + scale) + "e-" + scale);
	} else {
		var arr = ("" + num).split("e");
		var sig = "";
		if (+arr[1] + scale > 0) {
			sig = "+";
		}
		return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + scale)) + "e-" + scale);
	}
}
const rem = (val) => `${val}rem`;

const Slider = ({
	thumbSize = 1.25,
	thumbScale = 1.2,
	barSize = 0.25,
	accuracy = 0,
	min = 0,
	max = 100,
	defaultValue = 0,
	onChange,
	onInternalChange,
	color = {
		thumb: "#575757",
		thumbHover: false,
		thumbClick: false,
		bar: "#999997",
		barHover: false,
		progress: false,
		progressHover: false,
	},
}) => {
	const value = useRef(round(clamp(defaultValue, min, max), accuracy));
	const [percent, setPercent] = useState((value.current - min) / (max - min));

	const dragControls = useDragControls();
	const [dragging, setDragging] = useState(false);

	const thumbRef = useRef(null);
	const constraintsRef = useRef(null);

	const onDrag = () => {
		const thumb = thumbRef.current.getBoundingClientRect();
		const constraint = constraintsRef.current.getBoundingClientRect();

		const left = constraint.left + thumb.width / 2;
		const width = constraint.width - thumb.width;
		const pos = thumb.left + thumb.width / 2;

		const percent = (pos - left) / width;
		const newValue = round(min + percent * (max - min), accuracy);
		if (value.current != newValue) {
			value.current = newValue;
			if (onInternalChange) onInternalChange(value.current);
		}
		setPercent((_) => percent);
	};
	const onDragEnd = () => {
		if (onChange) onChange(value.current);
		setPercent((_) => (value.current - min) / (max - min));
		setDragging(false);
	};

	return (
		<div
			className="flex items-center"
			style={{
				height: rem(thumbSize),
				margin: rem(thumbSize * thumbScale - thumbSize),
			}}
			ref={constraintsRef}
		>
			<motion.div
				className="absolute"
				style={{
					width: `calc(100% - ${rem(thumbSize)})`,
					height: rem(barSize),
					borderRadius: rem(barSize / 2),
					left: rem(thumbSize / 2),
					backgroundColor: color.bar,
				}}
				whileHover={{
					backgroundColor: color.barHover ? color.barHover : color.bar,
				}}
			>
				<motion.div
					initial={{
						width: 0,
					}}
					animate={{
						width: `${percent * 100}%`,
					}}
					style={{
						height: rem(barSize),
						borderRadius: rem(barSize / 2),
						backgroundColor: color.progress ? color.progress : color.thumb,
					}}
					whileHover={{
						backgroundColor: color.progress
							? color.progressHover
								? color.progressHover
								: color.progress
							: color.thumb,
					}}
				></motion.div>
			</motion.div>
			<motion.div
				className="relative text-white"
				style={{
					height: rem(thumbSize),
					width: rem(thumbSize),
				}}
				animate={{
					left: `calc(${percent} * (100% - ${rem(thumbSize)}))`,
					scale: dragging ? thumbScale : 1,
				}}
				onTapStart={(e) => dragControls.start(e, { snapToCursor: true })}
			>
				<svg width="100%" height="100%">
					<motion.circle
						cx="50%"
						cy="50%"
						r="50%"
						style={{
							fill: color.thumb,
						}}
						whileHover={{
							fill: color.thumbHover ? color.thumbHover : color.thumb,
						}}
					/>
				</svg>
			</motion.div>
			<motion.div
				className="opacity-0"
				style={{ height: rem(thumbSize), width: rem(thumbSize) }}
				transition={{
					type: "tween",
				}}
				drag="x"
				dragControls={dragControls}
				dragConstraints={constraintsRef}
				dragMomentum={false}
				dragElastic={false}
				onDragStart={() => {
					setDragging(true);
				}}
				onDrag={onDrag}
				onDragEnd={onDragEnd}
				ref={thumbRef}
			></motion.div>
		</div>
	);
};

export default Slider;
