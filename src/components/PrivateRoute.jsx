import {
  useEffect,
  useState,
} from "react";

import { LineWave } from "react-loader-spinner";
import {
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSetRecoilState } from "recoil";

import {
  faGlobe,
  faQuestionCircle,
  faWarning,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApi from "../lib/useApi";
import userSelector from "../state/user";

export default function PrivateRoute({ element: Component }) {
	const setUser = useSetRecoilState(userSelector);
	const [loading, setLoading] = useState(0);
	const navigate = useNavigate();
	const location = useLocation();

	const api = useApi(false);
	useEffect(() => {
		if (!localStorage.getItem("refreshToken")) {
			navigate("/logout", { state: { redirect: location.pathname + "?" + location.search } });
			return;
		}
		if (Date.now() - parseInt(localStorage.getItem("lastRefresh")) > 1000 * 60 * 5)
			api
				.post("/auth/refresh", {
					refreshToken: localStorage.getItem("refreshToken"),
				})
				.then(({ accessToken, refreshToken, user }) => {
					if (accessToken && refreshToken) {
						localStorage.setItem("accessToken", accessToken);
						localStorage.setItem("refreshToken", refreshToken);
						localStorage.setItem("lastRefresh", Date.now());
						setUser((_) => user);
						// if (!user.startCompleted && location.pathname != "/start") {
						// 	navigate("/start");
						// }
						setLoading(1);
					}
				})
				.catch(({ err: _error, verb }) => {
					if (_error.response?.status) {
						if (_error.response.status == 401) {
							navigate("/logout", {
								state: { redirect: location.pathname + "?" + location.search },
							});
							return;
						}
					}
					setLoading(_error.response?.status || "unkown");
				});
		else setLoading(1);
		const interval = setInterval(() => {
			api
				.post("/auth/refresh", {
					refreshToken: localStorage.getItem("refreshToken"),
				})
				.then(({ accessToken, refreshToken }) => {
					if (accessToken && refreshToken) {
						localStorage.setItem("accessToken", accessToken);
						localStorage.setItem("refreshToken", refreshToken);
						localStorage.setItem("lastRefresh", Date.now());
					}
				})
				.catch(({ err: _error, verb }) => {
					if (_error.response?.status) {
						if (_error.response.status == 401) {
							navigate("/logout", {
								state: { redirect: location.pathname + "?" + location.search },
							});
							return;
						}
					}
					setLoading(_error.response?.status || "unkown");
				});
		}, 5 * 60 * 1000);
		return () => clearInterval(interval);
	}, []);

	return loading == 0 ? (
		<div className="fixed top-0 left-0 flex items-center justify-center h-screen w-screen">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	) : loading == 1 ? (
		Component
	) : (
		<div className="flex items-center justify-center h-screen w-screen p-10">
			<div className="text-4xl font-bold text-black">
				<FontAwesomeIcon icon={faWarning} className="mr-2 text-danger-default" /> Error connecting
				to server.
				<p className="flex items-center mt-6 text-3xl font-bold text-black">
					<FontAwesomeIcon icon={faGlobe} className="mr-4 text-4xl text-danger-default" /> Status
					code: {loading}
				</p>
				<p className="flex items-center mt-6 text-xl font-medium">
					<FontAwesomeIcon icon={faQuestionCircle} className="mr-4 text-4xl text-danger-default" />
					Try reaching out at:{"  "}
					<a href="mailto:connect@lernx.in" className="text-blue-700 underline">
						connect@lernx.in
					</a>
				</p>
			</div>
		</div>
	);
}
