import { useContext } from "react";

import { Link } from "react-router-dom";

import { NotificationContext } from "../../contexts/notificationContext";

const LikeNotification = ({ count, latest: { avatar, name }, time }) => {
	return (
		<Link
			className={`flex gap-4 max-w-full p-2 rounded-md bg-background-0 hover:bg-violet-50 border-b last:border-b-0`}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={name}>
					{name} and {count} others liked your post
				</p>
			</div>
		</Link>
	);
};

const CommentNotification = ({ comment, isReply = true, user: { name, avatar }, time }) => {
	return (
		<Link
			className={`flex gap-4 max-w-full p-2 rounded-md bg-background-0 hover:bg-violet-50 border-b last:border-b-0`}
		>
			<div className="shrink-0 w-10 h-10 border-primary-default rounded-full overflow-hidden">
				<img
					src={avatar || "https://ui-avatars.com/api/?background=random&size=128&name=" + name}
					alt={name}
					className="w-full h-full rounded-full object-cover"
				/>
			</div>
			<div className="grow min-w-[1px] flex flex-col justify-center">
				<p className="text-sm" title={name}>
					{name} {isReply ? "commented on" : "replied to"} your {isReply ? "post" : "comment"}, "
					{comment}"
				</p>
			</div>
		</Link>
	);
};

export default function Notifications() {
	const { unread, notifications, read } = useContext(NotificationContext);

	return (
		<main className="grow flex flex-col p-4">
			{notifications.map(({ id, notifications }, i) => {
				if (notifications[0].type == "like") {
					return (
						<LikeNotification
							key={"notifwindownotif" + i}
							count={notifications.length - 1}
							latest={notifications[0].data.user}
							time={notifications[0].time}
						/>
					);
				} else if (notifications[0].type == "comment") {
					return (
						<CommentNotification
							key={"notifwindownotif" + i}
							comment={notifications[0].data.comment}
							user={notifications[0].data.user}
							time={notifications[0].time}
						/>
					);
				} else if (notifications[0].type == "reply") {
					return (
						<CommentNotification
							key={"notifwindownotif" + i}
							comment={notifications[0].data.comment}
							user={notifications[0].data.user}
							time={notifications[0].time}
							isReply={false}
						/>
					);
				}
			})}
		</main>
	);
}
