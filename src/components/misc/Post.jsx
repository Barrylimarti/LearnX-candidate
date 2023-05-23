import "react-image-gallery/styles/css/image-gallery.css";

import {
  useEffect,
  useState,
} from "react";

import { formatDistance } from "date-fns";
import {
  ArrowReturnRight,
  Eye,
  EyeSlash,
  SendFill,
} from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import ReactImageGallery from "react-image-gallery";
import ReactQuill from "react-quill";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import {
  faAt,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApi from "../../lib/useApi";
import userSelector from "../../state/user";
import HugeIcon from "../utils/HugeIcon";
import PopupMenu from "../utils/PopupMenu";

const CommentForm = ({ id, parentId, updater }) => {
	const user = useRecoilValue(userSelector);
	const { register, handleSubmit, reset } = useForm();
	const api = useApi(true);

	const onSubmit = async (data) => {
		api
			.post("/community/comment", { id, parentId, ...data })
			.then(() => {
				updater();
				reset();
			})
			.catch(console.error);
	};

	return (
		<form className="relative" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-3">
				<img
					src={
						user.avatar ||
						"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name
					}
					alt="user"
					className="h-10 aspect-square rounded-full"
				/>
				<input
					type="text"
					className="grow h-10 pl-5 pr-10 rounded-3xl focus:outline-none text-sm font-light bg-background-200"
					placeholder="Write a comment..."
					{...register("body", { requird: true })}
				/>
			</div>

			<button className="absolute right-5 top-1/2 -translate-y-1/2">
				<SendFill className="text-primary-default" />
			</button>
		</form>
	);
};

const Comment = ({
	_id,
	author: {
		user: { avatar, name },
	},
	body,
	date,
	isParent,
	children: rawChildren,
	id,
	updater,
}) => {
	const distance = formatDistance(new Date(date), new Date(), { addSuffix: true });
	const [showReply, setShowReply] = useState(false);
	const [repliesLength, setRepliesLength] = useState(1);
	const [children, setChildren] = useState([]);

	useEffect(() => {
		const childArr = [...(Array.isArray(rawChildren) ? rawChildren : [])];
		childArr?.sort(({ date: dateA }, { date: dateB }) => new Date(dateB) - new Date(dateA));
		setChildren((_) => childArr);
	}, [rawChildren]);

	return (
		<div className="flex mt-3">
			<div className="px-2">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					className="w-8 h-8 rounded-full object-cover"
					alt=""
				/>
			</div>
			<div className="grow">
				<div className="">
					<p className="text-sm font-semibold">
						{name}: <span className="font-normal text-gray-500">{body}</span>
					</p>
					{/* <p className="text-sm">{body}</p> */}
					<div className="flex items-center gap-2 my-2">
						{isParent ? (
							<button className="text-xs hover:underline" onClick={() => setShowReply((_) => !_)}>
								<ArrowReturnRight className="inline" /> Reply to comment
							</button>
						) : (
							<div></div>
						)}
						{isParent && !repliesLength && children && children.length ? (
							<button
								className="text-xs hover:underline"
								onClick={() => setRepliesLength((_) => 5)}
							>
								<Eye className="inline" /> Show replies
							</button>
						) : null}
						{isParent && repliesLength && children && children.length ? (
							<button
								className="text-xs hover:underline"
								onClick={() => setRepliesLength((_) => 0)}
							>
								<EyeSlash className="inline" /> Hide replies
							</button>
						) : null}
					</div>

					{showReply && isParent ? (
						<CommentForm
							id={id}
							parentId={_id}
							updater={() => {
								setShowReply((_) => false);
								updater();
							}}
						/>
					) : null}
				</div>
				{repliesLength && children && children.length
					? children.map((comment, index) => {
							if (index < repliesLength) return <Comment key={comment._id} {...comment} />;
					  })
					: null}
				{children?.length > repliesLength && repliesLength ? (
					<button
						className="text-xs hover:underline"
						onClick={() => setRepliesLength((_) => _ + 5)}
					>
						Show more
					</button>
				) : null}
			</div>
		</div>
	);
};

const Comments = ({ id }) => {
	const [comments, setComments] = useState(null);
	const [counter, setCounter] = useState(0);

	const [commentsLength, setCommentsLength] = useState(2);

	const api = useApi(true);

	useEffect(() => {
		api
			.post("/community/comments", { id })
			.then((data) => {
				setComments((_) => data);
			})
			.catch(console.error);
	}, [counter]);

	return (
		<div className="px-5">
			<CommentForm id={id} updater={() => setCounter((c) => c + 1)} />
			<div className="flex justify-between text-sm my-4">
				<button>All comments</button>
			</div>
			<div className="">
				{comments ? (
					comments.length ? (
						comments.map((comment, index) => {
							if (index < commentsLength)
								return (
									<Comment
										key={comment._id}
										{...comment}
										id={id}
										updater={() => setCounter((c) => c + 1)}
									/>
								);
						})
					) : (
						<p className="text-center text-sm text-gray-500">No comments yet!</p>
					)
				) : (
					<p className="text-center text-sm text-gray-500">Loading...</p>
				)}
			</div>
			{comments?.length > commentsLength ? (
				<>
					<hr className="my-2" />
					<div>
						<button
							className="block w-full py-2 text-sm text-blue-500"
							onClick={() => {
								setCommentsLength((_) => _ + 5);
							}}
						>
							Show more
						</button>
					</div>
				</>
			) : (
				<div className="mb-3"></div>
			)}
		</div>
	);
};

//#region region QuillJs

const QuillContainer = styled.div`
	& .ql-container {
		max-height: 20rem;
		padding: 0 1.25rem;
		border: none;
		border-bottom: none;
		border-radius: 0.5rem 0.5rem 0 0;
		border-color: rgb(209, 213, 219);
		overflow: auto;

		font-size: 1rem;
	}

	& .ql-editor {
		min-height: 100%;
		padding: 0;
	}
`;

//#endregion

const PostTextContent = ({ content }) => {
	return (
		<QuillContainer>
			<ReactQuill defaultValue={content} readOnly={true} modules={{ toolbar: false }} />
		</QuillContainer>
	);
};

const PostMediaContent = ({ files }) => {
	return files && files.length ? (
		<div className="bg-gray-200 overflow-hidden">
			<ReactImageGallery
				items={files.map(({ file }) => ({
					original: file,
				}))}
				showFullscreenButton={false}
				showPlayButton={false}
			/>
		</div>
	) : null;
};

const PostPollOption = ({ label, count, voted, percentage, vote }) => {
	return (
		<button
			onClick={() => vote()}
			className={`flex justify-between px-5 py-3 border rounded-md ${
				voted ? "bg-blue-500/10 text-blue-700" : ""
			} hover:bg-blue-500/20 hover:border-blue-700 transition-colors text-sm`}
		>
			<span>{label}</span>
			<span>{count}</span>
		</button>
	);
};

const PostPollContent = ({ poll: { options, optionOrder, votes: pollVotes }, id }) => {
	const [votes, setVotes] = useState();

	const api = useApi(true);
	useEffect(() => {
		api.post("/community/getVotes", { id }).then(setVotes).catch(console.error);
	}, []);

	const vote = (option) => {
		api.post("/community/vote", { id, option }).then(setVotes).catch(console.error);
	};

	return (
		<div className="flex flex-col gap-3 px-5">
			{optionOrder?.map((option) => (
				<PostPollOption
					id={option}
					label={options[option]?.label}
					count={votes ? votes?.votes[option] : options[option]?.votes}
					voted={votes ? votes.voted == option : false}
					percentage={
						((votes ? votes.votes[option] : options[option]?.votes) || 0) /
						((votes ? votes.totalVotes : pollVotes) || 1)
					}
					vote={() => vote(option)}
				/>
			))}
		</div>
	);
};

const ContentElements = {
	text: (content, id) => <PostTextContent content={content} />,
	media: (content, id) => <PostMediaContent files={content} />,
	poll: (content, id) => <PostPollContent poll={content} id={id} />,
};

const Post = ({
	_id,
	author: { _id: authorId, name, avatar },
	community: { name: communityName },
	date,
	title,
	type,
	content,
	likes,
	liked,
	saved: initialSaved,
	initialShowComments,
}) => {
	const distance = formatDistance(new Date(date), new Date(), { addSuffix: true });
	const [likedStats, setLikedStats] = useState({ liked, likes });
	const [showComments, setShowComments] = useState(!!initialShowComments);
	const api = useApi(true);
	const [saved, setSaved] = useState(initialSaved);

	return (
		<div
			className="flex flex-col gap-5 pt-4 pb-1 bg-background-0 border border-[#e8efff] rounded-lg"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			<div className="flex justify-between px-5">
				<div className="flex items-center gap-4">
					<div className="">
						<img
							src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
							className="w-11 h-11 rounded-full object-cover"
							alt=""
						/>
					</div>
					<div className="">
						<Link to={`/candidate/${authorId}`} className="text-[0.9375rem]">
							{name}
						</Link>
						<p className="text-sm text-gray-500">
							<FontAwesomeIcon icon={faHistory} className="inline mr-2" />
							{distance} on{" "}
							<Link
								to={"/community/" + communityName.replace(/\s+/g, "-")}
								className="inline font-medium text-black"
							>
								{communityName}
							</Link>
						</p>
					</div>
				</div>
			</div>
			<h1 className="px-5 text-[0.9rem]">{title}</h1>
			<div>{ContentElements[type](content, _id)}</div>
			<div className={`flex justify-between items-center ${showComments ? "border-b" : ""} px-2`}>
				<div className={`flex items-center gap-1 pb-2`}>
					<button
						className="flex justify-center items-center gap-2 px-4 py-2 rounded-sm text-letters-tertiary"
						onClick={() => {
							api
								.post("/community/like", { id: _id, like: !likedStats.liked })
								.then(setLikedStats)
								.catch(console.error);
						}}
					>
						<HugeIcon
							icon="like"
							solid={likedStats.liked}
							size="1.25rem"
							className={`${likedStats.liked ? "bg-brand-primary" : "bg-letters-tertiary"}`}
						/>
						{likedStats.likes ? (
							<span
								className={`inline-block text-xs px-1.5 py-0.5 rounded-3xl bg-brand-primary/10 ${
									likedStats.liked ? "text-brand-primary" : ""
								}`}
							>
								{likedStats.likes < 10 ? "0" : ""}
								{likedStats.likes}
							</span>
						) : null}
					</button>
					<button
						className="flex justify-center items-center gap-2 px-4 py-2 rounded-sm text-gray-500"
						onClick={() => setShowComments((_) => !_)}
					>
						<HugeIcon
							icon="comment"
							solid={showComments}
							size="1.25rem"
							className={`${showComments ? "bg-brand-primary" : "bg-letters-tertiary"}`}
						/>
					</button>
					<PopupMenu
						position="top center"
						offsetY={10}
						triggerContent={
							<button className="flex justify-center items-center">
								<HugeIcon
									icon="share-rectangle"
									size="1.25rem"
									className={"px-8 bg-letters-tertiary hover:bg-brand-primary"}
								/>
							</button>
						}
						on={["hover", "click"]}
					>
						{(closeMenu) => (
							<div className="flex gap-3 p-2 border rounded-md bg-background-0 overflow-hidden text-xl text-gray-500">
								<button className="p-4 rounded-lg hover:bg-blue-400/20 hover:text-blue-500">
									<FontAwesomeIcon icon={faCopy} />
								</button>
								<button className="p-4 rounded-lg hover:bg-blue-400/20 hover:text-blue-500">
									<FontAwesomeIcon icon={faFacebook} />
								</button>
								<button className="p-4 rounded-lg hover:bg-blue-400/20 hover:text-blue-500">
									<FontAwesomeIcon icon={faAt} />
								</button>
							</div>
						)}
					</PopupMenu>
				</div>
				<div>
					<button
						className="flex justify-center items-center px-4 py-2 rounded-sm"
						onClick={() => {
							setSaved((_) => !_);
							api
								.post("/user/savePost", { post: _id })
								.then(({ saved }) => setSaved((_) => saved), console.error);
						}}
					>
						<HugeIcon
							icon={"bookmark"}
							solid={saved}
							size="1.25rem"
							className={saved ? "bg-brand-primary" : "bg-letters-tertiary"}
						/>
					</button>
				</div>
			</div>
			{showComments ? <Comments id={_id} /> : null}
		</div>
	);
};

export default Post;
