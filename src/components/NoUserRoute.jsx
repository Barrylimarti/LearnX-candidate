import { Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import userSelector from "../state/user";

export default function NoUserRoute({ children }) {
	const user = useRecoilValue(userSelector);

	return !user?.id ? (
		children
	) : (
		<Navigate to={user.startCompleted ? "/home" : "/start"} replace={false} />
	);
}
