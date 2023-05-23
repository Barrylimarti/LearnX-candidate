export default function HugeIcon({
	icon = "unknown",
	solid = false,
	size = "24px",
	className,
	...rest
}) {
	return (
		<>
			<div
				className={`bg-current ${className}`}
				style={{
					display: !solid ? "inline-block" : "none",
					height: size,
					width: size,
					// icon definition
					maskImage: `url('/icons/outlined/${icon}.svg')`,
					WebkitMaskImage: `url('/icons/outlined/${icon}.svg')`,
					maskSize: "contain",
					WebkitMaskSize: "contain",
					maskRepeat: "no-repeat",
					WebkitMaskRepeat: "no-repeat",
					maskPosition: "center center",
					WebkitMaskPosition: "center center",
				}}
				{...rest}
			></div>
			<div
				className={`bg-current ${className}`}
				style={{
					display: solid ? "inline-block" : "none",
					height: size,
					width: size,
					// icon definition
					maskImage: `url('/icons/solid/${icon}.svg')`,
					WebkitMaskImage: `url('/icons/solid/${icon}.svg')`,
					maskSize: "contain",
					WebkitMaskSize: "contain",
					maskRepeat: "no-repeat",
					WebkitMaskRepeat: "no-repeat",
					maskPosition: "center center",
					WebkitMaskPosition: "center center",
				}}
				{...rest}
			></div>
		</>
	);
}
