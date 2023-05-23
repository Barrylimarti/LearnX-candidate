import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";
import userSelector from "../../state/user";
import HugeIcon from "../utils/HugeIcon";

const MotionEnabledNavLink = motion(NavLink);

const SidebarLink = ({ to = "", label = "", icon, sideText = "", numberColor = "" }) => {
	return (
		<MotionEnabledNavLink
			to={to}
			className={({ isActive }) =>
				`overflow-x-hidden rounded-md ${
					isActive ? " text-brand-primary font-medium bg-[#F6F9FF]" : "text-letters-secondary"
				}`
			}
			whileHover={{
				scale: 1.05,
			}}
			transition={{ type: "tween", duration: 0.1 }}
		>
			{({ isActive }) => (
				<div
					className="w-full h-fit flex items-center gap-2 flex-nowrap px-2 py-[0.32rem] rounded-md text-sm hover:bg-background-100"
					style={{
						boxShadow: isActive ? "inset 1px 1px 12px rgba(103, 82, 232, 0.1)" : "none",
					}}
				>
					<div className="shrink-0 flex items-center justify-center w-8 h-8">
						<HugeIcon className={"text-brand-primary"} solid={true} icon={icon} />
					</div>
					<div className="grow flex items-center">
						<p className="grow whitespace-nowrap font-medium">{label}</p>
						{sideText ? (
							<p className="shrink-0 px-2 py-1 rounded-xl bg-background-200 text-[0.7rem] text-blue-500">
								{sideText}
							</p>
						) : null}
					</div>
				</div>
			)}
		</MotionEnabledNavLink>
	);
};

const SidebarCommunity = ({ name, image, user_count }) => {
	return (
		<MotionEnabledNavLink
			to={`/community/${name.replace(/\s+/g, "-")}`}
			className={({
				isActive,
			}) => `flex items-center gap-2 flex-nowrap px-2 py-[0.32rem] rounded-md text-[0.9rem] font-medium
			overflow-x-hidden ${
				isActive ? "bg-background-200 text-blue-500" : "text-black hover:bg-background-100"
			}`}
			whileHover={{
				scale: "1.05",
			}}
			transition={{ type: "tween", duration: 0.1 }}
		>
			<div className="shrink-0 flex items-center justify-center w-8 h-8">
				<img src={image} className="w-full h-full rounded-full object-cover" />
			</div>
			<div className="grow">
				<p className="whitespace-nowrap overflow-ellipsis">{name}</p>
				<p className="text-xs text-gray-500">{user_count} members</p>
			</div>
		</MotionEnabledNavLink>
	);
};

const SidebarCommunities = () => {
	const user = useRecoilValue(userSelector);
	const [communities, setCommunities] = useState([]);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/list", { userOnly: true }).then(setCommunities).catch(console.error);
	}, [user]);

	return (
		<motion.nav className="flex flex-col">
			<div className="flex mb-4">
				<h4 className="grow font-semibold text-brand-primary">My Communities</h4>
				{/* <p className="shrink-0 px-2 py-1 rounded-xl bg-background-200 text-[0.7rem] text-blue-500">
					{communities.length < 10 ? "0" : ""}
					{communities.length}
				</p> */}
			</div>
			{communities.length ? (
				communities.map((community) => <SidebarCommunity key={community._id} {...community} />)
			) : (
				<p className="px-10 text-center text-xs text-letters-tertiary">
					Join communities that'll show up here
				</p>
			)}
		</motion.nav>
	);
};

const SideBar = () => {
	const isMobile = useMediaQuery("(max-width: 768px)");

	return (
		<>
			<div
				className={`${
					isMobile ? "hidden" : "block"
				} fixed shrink-0 w-[16rem] h-[calc(100vh_-_5rem)] border-r-1 bg-background-0 z-30`}
			>
				<aside className="relative min-h-full px-5 py-2.5 bg-background-0/75 tdrop-shadow-xl backdrop-blur-xl lg:backdrop-blur-none">
					<nav className="flex flex-col">
						<SidebarLink to="/home" label="Home" icon={"home"} iconBackground="#7A4CFC" />
						<SidebarLink
							to="/explore"
							label="Explore"
							icon={"grid-uneven"}
							iconBackground="#FE983A"
						/>
						<SidebarLink
							to="/invites"
							label="Job Invites"
							icon={"mail"}
							iconBackground="#DDBB7A"
							sideText=""
						/>
						<SidebarLink
							to="/analytics"
							label="Analytics"
							icon={"chart-wave-rectangle"}
							iconBackground="#82DD7A"
						/>
						<SidebarLink to="/profile" label="My Profile" icon={"user"} iconBackground="#B5E369" />
					</nav>
					<hr className="mx-3 my-5 bg-gray-500" />
					<SidebarCommunities />
					<div className="fixed w-[14rem] left-0 bottom-0 py-3">
						<div className="flex justify-center flex-wrap gap-x-3 gap-y-2 text-2xs text-letters-tertiary">
							<Link className="hover:text-brand-primary hover:underline">About</Link>
							<Link className="hover:text-brand-primary hover:underline">Accessibility</Link>
							<Link className="hover:text-brand-primary hover:underline">Help</Link>
							<Link className="hover:text-brand-primary hover:underline">Privacy & Terms</Link>
							<Link className="hover:text-brand-primary hover:underline">Advertise</Link>
							<Link className="hover:text-brand-primary hover:underline">more</Link>
						</div>
						<div className="flex justify-center items-center mt-3 text-sm">
							<p className="font-bold text-brand-primary">spehre.io</p>
							<span className="ml-1 text-xs text-letters-tertiary">© 2023</span>
						</div>
					</div>
				</aside>
			</div>
			<div
				className={`${isMobile ? "hidden" : "block"} shrink-0 w-[16rem] h-screen border-r-1 -z-50`}
			></div>
		</>
	);
};

export default SideBar;
