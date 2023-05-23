import { useEffect, useState } from "react";

import { NavLink } from "react-router-dom";

import useApi from "../../../lib/useApi";

const Space = ({ name, image, user_count, post_count }) => {
	return (
		<NavLink
			to={`/community/${name.replace(/\s+/g, "-")}`}
			className={({
				isActive,
			}) => `flex items-center gap-2 flex-nowrap p-4 border rounded text-[0.9rem] font-medium
			overflow-x-hidden ${
				isActive ? "bg-background-200 text-blue-500" : "text-black hover:bg-background-100"
			}`}
			onClick={(e) => e.stopPropagation()}
		>
			<div className="shrink-0 flex items-center justify-center w-16 h-16">
				<img src={image} className="w-full h-full rounded-full object-cover" />
			</div>
			<div className="grow">
				<p className="whitespace-nowrap overflow-ellipsis">{name}</p>
				<p className="text-xs text-gray-500">
					{user_count} members • {post_count} posts
				</p>
			</div>
		</NavLink>
	);
};

const Spaces = () => {
	const [communities, setCommunities] = useState([]);
	const [update, setUpdate] = useState(0);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/list", { userOnly: true }).then(setCommunities).catch(console.error);
	}, [update]);

	return (
		<div className="flex flex-col gap-2 p-4">
			{communities.length ? (
				communities.map((community) => <Space key={community.id} {...community} />)
			) : (
				<p className="p-10 text-center">Join communities that'll show up here</p>
			)}
		</div>
	);
};

export default Spaces;
