import "react-image-gallery/styles/css/image-gallery.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import { format } from "date-fns";
import {
  CardText,
  PeopleFill,
} from "react-bootstrap-icons";
import { LineWave } from "react-loader-spinner";
import {
  Link,
  useLocation,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarBackground from "../../assets/images/profile-bg.jpg";
import CreatePost from "../../components/misc/CreatePost";
import Post from "../../components/misc/Post";
import Button from "../../components/utils/Button";
import useApi from "../../lib/useApi";
import userSelector from "../../state/user";

const TopUser = ({ index, user: { _id, name, avatar }, hits, posts }) => {
	return (
		<div
			to={`/candidate/${_id}`}
			className={`flex items-center gap-2 flex-nowrap py-2 rounded-md text-[0.9rem] font-medium overflow-x-hidden`}
		>
			<div className="shrink-0 pr-1">{index + 1}</div>
			<div className="shrink-0 flex items-center justify-center w-10 h-10">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow">
				<p className="whitespace-nowrap overflow-ellipsis">{name}</p>
				<p className="text-xs text-[#373737]">
					{hits} total hits on {posts} posts
				</p>
			</div>
		</div>
	);
};

const TopmostUserBg = styled.div`
	background: #f8f9fb;
	box-shadow: inset 2.21093px 2.21093px 22.1093px rgba(165, 209, 234, 0.25);
`;

const TopmostUser = ({ index, user: { _id, name, avatar }, hits, posts }) => {
	return (
		<TopmostUserBg className="flex flex-col items-center gap-2 w-fit px-10 py-5 rounded-xl mx-auto">
			<div className="shrink-0 flex items-center justify-center w-20 h-20">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow text-center">
				<p className="whitespace-nowrap text-center overflow-ellipsis">{name}</p>
				<p className="text-xs text-[#373737] text-center">
					{hits} total hits on {posts} posts
				</p>
			</div>
			<Link
				to={`/candidate/${_id}`}
				className="px-2 py-1.5 rounded-3xl text-xs text-letters-tertiary bg-white"
			>
				View Profile
			</Link>
		</TopmostUserBg>
	);
};

const TopUsers = ({ id }) => {
	const [users, setUsers] = useState([]);
	const [update, setUpdate] = useState(0);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/topUsers", { id }).then(setUsers).catch(console.error);
	}, [update]);

	return (
		<div
			className="flex flex-col px-[1.15rem] py-5 border rounded-lg border-[#e8efff] bg-white"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			<h4 className=" text-lg font-semibold text-letters-secondary text-center">Top Users</h4>
			<p className="text-2xs text-letters-tertiary/90 text-center mb-2">
				Welcome to Javadevelopers, Heleum’s largest humor depository.
			</p>
			{users.length ? (
				<>
					{users.map((user, i) =>
						i == 0 ? (
							<TopmostUser index={i} key={user.user._id} {...user} />
						) : (
							<TopUser index={i} key={user.user._id} {...user} />
						)
					)}
				</>
			) : (
				<p className="p-8 text-xs text-center text-[#373737]">Loading top users...</p>
			)}
		</div>
	);
};

const Posts = ({ id: commId, joined }) => {
	const [posts, setPosts] = useState([]);
	const api = useApi(true);
	const [postUpdate, setPostUpdate] = useState(0);
	// const { id } = useOutletContext();
	const updateRef = useRef({
		update: () => setPostUpdate((_) => _ + 1),
	});

	useEffect(() => {
		api.post("/community/posts", { id: commId }).then(setPosts).catch(console.error);
	}, [postUpdate]);

	return posts ? (
		<div className="flex flex-col gap-4">
			{joined ? <CreatePost commId={commId} updateRef={updateRef} /> : null}
			{posts.map((post) => (
				<Post key={post._id} {...post} />
			))}
		</div>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
};

export const CommunityAbout = () => {
	const community = useOutletContext();
	return (
		<div className="flex flex-col gap-3">
			<div className="p-5 rounded-2xl overflow-hidden bg-background-0 shadow">
				<h5 className="text-lg font-semibold text-primary-default mb-3">About</h5>
				<p className="mb-3 text-sm">{community.description}</p>
				<p className="text-xs font-medium opacity-70">
					Created: {format(new Date(community.date), "MMM dd, yyyy")}
				</p>
			</div>
			<Posts id={community.id} />
		</div>
	);
};

export default function Community() {
	const setUser = useSetRecoilState(userSelector);
	const [community, setCommunity] = useState(null);
	const [counter, setCounter] = useState(0);
	const { name } = useParams();
	const location = useLocation();

	const modalRef = useRef(null);

	const api = useApi(true);
	useEffect(() => {
		api
			.post("/community/info", { name })
			.then((data) => setCommunity((_) => data))
			.catch(console.error);
	}, [counter, location]);

	return community ? (
		<main className="p-4">
			<div className="flex gap-4 mt-4">
				<div className="grow">
					<div
						className="relative bg-background-0 rounded-lg border mb-6 border-[#e8efff] overflow-hidden"
						style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
					>
						<img
							className="w-full h-36 object-cover object-center rounded-t-lg"
							src={AvatarBackground}
							alt="avatar_background"
						/>
						<div className="flex items-center pl-44 pr-5">
							<div className="absolute left-6 h-36 w-36 p-1 bg-white rounded-full">
								<img
									src={community.image}
									alt=""
									className="w-full h-full rounded-full border object-cover"
								/>
							</div>
							<div className="grow flex justify-between mt-1">
								<div className="grow flex items-center gap-1">
									<div className="grow">
										<h1 className="text-[1.2rem] font-medium text-[#535353]">{community.name}</h1>
										<p className="flex items-center gap-1 text-sm text-[#373737]">
											<PeopleFill className="inline-block text-[0.9rem] text-[#535353]" />{" "}
											<span className="text-[0.9rem] font-medium text-[#535353]">
												{community.user_count}
											</span>{" "}
											users • <CardText className="inline-block text-[0.9rem] text-[#535353]" />{" "}
											<span className="text-[0.9rem] font-medium text-[#535353]">
												{community.post_count}
											</span>{" "}
											posts
										</p>
									</div>
									<div className="flex items-center gap-3">
										<button className="w-6 h-6 rounded-full text-brand-primary  hover:bg-brand-primary hover:text-white transition-colors">
											<FontAwesomeIcon icon={faEllipsisVertical} />
										</button>
										{community.joined ? (
											<Button
												theme={"secondary"}
												label={"Leave"}
												onClick={() => {
													api
														.post("/community/leave", { name })
														.catch(console.error)
														.then(() => setCounter((c) => c + 1));
												}}
											/>
										) : (
											<Button
												theme={"primary"}
												label="Join"
												onClick={() => {
													api
														.post("/community/join", { name })
														.catch(console.error)
														.then(() => {
															setCounter((c) => c + 1);
															setUser((user) => ({ ...user, _v: user._v + 1 }));
														});
												}}
											/>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="mt-8"></div>
						<div className="p-6">
							<p className="mb-3 text-[#373737] text-sm">{community.description}</p>
							<p className="text-xs font-medium opacity-70">
								Created on: {format(new Date(community.date), "MMM dd, yyyy")}
							</p>
						</div>
						<div className="px-6 mb-6">
							<h3 className=" text-sm font-medium mb-2">Tags</h3>
							<p className="flex flex-wrap gap-x-2 gap-y-1 max-w-full">
								{community.tags?.map((tag) => (
									<div className="inline-block px-2 py-1 rounded-3xl border text-xs text-blue-500 border-[#535353]/10">
										#{tag}
									</div>
								))}
							</p>
						</div>
					</div>
					<Posts key={community.id} id={community.id} joined={community.joined} />
					{/* <Outlet key={community.id} context={community} /> */}
				</div>
				<div className="hidden md:block shrink-0 w-[18rem]">
					<TopUsers id={community.id} />
					<div className="my-5">
						<div className="flex items-center mb-1">
							<h1 className="grow text-lg font-semibold text-[#535353]">Similar communities</h1>
							<p className="text-xs hover:underline">Show all</p>
						</div>
						<p className="text-2xs text-letters-tertiary/90 mb-2">
							Welcome to Javadevelopers, Heleum’s largest humor depository.
						</p>
						<div className="border rounded-lg overflow-hidden bg-background-0">
							<img
								src="https://cdn.dribbble.com/users/41543/screenshots/8954776/media/674ddf6253aafffa815843ba8106938a.png?compress=1&resize=768x576&vertical=top"
								alt="figma"
								className="w-full aspect-video object-cover"
							/>
							<div className="px-3 py-4">
								<p className="text-sm font-medium mb-2">Figma Designerzz</p>
								<p className="text-xs text-[#373737]">
									<span className="mr-4">1425 members</span>
									<span>67 posts/day</span>
								</p>
							</div>
							<div className="px-3 pb-4">
								<button className="block w-full py-2 border rounded-sm border-gray-300 text-sm text-blue-500">
									Show all
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
}
