import {
  useEffect,
  useState,
} from "react";

import { LineWave } from "react-loader-spinner";

import Post from "../../components/misc/Post";
import useApi from "../../lib/useApi";

const Posts = ({}) => {
	const [posts, setPosts] = useState([]);
	const api = useApi(true);

	useEffect(() => {
		api.post("/user/savedPosts", {}).then(setPosts).catch(console.error);
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

export default function SavedPosts() {
	return (
		<main className="p-4">
			<h1 className="text-xl font-semibold text-letters-secondary mb-5">Saved Posts</h1>
			<Posts />
		</main>
	);
}
