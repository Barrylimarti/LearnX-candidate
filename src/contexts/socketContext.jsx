import { createContext, useEffect } from "react";

import { io } from "socket.io-client";

const socket = io({
	autoConnect: false,
	reconnectionDelayMax: 10000,
	auth: (cb) => cb({ token: localStorage.getItem("accessToken") }),
	rejectUnauthorized: false,
	transports: ["websocket"],
});

const connectErrorHandler = (err) => {
	console.error("SocketIOError: connect_error due to `" + err.message + "`");
};

const connectHandler = () => {
	console.info("connected: " + socket.connected);
};

export const SocketContext = createContext(socket);

const SocketProvider = ({ children }) => {
	useEffect(() => {
		const handle = setInterval(() => {
			if (!socket.connected) socket.connect();
		}, 1000);

		socket.on("connect_error", connectErrorHandler);
		socket.on("connect", connectHandler);

		return () => {
			socket.off("connect_error", connectErrorHandler);
			socket.off("connect", connectHandler);
			socket.disconnect();
			clearInterval(handle);
		};
	}, []);

	return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export default SocketProvider;
