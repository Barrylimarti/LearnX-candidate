import "react-toastify/dist/ReactToastify.min.css";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import {
  toast,
  ToastContainer,
} from "react-toastify";

import useApi from "../lib/useApi";
import { SocketContext } from "./socketContext";

export const NotificationContext = createContext();

const MessageNotification = ({ room, author: { name, avatar }, body, closeToast }) => {
	return (
		<Link
			to={"/messaging/" + room}
			className={`flex gap-4 max-w-full bg-background-0`}
			onClick={closeToast}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-lg font-medium" title={name}>
					{name}
				</p>
				<p
					className="text-sm font-light text-primary-washedout whitespace-nowrap max-w-full overflow-hidden overflow-ellipsis"
					title={body ? body : ""}
				>
					{body ? body : <span>New message</span>}
				</p>
			</div>
		</Link>
	);
};

const LikeNotification = ({
	post,
	user: { name, avatar },
	community: { name: community, image },
	closeToast,
}) => {
	return (
		<Link className={`flex gap-4 max-w-full bg-background-0`} onClick={closeToast}>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm font-medium" title={name}>
					{name} liked your post
				</p>
			</div>
		</Link>
	);
};

const CommentNotification = ({
	post,
	user: { name, avatar },
	community: { name: community, image },
	comment: body,
	closeToast,
	reply = false,
}) => {
	return (
		<Link className={`flex gap-4 max-w-full bg-background-0`} onClick={closeToast}>
			<div className="shrink-0 w-10 h-10 rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={name}>
					<span className="font-medium">{name}</span>{" "}
					{reply ? "replied to your comment" : "commented your post:"} "{body}"
				</p>
			</div>
		</Link>
	);
};

const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState({
		unread: 0,
		notifications: [],
	});
	const socket = useContext(SocketContext);

	const api = useApi(true);

	const onNotification = (notification) => {
		api.post("/user/notifications").then(setNotifications).catch(console.error);
		switch (notification.type) {
			case "message":
				if (toast.isActive(notification.identifier))
					toast.update(notification.identifier, {
						render: ({ closeToast }) => (
							<MessageNotification {...notification.data} closeToast={closeToast} />
						),
					});
				else
					toast(
						({ closeToast }) => (
							<MessageNotification {...notification.data} closeToast={closeToast} />
						),
						{
							toastId: notification.identifier,
						}
					);
				break;
			case "like":
				if (toast.isActive(notification.identifier))
					toast.update(notification.identifier, {
						render: ({ closeToast }) => (
							<LikeNotification {...notification.data} closeToast={closeToast} />
						),
					});
				else
					toast(
						({ closeToast }) => <LikeNotification {...notification.data} closeToast={closeToast} />,
						{
							toastId: notification.identifier,
						}
					);
				break;
			case "comment":
				toast(
					({ closeToast }) => (
						<CommentNotification {...notification.data} closeToast={closeToast} />
					),
					{
						toastId: notification.identifier,
					}
				);
				break;
			case "reply":
				toast(
					({ closeToast }) => (
						<CommentNotification {...notification.data} closeToast={closeToast} reply={true} />
					),
					{
						toastId: notification.identifier,
					}
				);
				break;
		}
	};

	const read = async () => {
		api.post("/user/readnotifications").then(setNotifications).catch(console.error);
	};

	useEffect(() => {
		api.post("/chat/unread").then((data) => {
			let unread = 0;
			let chats = 0;
			data.forEach(({ unread: _unread }) => {
				unread += _unread;
				++chats;
			});
			if (unread)
				toast(
					({ closeToast }) => (
						<div>
							{unread} new messages from {chats} chats
						</div>
					),
					{ toastId: crypto.randomUUID() }
				);
		});
		api.post("/user/notifications").then(setNotifications).catch(console.error);
		socket.on("notification", onNotification);
		socket.on("connect", () => {
			socket.off("notification", onNotification);
			socket.on("notification", onNotification);
		});
		socket.on("disconnect", () => {
			socket.off("notification", onNotification);
		});
		return () => {
			socket.off("notification", onNotification);
		};
	}, []);

	return (
		<NotificationContext.Provider
			value={{ unread: notifications.unread, notifications: notifications.notifications, read }}
		>
			{children}
			<ToastContainer
				position="bottom-right"
				className="!w-96"
				bodyClassName={"max-w-[calc(100%_-_14px)]"}
				toastClassName={"max-w-full"}
				autoClose={4000}
			/>
		</NotificationContext.Provider>
	);
};

export default NotificationProvider;
