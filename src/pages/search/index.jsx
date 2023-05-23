import { useEffect, useState } from "react";

import { CollectionFill, PeopleFill, Search as SearchIcon } from "react-bootstrap-icons";
import { NavLink, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import styled from "styled-components";

import Button from "../../components/utils/Button";
import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";

const SearchBar = () => {
	const navigate = useNavigate();

	const location = useLocation();
	const [searchParams] = useSearchParams();

	const [query, setQuery] = useState(null);

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

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				navigate("/search?q=" + query);
			}}
			className="flex gap-3"
		>
			<div
				className="grow flex gap-2 px-4 py-2 rounded-lg border bg-background-100"
				onClick={() => document.getElementById("mobile-search-bar").focus()}
			>
				<SearchIcon size={"1rem"} className="" />
				<input
					id="mobile-search-bar"
					type="text"
					className="grow h-full text-sm bg-transparent text-letters-secondary focus:outline-none placeholder:text-letters-tertiary"
					placeholder="Search"
					defaultValue={query}
					onChange={(e) => {
						setQuery((_) => e.target.value);
					}}
				/>
			</div>
			<Button theme={"tertiary"} label={"Search"} />
		</form>
	);
};

const UserResult = ({ _id, name, avatar, field }) => {
	return (
		<NavLink
			to={`/candidate/${_id}`}
			className="flex items-center gap-4 px-4 py-2 border rounded-md bg-background-0 shadow"
		>
			<div className="w-12 h-12 p-1 border-2 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar ? "/" + avatar : "https://randomuser.me/api/portraits/lego/1.jpg"}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div>
				<p className="font-semibold text-primary-default">{name}</p>
				<p className="text-xs font-medium opacity-75">{field}</p>
			</div>
		</NavLink>
	);
};

const SpaceResult = ({ name, image, userCount, postCount }) => {
	return (
		<NavLink
			to={`/community/${name?.replace(/\s+/g, "-")}`}
			className="flex items-center gap-4 p-4 rounded-md bg-background-0 shadow"
		>
			<div className="w-16 h-16 rounded-lg overflow-hidden">
				<img
					src={image ? image : "https://randomuser.me/api/portraits/lego/1.jpg"}
					alt={name}
					className="w-full h-full object-cover"
				/>
			</div>
			<div>
				<p className="text-xl font-semibold text-primary-default">{name}</p>
				<p className="text-sm font-medium opacity-75">
					<PeopleFill className="inline" /> {userCount} users •{" "}
					<CollectionFill className="inline" /> {postCount} posts
				</p>
			</div>
		</NavLink>
	);
};

const PostBody = styled.p`
	display: -webkit-box;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
`;

const PostResult = ({
	author: {
		user: { name, avatar },
	},
	community: { name: community, image },
	body,
	media,
}) => {
	return (
		<NavLink to={`#`} className="p-6 border rounded-md bg-background-0 shadow">
			<div className="flex items-center gap-4">
				<div className="w-12 h-12 rounded-lg overflow-hidden">
					<img
						src={image ? image : "https://randomuser.me/api/portraits/lego/1.jpg"}
						alt={name}
						className="w-full h-full object-cover"
					/>
				</div>
				<div>
					<p className="font-semibold text-primary-default">{community}</p>
					<p className="text-xs font-medium opacity-75">
						posted by <span className="text-primary-faded">{name}</span>
					</p>
				</div>
			</div>
			<div className="flex flex-col md:flex-row gap-2 mt-3">
				<PostBody className="grow font-medium">{body}</PostBody>
				<div className="shrink-0">
					{media.length ? (
						<div className="lg:w-48 lg:h-28 h-56 rounded-2xl overflow-hidden">
							<img className="w-full h-full object-cover" src={media[0].file} alt="media" />
						</div>
					) : (
						<></>
					)}
				</div>
			</div>
		</NavLink>
	);
};

const resultComponents = {
	users: UserResult,
	spaces: SpaceResult,
	posts: PostResult,
};

function SearchResults({ field, resultComponent: ResultComponent }) {
	const [results, setResults] = useState(null);
	const api = useApi(false);

	const [searchParams] = useSearchParams();

	useEffect(() => {
		api
			.post(`/data/search/${field}`, {
				query: searchParams.get("q"),
				limit: 20,
				page: Math.abs(parseInt(searchParams.get("page"))) || 1,
			})
			.then(setResults)
			.catch(console.error);
	}, [field, searchParams]);

	return results ? (
		results.pages ? (
			<div className="flex flex-col gap-3 p-3 border rounded-lg shadow bg-background-0">
				<h3 className="text-xl font-medium text-letters-secondary">
					{field.substr(0, 1).toUpperCase() + field.substr(1)}
				</h3>

				{results.results.map((result) => (
					<ResultComponent key={result._id} {...result} />
				))}
			</div>
		) : null
	) : null;
}

const tabLinkStyle = {
	className: ({ isActive }) =>
		`p-4 text-xl font-semibold text-primary-default ${
			isActive ? "bg-background-200 rounded-lg" : "opacity-60"
		}`,
};

export default function Search({ match }) {
	const isMobile = useMediaQuery("(max-width: 1024px)");

	const [searchParams] = useSearchParams();

	const location = useLocation();
	const [renderField, setRenderField] = useState("all");

	return (
		<div className="grow flex items-stretch h-full">
			<div className="grow flex flex-col gap-5 p-4 border-r">
				{isMobile ? <SearchBar /> : null}
				<h1 className="mb-4 font-medium text-letters-tertiary">
					{searchParams.get("q") ? (
						<>Showing results for "{searchParams.get("q")}"</>
					) : (
						"Search for anything"
					)}
				</h1>
				{renderField == "all" || renderField == "users" ? (
					<SearchResults
						key={"users"}
						field={"users"}
						resultComponent={resultComponents["users"]}
					/>
				) : null}
				{renderField == "all" || renderField == "spaces" ? (
					<SearchResults
						key={"spaces"}
						field={"spaces"}
						resultComponent={resultComponents["spaces"]}
					/>
				) : null}
				{renderField == "all" || renderField == "posts" ? (
					<SearchResults
						key={"posts"}
						field={"posts"}
						resultComponent={resultComponents["posts"]}
					/>
				) : null}
			</div>
			<div className="hidden lg:block w-80 bg-background-0">
				<button
					className={`flex justify-start items-center gap-2 w-full px-5 py-5 ${
						renderField == "all" ? "bg-background-200 border-l-2 border-violet-800" : ""
					} text-lg font-medium hover:bg-background-100`}
					onClick={() => setRenderField("all")}
				>
					<p className="text-sm">All</p>
				</button>
				<button
					className={`flex justify-start items-center gap-2 w-full px-5 py-5 ${
						renderField == "users" ? "bg-background-200 border-l-2 border-violet-800" : ""
					} text-lg font-medium hover:bg-background-100`}
					onClick={() => setRenderField("users")}
				>
					<p className="text-sm">Users</p>
				</button>
				<button
					className={`flex justify-start items-center gap-2 w-full px-5 py-5 ${
						renderField == "spaces" ? "bg-background-200 border-l-2 border-violet-800" : ""
					} text-lg font-medium hover:bg-background-100`}
					onClick={() => setRenderField("spaces")}
				>
					<p className="text-sm">Spaces</p>
				</button>
				<button
					className={`flex justify-start items-center gap-2 w-full px-5 py-5 ${
						renderField == "posts" ? "bg-background-200 border-l-2 border-violet-800" : ""
					} text-lg font-medium hover:bg-background-100`}
					onClick={() => setRenderField("posts")}
				>
					<p className="text-sm">Posts</p>
				</button>
			</div>
		</div>
	);
}
