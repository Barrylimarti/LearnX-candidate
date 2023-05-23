import { useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

export default function Logout() {
	const setUser = useSetRecoilState(userSelector);
	const navigate = useNavigate();

	const api = useApi(false);
	useEffect(() => {
		const finish = () => {
			localStorage.removeItem("user");
			localStorage.removeItem("accessToken");
			localStorage.removeItem("refreshToken");
			setUser(null);
			navigate("/login");
		};
		api
			.post("/auth/logout", { refreshToken: localStorage.getItem("refreshToken") })
			.then(finish, finish);
	}, []);

	return null;
}
