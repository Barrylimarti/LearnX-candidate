import {
  useEffect,
  useState,
} from "react";

import { ChevronDown } from "react-bootstrap-icons";
import { LineWave } from "react-loader-spinner";
import { NavLink } from "react-router-dom";
import { useRecoilValue } from "recoil";

import Post from "../../../components/misc/Post";
import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

const Posts = ({}) => {
	const [posts, setPosts] = useState([]);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/explore", {}).then(setPosts).catch(console.error);
	}, []);

	return posts ? (
		<div className="flex flex-col gap-4">
			{posts.map((post, index) => (
				<Post key={post._id} {...post} initialShowComments={index == 0} />
			))}
		</div>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
};

const SidebarCommunity = ({ name, image, user_count, post_count }) => {
	return (
		<NavLink
			to={`/community/${name.replace(/\s+/g, "-")}`}
			className={({ isActive }) => `flex items-center gap-2 flex-nowrap py-2 rounded-md text-sm
			overflow-x-hidden ${
				isActive
					? "bg-background-200 text-blue-500 font-medium"
					: "text-black hover:bg-background-100"
			}`}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="grow">
				<p className="whitespace-nowrap font-medium overflow-ellipsis">{name}</p>
				<p className="text-xs text-gray-500">{post_count} posts today</p>
			</div>
			<p className="shrink-0 px-2 py-1 rounded-xl bg-background-200 text-[0.7rem] text-blue-500">
				{"66 in last hour"}
			</p>
		</NavLink>
	);
};

const SidebarCommunities = () => {
	const [communities, setCommunities] = useState([]);
	const [update, setUpdate] = useState(0);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/list", { userOnly: true }).then(setCommunities).catch(console.error);
	}, [update]);

	return (
		<div
			className="flex flex-col px-3 pt-3 py-1 border rounded-lg border-[#e8efff] bg-background-0"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			<div className="flex items-center justify-betwee mb-2">
				<p className="grow">Trending Today</p>
				<p>
					<ChevronDown />
				</p>
			</div>
			{communities.length
				? communities.map((community) => <SidebarCommunity key={community.id} {...community} />)
				: null}
			{communities.length
				? communities.map((community) => <SidebarCommunity key={community.id} {...community} />)
				: null}
			<button className="block w-full py-2 text-sm text-blue-500">Show all</button>
		</div>
	);
};

export default function Explore() {
	const user = useRecoilValue(userSelector);

	return (
		<main
			// className="grid grid-cols-1 lg:grid-cols-[repeat(14,minmax(0,1fr))]"
			className="grow flex items-stretch"
		>
			<div className="grow px-4 py-5 border-r">
				<Posts />
			</div>
			<div className="shrink-0 w-80 hidden lg:block px-6 py-5 bg-background-0">
				<SidebarCommunities />
				<div className="my-5">
					<div className="flex items-center mb-4">
						<h1 className="grow text-lg font-semibold">Suggested community</h1>
					</div>
					<div
						className="border rounded-lg overflow-hidden bg-background-0"
						style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
					>
						<img
							src="https://cdn.dribbble.com/users/41543/screenshots/8954776/media/674ddf6253aafffa815843ba8106938a.png?compress=1&resize=768x576&vertical=top"
							alt="figma"
							className="w-full aspect-video object-cover"
						/>
						<div className="px-3 py-4">
							<p className="text-sm font-medium mb-2">Figma Designerzz</p>
							<p className="text-xs text-gray-500">
								<span className="mr-4">1425 members</span>
								<span>67 posts/day</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
