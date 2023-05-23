import { motion } from "framer-motion";
import { NavLink, useLocation } from "react-router-dom";

import IconAnalytics from "../../assets/icons/analytics.png";
import IconHome from "../../assets/icons/home.png";
import IconInvites from "../../assets/icons/invites.png";
import IconMessage from "../../assets/icons/messaging.png";
import IconProfile from "../../assets/icons/user.png";
import { useMediaQuery } from "../../lib/useMediaQuery";

const MotionEnabledNavLink = motion(NavLink);

const BottomBarLink = ({ to = "", label = "", icon }) => {
	return (
		<MotionEnabledNavLink
			to={to}
			className={({
				isActive,
			}) => `flex flex-col items-center gap-1 flex-nowrap px-2 py-[0.32rem] rounded-md text-sm xfont-medium
			overflow-x-hidden text-letters-secondary ${
				isActive ? "bg-background-200 group active text-brand-primary" : "hover:bg-background-100"
			}`}
			whileTap={{
				scale: 0.9,
			}}
			transition={{ type: "tween", duration: 0.1 }}
		>
			<div className="shrink-0 flex items-center justify-center w-10 h-10 p-1.5">
				<div
					className="w-full aspect-square bg-letters-tertiary group-[.active]:bg-brand-primary"
					style={{
						maskImage: `url('${icon}')`,
						WebkitMaskImage: `url('${icon}')`,
						maskSize: "contain",
						WebkitMaskSize: "contain",
						maskRepeat: "no-repeat",
						WebkitMaskRepeat: "no-repeat",
						maskPosition: "center center",
						WebkitMaskPosition: "center center",
					}}
				></div>
				{/* <img src={icon} className="w-full h-full" /> */}
			</div>
			<div className="grow hidden items-center group-[.active]:flex">
				<p className="grow text-[0.7rem] font-medium whitespace-nowrap group-[.active]:text-brand-primary">
					{label}
				</p>
			</div>
		</MotionEnabledNavLink>
	);
};

const BottomBar = () => {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const location = useLocation();
	let title =
		location.state?.title ||
		(location.pathname
			?.split("/")
			.filter((x) => !!x)[0]
			?.split("-")
			.map((x) => (!!x ? x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase() : ""))
			.join(" ") ??
			"Home");
	//  && !(title == "Messaging" && location.pathname?.split("/").length > 2)
	return (
		<div
			className={`${
				isMobile ? "block" : "hidden"
			} shrink-0 h-[6rem] w-full border-r-1 bg-background-0 z-30`}
		>
			<nav className="grid grid-cols-5 items-center justify-around gap-3 h-full p-3">
				<BottomBarLink to="/home" label="Home" icon={IconHome} iconBackground="#7A4CFC" />
				<BottomBarLink
					to="/messaging"
					label="Messaging"
					icon={IconMessage}
					iconBackground="#FE983A"
				/>
				<BottomBarLink
					to="/invites"
					label="Job Invites"
					icon={IconInvites}
					iconBackground="#DDBB7A"
					sideText=""
				/>
				<BottomBarLink
					to="/analytics"
					label="Analytics"
					icon={IconAnalytics}
					iconBackground="#82DD7A"
				/>
				<BottomBarLink
					to="/profile"
					label="My Profile"
					icon={IconProfile}
					iconBackground="#B5E369"
				/>
			</nav>
		</div>
	);
};

export default BottomBar;
