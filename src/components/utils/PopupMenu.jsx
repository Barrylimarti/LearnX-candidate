import { useRef } from "react";

import Popup from "reactjs-popup";

const PopupMenu = ({
	triggerContent,
	on = ["click"],
	children,
	position = "left top",
	offsetX,
	offsetY,
	...rest
}) => {
	const ref = useRef(null);
	return (
		<Popup
			trigger={triggerContent}
			on={on}
			{...rest}
			ref={ref}
			arrow={false}
			position={position}
			offsetX={offsetX}
			offsetY={offsetY}
		>
			{children(() => ref.current?.close())}
		</Popup>
	);
};

export default PopupMenu;
