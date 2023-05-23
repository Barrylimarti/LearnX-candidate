import { useEffect, useRef, useState } from "react";

import {
	Behance,
	ChatSquareDotsFill,
	Dribbble,
	GeoAlt,
	Github,
	GlobeAmericas,
	Linkedin,
	Medium,
	PersonCheckFill,
	PlusSquare,
} from "react-bootstrap-icons";
import { LineWave } from "react-loader-spinner";
import {
	Link,
	NavLink,
	Outlet,
	useLocation,
	useNavigate,
	useOutletContext,
	useParams,
} from "react-router-dom";

import AvatarBackground from "../../assets/images/profile-bg.jpg";
import PrimaryModal from "../../components/utils/PrimaryModal";
import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";
import Certificates from "./components/Certificates";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Posts from "./components/Posts";
import Spaces from "./components/Spaces";

const PortfolioLink = ({
	icon: Icon = GlobeAmericas,
	label = "Other",
	link = "",
	color = "#000000",
}) => {
	return (
		<div className="relative shrink-0 grid grid-cols-2 w-80 h-24 rounded-2xl bg-background-0">
			<div className="col-span-1 flex items-center justify-between">
				<div
					className="ml-8 px-4 py-3 rounded-xl"
					style={{ boxShadow: "0px 5.30157px 7.95235px rgba(163, 174, 208, 0.25)" }}
				>
					<Icon size={"2.5rem"} color={color} />
				</div>
				<div
					className="w-2 h-14 rounded-tl-lg rounded-bl-lg"
					style={{
						background: "linear-gradient(90deg, #1BE7FF 0%, #C2F4FF 100%)",
					}}
				></div>
			</div>
			<div className="col-span-1 flex items-center p-4 border-l">
				<div className="max-w-full">
					<p className="text-sm text-primary-default font-medium">{label}</p>
					<a
						href={link}
						target="_blank"
						className="block text-xs text-blue-500 max-w-full overflow-hidden overflow-ellipsis"
					>
						{link}
					</a>
				</div>
			</div>
		</div>
	);
};

const supportedPortfolios = {
	behance: { icon: Behance, color: "#0056FF" },
	dribbble: { icon: Dribbble, color: "#0077B5" },
	github: { icon: Github, color: "#333" },
	linkedin: { icon: Linkedin, color: "#EC296A" },
	medium: { icon: Medium, color: "#000" },
};

const Portfolio = ({ links }) => {
	return (
		<div className="flex flex-nowrap gap-4 w-full overflow-x-auto">
			{links.map(({ _id, name, link }) => {
				let props = supportedPortfolios[name.toLowerCase()];
				if (!props) props = {};
				return <PortfolioLink key={_id} {...props} label={name} link={link} />;
			})}
		</div>
	);
};

const Skill = ({ skill, mastery }) => {
	return (
		<div className="grid grid-cols-12 items-center gap-2 py-1">
			<div className="col-span-4 flex justify-center items-center w-full h-full px-2" title={skill}>
				<p className="text-sm">{skill}</p>
			</div>
			<div className="col-span-8 flex items-center">
				<div className="grow flex justify-center items-center w-full h-full rounded-md bg-background-200">
					<div className="w-full bg-gray-400 h-1 rounded-sm">
						<div
							className="bg-violet-700 h-1 rounded-sm "
							style={{ width: `${(mastery * 100) / 10}%` }}
						></div>
					</div>
				</div>
				<div className="shrink-0 flex justify-center items-center w-[10%] h-full px-2 rounded-md text-sm">
					{mastery < 10 ? 0 : ""}
					{mastery}/10
				</div>
			</div>
		</div>
	);
};

const Skills = ({ skills }) => {
	return (
		<div className="flex flex-col gap-2 min-h-[20rem]">
			<div className="grid items-center grid-cols-12 gap-2 py-2 border-b mb-2 border-letters-secondary">
				<div className="col-span-4 text-center font-medium">Skill</div>
				<div className="col-span-8 text-center font-medium">Mastery</div>
			</div>
			{skills.map(({ skill, mastery, _id }) => (
				<Skill key={_id} skill={skill} mastery={mastery} />
			))}
		</div>
	);
};

const About = ({ about }) => {
	return (
		<p className="w-full max-w-full text-sm text-letters-tertiary text-justify">
			{about || "No about added."}
		</p>
	);
};

export function CandidateAbout() {
	const user = useOutletContext();

	return (
		<div className="flex flex-col gap-6 p-4">
			<div>
				<About about={user.about} />
			</div>
			<div className="">
				<Experience experience={user.experience} />
			</div>
			<div className="">
				<Education education={user.education} />
			</div>
			<div className="">
				<Certificates certificates={user.certificates} />
			</div>
		</div>
	);
}

export function CandidatePosts() {
	const user = useOutletContext();

	return <Posts id={user._id} />;
}

export function CandidateSpaces() {
	const user = useOutletContext();

	return <Spaces id={user._id} />;
}

export function CandidateSkills() {
	const user = useOutletContext();

	return (
		<div className="flex flex-col gap-6">
			<Skills skills={user.skills} />
		</div>
	);
}

const People = ({ people }) => {
	return (
		<div className="flex flex-col">
			{people?.map(({ _id, name, avatar }) => (
				<Link
					to={"/candidate/" + _id}
					className="flex items-center gap-3 px-3 py-1.5 rounded hover:bg-background-100"
				>
					<img
						src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
						alt={name}
						className="w-10 h-10 object-cover rounded-full"
					/>
					<p className="text-sm">{name}</p>
				</Link>
			))}
		</div>
	);
};

export default function Candidate() {
	const isMobile = useMediaQuery("(max-width: 768px)");
	const [user, setUser] = useState(null);
	const [counter, setCounter] = useState(0);

	const location = useLocation();
	const navigate = useNavigate();

	const api = useApi(true);
	const { id } = useParams();

	const peopleModalRef = useRef();
	const [peopleModalMode, setPeopleModalMode] = useState(null);

	useEffect(() => {
		if (peopleModalMode) peopleModalRef.current?.open();
		else peopleModalRef.current?.close();
	}, [peopleModalMode]);

	useEffect(() => {
		api.post("/data/candidate", { id, keys: "" }).then(setUser).catch(console.error);
		setPeopleModalMode((_) => false);
	}, [counter, location]);

	return user ? (
		<main className="relative grow p-4">
			<div
				className="relative p-4 border rounded-lg border-[#e8efff] bg-white"
				style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
			>
				<img
					className="w-full h-28 object-cover rounded-xl"
					src={AvatarBackground}
					alt="avatar_background"
				/>
				<div className="flex items-center justify-between pl-32">
					<div className="absolute left-4 w-32 h-32 p-1 rounded-full overflow-hidden bg-white">
						<img
							className="w-full h-full object-cover rounded-full"
							src={
								(user.avatar ||
									"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name) +
								"?" +
								counter
							}
							alt="user"
						/>
					</div>
					<div className="relative top-2 left-2 user-info">
						<p className="text-letters-secondary text-2xl font-semibold">{user.name}</p>
						<p className="text-letters-tertiary text-sm font-normal">
							{user.field}
							{!isMobile ? (
								<>
									{" "}
									• <GeoAlt className="inline-block" /> {user.location?.name},{" "}
									{user.location?.state}
								</>
							) : null}
						</p>
						<p className="text-letters-tertiary text-sm font-normal">
							<span
								className="hover:underline"
								onClick={() => {
									setPeopleModalMode((_) => "Followers");
								}}
							>
								{user.followers?.length ?? 0} followers
							</span>{" "}
							•{" "}
							<span
								className="hover:underline"
								onClick={() => {
									setPeopleModalMode((_) => "Following");
								}}
							>
								{user.following?.length ?? 0} following
							</span>
						</p>
					</div>
				</div>
				<div className="my-10"></div>
				<div className="relative flex justify-end gap-3">
					{!user.is_following ? (
						<button
							className="w-fit h-fit px-3 py-2 border rounded-md border-transparent bg-violet-700 text-xs text-white font-medium"
							onClick={() => {
								api
									.post("/user/follow", { id: user.id })
									.then(() => setCounter((c) => c + 1))
									.catch(console.error);
							}}
						>
							<PlusSquare className="inline mr-3" />
							Follow
						</button>
					) : (
						<button
							className="w-fit h-fit px-3 py-2 border rounded-md border-violet-700 text-xs text-violet-700 font-medium"
							onClick={() => {
								api
									.post("/user/unfollow", { id: user.id })
									.then(() => setCounter((c) => c + 1))
									.catch(console.error);
							}}
						>
							<PersonCheckFill className="inline mr-2 text-base" />
							Following
						</button>
					)}
					<button
						className="w-fit h-fit px-3 py-2 border rounded-md border-violet-700 text-xs text-violet-700 font-medium"
						onClick={() => {
							api
								.post("/chat/roomIdFromUser", { id: user._id, type: "candidate" })
								.then(({ id }) => navigate("/messaging/" + id))
								.catch(console.error);
						}}
					>
						<ChatSquareDotsFill className="inline mr-2 text-base" />
						Message
					</button>
				</div>
			</div>
			<div
				className="relative p-3 border rounded-lg mt-5 border-[#e8efff] bg-white"
				style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
			>
				<div className="flex border-b-2">
					<NavLink
						className={({ isActive }) =>
							`relative top-[1px] px-5 py-2 font-medium ${
								isActive
									? "border-b-2 border-purple-500 text-letters-secondary"
									: "text-letters-tertiary"
							}`
						}
						end
						to={""}
					>
						About
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							`relative top-[1px] px-5 py-2 font-medium ${
								isActive
									? "border-b-2 border-purple-500 text-letters-secondary"
									: "text-letters-tertiary"
							}`
						}
						to={"skills"}
					>
						Skills
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							`relative top-[1px] px-5 py-2 font-medium ${
								isActive
									? "border-b-2 border-purple-500 text-letters-secondary"
									: "text-letters-tertiary"
							}`
						}
						to={"posts"}
					>
						Posts
					</NavLink>
					<NavLink
						className={({ isActive }) =>
							`relative top-[1px] px-5 py-2 font-medium ${
								isActive
									? "border-b-2 border-purple-500 text-letters-secondary"
									: "text-letters-tertiary"
							}`
						}
						to={"spaces"}
					>
						Spaces
					</NavLink>
				</div>
				<Outlet context={user} />
			</div>
			<PrimaryModal ref={peopleModalRef} title={peopleModalMode}>
				{(closeModal) => (
					<People people={peopleModalMode == "Following" ? user.following : user.followers} />
				)}
			</PrimaryModal>
		</main>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
}
