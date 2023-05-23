import { useContext, useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import { BellFill } from "react-bootstrap-icons";
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Popup from "reactjs-popup";
import { useRecoilValue } from "recoil";

import { faChevronDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import IconSliders from "../../assets/icons/sliders.png";
import SpehreLogo from "../../assets/logo/spehre-full-black.png";
import { NotificationContext } from "../../contexts/notificationContext";
import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";
import userSelector from "../../state/user";
import HugeIcon from "../utils/HugeIcon";
import PopupMenu from "../utils/PopupMenu";

const SidebarLogo = ({}) => {
	return (
		<div className="flex items-end w-[10rem] px-1 pt-4 pb-4 overflow-x-hidden">
			<img className="w-full object-contain" src={SpehreLogo} alt="company_logo" />
		</div>
	);
};

const NavSubLink = ({ to, children, ...rest }) => {
	return (
		<NavLink
			to={to}
			end
			{...rest}
			className={({ isActive }) =>
				`px-4 py-1 text-sm ${isActive ? "bg-background-0 shadow rounded-md font-medium" : ""}`
			}
		>
			{children}
		</NavLink>
	);
};

const SidebarCommunity = ({ name, image, user_count }) => {
	return (
		<Link
			to={`/community/${name.replace(/\s+/g, "-")}`}
			className={`relative flex flex-col items-center gap-2 max-w-full p-2 rounded-md bg-transparent hover:bg-violet-50`}
		>
			<div className="shrink-0 flex items-center justify-center w-10 h-10">
				<img src={image} className="w-full h-full rounded-full object-cover" />
			</div>
			<p className="max-w-full text-center text-sm whitespace-nowrap text-letters-secondary overflow-ellipsis">
				{name}
			</p>
			{/* <p className="text-xs text-letters-tertiary">{user_count} members</p> */}
		</Link>
	);
};

const SidebarCommunities = () => {
	const [communities, setCommunities] = useState([]);
	const [update, setUpdate] = useState(0);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/list", { userOnly: true }).then(setCommunities).catch(console.error);
	}, [update]);

	return communities.length ? (
		<div className="grid grid-cols-4">
			{communities.slice(0, communities.length < 4 ? communities.length : 4).map((community) => (
				<SidebarCommunity key={community.id} {...community} />
			))}
		</div>
	) : (
		<p className="px-10 py-4 text-center text-xs text-letters-tertiary">
			Join communities that'll show up here
		</p>
	);
};

const SearchBar = () => {
	const navigate = useNavigate();

	const location = useLocation();
	const [searchParams] = useSearchParams();

	const timeoutRef = useRef();
	const [focused, setFocused] = useState(false);
	const [query, setQuery] = useState(null);
	const [searchData, setSearchData] = useState([]);

	const dataApi = useApi(false);
	const getSearchData = () => {
		return dataApi
			.post("/data/search", { query })
			.then((searchData) => {
				return [
					{
						label: "Users",
						options: searchData.users.map((data) => ({
							label: data.name,
							value: data._id,
							thumb: data.avatar,
							type: "candidate",
						})),
					},
					{
						label: "Spaces",
						options: searchData.spaces.map((data) => ({
							label: data.name,
							value: data.name,
							thumb: data.image,
							type: "space",
						})),
					},
					// {
					// 	label: "Posts",
					// 	options: searchData.posts.map((data) => ({

					// 	}))
					// },
				];
			})
			.catch(console.error);
	};

	useEffect(() => {
		const loc = location.pathname
			?.split("/")
			.filter((x) => !!x)[0]
			?.toLowerCase();
		if (loc == "search") {
			const q = searchParams.get("q");
			if (q != query) setQuery((_) => q);
		}
	}, [location]);

	useEffect(() => {
		getSearchData().then(setSearchData);
	}, [query]);

	return (
		<Popup
			open={!!query}
			on={[]}
			trigger={
				<form
					onSubmit={(e) => {
						e.preventDefault();
						const loc = location.pathname
							?.split("/")
							.filter((x) => !!x)[0]
							?.toLowerCase();
						if (loc == "search") searchParams.set("q", query);
						const params = loc == "search" ? searchParams.toString() : `q=${query}`;
						navigate({ pathname: "/search", search: `?${params}` });
					}}
					className="relative shrink-0 hidden lg:flex items-center gap-4 w-[20rem] h-full"
				>
					<HugeIcon
						icon="search"
						size={"1rem"}
						solid={true}
						className="absolute left-4 text-black"
					/>
					<div className="absolute left-10 w-[1px] h-4 bg-letters-tertiary/70"></div>
					<input
						type="text"
						className="w-full h-full text-sm pl-12 pr-3 rounded-md border border-[#DCDAFF] focus:outline-1 text-letters-secondary focus:outline-blue-500 placeholder:text-letters-tertiary/70"
						placeholder="Search"
						onChange={(e) => {
							setQuery((_) => e.target.value);
						}}
						onFocus={() => {
							clearTimeout(timeoutRef.current);
							timeoutRef.current = setTimeout(() => setFocused(true), 20);
						}}
						onBlur={() => {
							clearTimeout(timeoutRef.current);
							timeoutRef.current = setTimeout(() => setFocused(false), 250);
						}}
					/>
					<button hidden></button>
				</form>
			}
			position={"bottom left"}
			closeOnEscape={false}
			// closeOnDocumentClick={false}
		>
			<div
				className="relative left-2 w-80 py-1.5 border rounded-lg shadow-md bg-background-0"
				style={{ display: focused ? "block" : "none" }}
			>
				{searchData.map(({ label, options }) => {
					if (options.length) {
						return (
							<div className="">
								<h6 className="px-3 py-2 text-xs font-medium text-blue-400">{label}</h6>
								<div className="flex flex-col">
									{options.map(({ label: optionLabel, value, thumb }) => (
										<Link
											to={(label == "Users" ? "/candidate/" : "/community/") + value}
											className="flex items-center gap-2 px-3 py-1.5 text-sm text-letters-secondary hover:bg-[#F7F7F7]"
										>
											<img
												src={
													thumb ||
													"https://ui-avatars.com/api/?background=random&size=128&name=" +
														optionLabel
												}
												alt="img"
												className="w-8 aspect-square rounded-full"
											/>
											<span>{optionLabel}</span>
										</Link>
									))}
								</div>
							</div>
						);
					}
				})}
			</div>
		</Popup>
	);
};

const LikeNotification = ({ count, latest: { avatar, name }, time }) => {
	return (
		<Link
			className={`flex gap-4 max-w-full p-2 rounded-md bg-background-0 hover:bg-violet-50 border-b last:border-b-0`}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={name}>
					{name} and {count} others liked your post
				</p>
			</div>
		</Link>
	);
};

const CommentNotification = ({ comment, isReply = true, user: { name, avatar }, time }) => {
	return (
		<Link
			className={`flex gap-4 max-w-full p-2 rounded-md bg-background-0 hover:bg-violet-50 border-b last:border-b-0`}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={name}>
					{name} {isReply ? "commented on" : "replied to"} your {isReply ? "post" : "comment"}, "
					{comment}"
				</p>
			</div>
		</Link>
	);
};

const MobileNotificatons = () => {
	const { unread, notifications, read } = useContext(NotificationContext);

	return (
		<Link
			to={"/notifications"}
			className="relative flex justify-center items-center h-full aspect-square border rounded-full bg-background-100 text-black"
		>
			<BellFill size={"1rem"} />
			{unread > 0 ? (
				<div className="absolute top-0 right-0 w-3 h-3 rounded-full bg-red-600"></div>
			) : null}
		</Link>
	);
};

const Notifications = () => {
	const { unread, notifications, read } = useContext(NotificationContext);

	return (
		<PopupMenu
			offsetX={12}
			offsetY={16}
			on={["click", "hover"]}
			position="bottom right"
			triggerContent={
				<div className="relative flex justify-center items-center h-full aspect-square border rounded-md border-[#DCDAFF] text-brand-primary">
					<HugeIcon icon="notification" size={"1.5rem"} />
					{unread > 0 ? (
						<div className="absolute flex justify-center items-center top-1.5 right-2 w-3 h-3 rounded-full bg-white">
							<div className="w-2 h-2 rounded-full bg-red-600"></div>
						</div>
					) : null}
				</div>
			}
			onClose={() => {
				read();
			}}
		>
			{(closeWindow) => (
				<div className="flex flex-col max-w-sm max-h-96 overflow-y-auto p-1 rounded-lg border shadow-md bg-background-0">
					{notifications.map(({ id, notifications }, i) => {
						if (notifications[0].type == "like") {
							return (
								<LikeNotification
									key={"notifwindownotif" + i}
									count={notifications.length - 1}
									latest={notifications[0].data.user}
									time={notifications[0].time}
								/>
							);
						} else if (notifications[0].type == "comment") {
							return (
								<CommentNotification
									key={"notifwindownotif" + i}
									comment={notifications[0].data.comment}
									user={notifications[0].data.user}
									time={notifications[0].time}
								/>
							);
						} else if (notifications[0].type == "reply") {
							return (
								<CommentNotification
									key={"notifwindownotif" + i}
									comment={notifications[0].data.comment}
									user={notifications[0].data.user}
									time={notifications[0].time}
									isReply={false}
								/>
							);
						}
					})}
				</div>
			)}
		</PopupMenu>
	);
};

export default function Navbar() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const user = useRecoilValue(userSelector);
	// const location = useLocation();
	// let title =
	// 	location.state?.title ||
	// 	(location.pathname
	// 		?.split("/")
	// 		.filter((x) => !!x)[0]
	// 		?.split("-")
	// 		.map((x) => (!!x ? x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase() : ""))
	// 		.join(" ") ??
	// 		"Home");

	return (
		<div className="sticky top-0 w-full border-b z-50">
			<div className="relative flex items-center justify-between gap-4 w-full h-[5rem] md:h-[4.5rem] px-8 mx-auto bg-background-0">
				<Link to={"/home"}>
					<img src={SpehreLogo} alt="sphere.io" className="h-8" />
				</Link>
				<div className="flex items-center justify-end gap-3 h-[2.5rem] text-gray-500">
					<SearchBar />
					<Link
						to={"/search"}
						className="relative flex lg:hidden justify-center items-center h-full aspect-square border rounded-full bg-background-100 text-black"
					>
						<FontAwesomeIcon icon={faSearch} className="" />
					</Link>
					{!isMobile ? <Notifications /> : <MobileNotificatons />}
					<div className="relative flex justify-center items-center h-full aspect-square border rounded-md border-[#DCDAFF] text-brand-primary">
						<HugeIcon icon="chatting" size={"1.5rem"} />
						{2 > 0 ? (
							<div className="absolute flex justify-center items-center top-1.5 right-2 w-3 h-3 rounded-full bg-white">
								<div className="w-2 h-2 rounded-full bg-red-600"></div>
							</div>
						) : null}
					</div>
					<div className="h-full aspect-square">
						<PopupMenu
							offsetX={12}
							offsetY={16}
							position="bottom right"
							triggerContent={
								<div className="relative">
									<img
										className="h-full w-full rounded-full object-cover pointer-events-auto"
										src={
											user.avatar ||
											"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name
										}
									/>
									<div className="absolute -right-0.5 -bottom-0.5 flex items-center justify-center p-1 border rounded-full bg-white">
										<FontAwesomeIcon icon={faChevronDown} size="sm" className="text-[0.4rem]" />
									</div>
								</div>
							}
						>
							{(closeMenu) => (
								<motion.div
									className="flex flex-col w-80 p-3 rounded-lg bg-background-0"
									style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
								>
									<h4 className="mb-1 font-medium text-letters-secondary">My Account</h4>
									<Link
										to={isMobile ? "/preferences" : "/preferences/general"}
										className="flex items-center gap-3 px-2 py-2 rounded-md text-letters-tertiary outline-none hover:bg-violet-50"
										onClick={() => {
											closeMenu();
										}}
									>
										<HugeIcon icon="setting" size="1.45rem" className={"bg-current"} />
										<span className="text-sm">Account Settings</span>
									</Link>
									<Link
										to={"/rewards"}
										className="flex items-center gap-3 px-2 py-2 rounded-md text-letters-tertiary outline-none hover:bg-violet-50"
										onClick={() => {
											closeMenu();
										}}
									>
										<HugeIcon icon="diamond" size="1.45rem" className={"bg-current"} />
										<span className="text-sm">My Rewards</span>
									</Link>
									<Link
										to={"/community/create"}
										className="flex items-center gap-3 px-2 py-2 rounded-md text-letters-tertiary outline-none hover:bg-violet-50"
										onClick={() => {
											closeMenu();
										}}
									>
										<HugeIcon icon="user-group" size="1.45rem" className={"bg-current"} />
										<span className="text-sm">Create Community</span>
									</Link>
									<Link
										to={"/saved"}
										className="flex items-center gap-3 px-2 py-2 rounded-md text-letters-tertiary outline-none hover:bg-violet-50"
										onClick={() => {
											closeMenu();
										}}
									>
										<HugeIcon icon="bookmark" size="1.45rem" className={"bg-current"} />
										<span className="text-sm">Saved Posts</span>
									</Link>
									<Link
										to={"/logout"}
										className="flex items-center gap-3 px-2 py-2 rounded-md text-letters-tertiary outline-none hover:bg-violet-50"
										onClick={() => {
											closeMenu();
										}}
									>
										<HugeIcon icon="logout" size="1.45rem" className={"bg-current"} />
										<span className="text-sm">Logout</span>
									</Link>

									<hr className="my-2" />
									<h4 className="mb-1 font-medium text-letters-secondary">My Communities</h4>
									<SidebarCommunities />
									<Link className="text-center py-2">
										<img src={IconSliders} alt="gear" className="inline-block w-5 h-5 mr-3" />
										<span className="text-sm">Show all</span>
									</Link>
								</motion.div>
							)}
						</PopupMenu>
					</div>
				</div>
			</div>
		</div>
	);
}
