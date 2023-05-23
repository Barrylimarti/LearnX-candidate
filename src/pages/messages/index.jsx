import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { format } from "date-fns";
import {
  motion,
  MotionConfig,
} from "framer-motion";
import {
  File,
  Search,
} from "react-bootstrap-icons";
import {
  useForm,
  useWatch,
} from "react-hook-form";
import { LineWave } from "react-loader-spinner";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from "react-router-dom";

import {
  faArrowLeft,
  faEllipsisVertical,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import MessageImage from "../../assets/images/message.png";
import Button from "../../components/utils/Button";
import { SocketContext } from "../../contexts/socketContext";
import useApi from "../../lib/useApi";
import { useMediaQuery } from "../../lib/useMediaQuery";

const Message = ({ self, body, media, time }) => {
	return (
		<div className={`flex ${self ? "justify-end" : "justify-start"}`}>
			<div className="flex flex-col items-end min-w-[20%] max-w-[80%] ">
				<p
					className={`w-full px-3 py-2 rounded-lg ${
						self ? "bg-background-200" : "bg-background-100"
					} text-sm text-black/85 select-text backdrop-blur-xl`}
				>
					{body}
				</p>
				<span className="text-2xs text-letters-tertiary">{format(new Date(time), "HH:mm")}</span>
			</div>
		</div>
	);
};

const Messages = ({ messages, currentUser }) => {
	const allMessages = messages.slice();
	allMessages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
	return (
		<div className="absolute top-0 bottom-0 left-0 right-0">
			<div className="w-full h-full flex flex-col-reverse overflow-y-auto">
				{/* <div className=""> */}
				<div className="flex flex-col justify-end gap-3 px-4">
					{allMessages.map(({ _id, author, body, time }, index) => (
						<Message key={_id} self={author.user == currentUser.user} body={body} time={time} />
					))}
				</div>
				{/* </div> */}
			</div>
		</div>
	);
};

const MessageBox = ({ room, updateMessages }) => {
	const socket = useContext(SocketContext);

	const { register, control, handleSubmit, reset, setFocus } = useForm();
	const taRef = useRef();

	const data = useWatch({ control });

	const onSubmit = async () => {
		if (!data?.body || /^\s*$/.test(data?.body || "")) return;
		socket.emit("message", { room, body: data.body }, (message, err) => {
			if (err) console.error(err);
			else {
				console.info(message);
				updateMessages(message);
				reset();
			}
		});
	};

	const messageRegister = register("body", { required: true });

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="shrink-0 flex items-stretch gap-4 p-4 w-full"
		>
			<input
				ref={taRef}
				type="text"
				{...messageRegister}
				onInput={messageRegister?.onChange}
				className="grow resize-none h-fit max-h-80 px-4 py-3 border rounded-lg shadow text-sm focus:outline-none"
				placeholder="Send a message..."
				autoFocus
			/>
			<Button
				onPointerDown={(e) => {
					e.preventDefault();
					onSubmit();
				}}
				onMouseDown={(e) => {
					e.preventDefault();
				}}
				onClick={(e) => e.preventDefault()}
				theme={"primary"}
				label="Send"
			/>
		</form>
	);
};

export const Chat = ({}) => {
	const location = useLocation();
	const [room, setRoom] = useState(null);
	const [otherUsers, setOtherUsers] = useState([]);
	const [messages, setMessages] = useState([]);
	const api = useApi(true);

	const socket = useContext(SocketContext);

	const updateMessages = (newMessage) => setMessages((curr) => [...curr, newMessage]);
	const onNewMessage = (message, err) => {
		if (err) console.error(err);
		else {
			updateMessages(message);
		}
	};

	useEffect(() => {
		const roomId = location.pathname.split("/")[2].split(/[^\w]/g)[0];
		api.post("/chat/room", { room: roomId }).then((data) => {
			setRoom(data);
		});
	}, [location]);

	useEffect(() => {
		if (!room) return;
		setMessages(room.messages);
		// console.log(room.populatedUsers.filter(({ _id }) => _id != room.currentUser.user));
		setOtherUsers((_) => room.populatedUsers.filter(({ _id }) => _id != room.currentUser.user));
		const joinRoom = () => {
			socket.emit("joinroom", room._id, console.error);
			socket.on("message:" + room._id, onNewMessage);
		};
		const leaveRoom = () => {
			socket.emit("leaveroom", room._id, console.error);
			socket.off("message:" + room._id, onNewMessage);
		};
		joinRoom();
		socket.on("disconnect", leaveRoom);
		socket.on("connect", joinRoom);
		return () => {
			socket.off("connect", joinRoom);
			socket.off("disconnect", leaveRoom);
			leaveRoom();
		};
	}, [room]);

	return (
		<div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col min-h-full max-h-full overflow-hidden">
			{room ? (
				<>
					<div className="flex items-center justify-between p-3 bg-background-200">
						<div className="flex items-center">
							<Link to={"/messaging"} className="p-2 mr-2 hover:text-brand-primary">
								<FontAwesomeIcon icon={faArrowLeft} />
							</Link>
							<img
								src={
									otherUsers[0]?.avatar ||
									"https://ui-avatars.com/api/?background=random&size=128&name=" +
										otherUsers[0]?.name
								}
								alt="user"
								className="w-10 aspect-square rounded-full"
							/>
							<p className="ml-3 font-medium">{otherUsers[0]?.name}</p>
						</div>
						<div className="p-3">
							<FontAwesomeIcon icon={faEllipsisVertical} />
						</div>
					</div>
					<div className="relative grow">
						<Messages messages={messages} currentUser={room.currentUser} />
					</div>
					<MessageBox room={room._id} updateMessages={updateMessages} />
				</>
			) : null}
		</div>
	);
};

const Room = ({ _id, users, currentUser, otherUsers, lastMessage }) => {
	if (!otherUsers && !otherUsers.length) return <></>;

	const uIndex = users.findIndex(({ _id }) => _id == otherUsers[0].user);
	const user = users[uIndex];

	return (
		<NavLink
			to={_id}
			className={({ isActive }) =>
				`flex gap-4 px-3 py-3 ${isActive ? "bg-brand-primary/10" : ""} hover:bg-violet-50`
			}
			state={{ room: { _id, currentUser, otherUser: user } }}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={
						user.avatar ||
						"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name
					}
					alt={user.name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={user.name}>
					{user.name}
				</p>
				{lastMessage ? (
					<p
						className="text-xs font-light text-primary-washedout whitespace-nowrap max-w-full overflow-hidden overflow-ellipsis"
						title={lastMessage.body ? lastMessage.body : ""}
					>
						<span className="font-medium">
							{lastMessage.author.user == currentUser.user ? "You:" : ""}
						</span>{" "}
						{lastMessage.body ? (
							lastMessage.body
						) : (
							<span>
								<File /> File
							</span>
						)}
					</p>
				) : (
					<p className="text-base font-light text-primary-washedout italic">No messages yet</p>
				)}
			</div>
		</NavLink>
	);
};

export function EmptyRoom() {
	return (
		<div className="flex flex-col w-full h-full justify-center items-center">
			<img src={MessageImage} alt="message.png" className="w-1/2" />
			<h4 className="relative bottom-12 text-letters-tertiary text-sm">
				Select a Chat to Start Messaging
			</h4>
		</div>
	);
}

export function Messaging() {
	const [rooms, setRooms] = useState(null);
	const location = useLocation();
	const isMobile = useMediaQuery("(max-width: 1024px)");
	const [open, setOpen] = useState(false);

	const api = useApi(true);
	useEffect(() => {
		api.post("/chat/rooms").then(setRooms).catch(console.error);
	});

	useEffect(() => {
		if (location.pathname.split("/").length > 2) setOpen(true);
		else setOpen(false);
	}, [location]);

	const variants = {
		open: {
			x: "-100%",
		},
		closed: {
			x: "0%",
		},
	};

	return (
		<MotionConfig transition={{ type: "just", duration: 0.25 }}>
			<main className="grow flex items-stretch min-h-full max-h-full min-w-[1px] w-full overflow-hidden">
				<motion.div
					animate={isMobile ? (open ? "open" : "closed") : "closed"}
					variants={variants}
					className={`flex flex-col shrink-0  ${
						isMobile ? "w-full" : "w-[24rem] border-r"
					} md:bg-background-0`}
				>
					<div className="px-4 py-2">
						<div className="flex items-center gap-3 p-3 border rounded-lg">
							<Search size={"1rem"} className="shrink-0 text-gray-400" />
							<input
								type="text"
								className="grow text-sm focus:outline-none"
								placeholder="Search message or chat"
							/>
						</div>
					</div>
					{rooms ? (
						rooms.length ? (
							rooms.map((room) => <Room key={room._id} {...room} />)
						) : (
							<div className="text-center p-6 text-letters-tertiary text-sm">
								No chats to display
							</div>
						)
					) : (
						<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
					)}
				</motion.div>
				<motion.div
					animate={isMobile ? (open ? "open" : "closed") : "closed"}
					variants={variants}
					className={`relative grow shrink-0 ${isMobile ? "w-full" : ""} md:bg-background-0`}
				>
					<Outlet />
				</motion.div>
			</main>
		</MotionConfig>
	);
}
