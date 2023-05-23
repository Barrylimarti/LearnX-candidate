import {
  useEffect,
  useState,
} from "react";

import { LineWave } from "react-loader-spinner";

import Post from "../../../components/misc/Post";
import useApi from "../../../lib/useApi";

const Posts = ({ id: commId }) => {
	const [posts, setPosts] = useState([]);
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/userposts", { id: commId }).then(setPosts).catch(console.error);
	}, []);

	return posts ? (
		<div className="flex flex-col gap-4 p-4">
			{posts.map((post) => (
				<Post key={post._id} {...post} />
			))}
		</div>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="100" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
};

export default Posts;
