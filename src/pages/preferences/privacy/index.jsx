import {
  useEffect,
  useState,
} from "react";

import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import {
  faAndroid,
  faApple,
  faChrome,
  faLinux,
  faWindows,
} from "@fortawesome/free-brands-svg-icons";
import {
  faChevronLeft,
  faLocation,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../../components/utils/Button";
import useApi from "../../../lib/useApi";

const PasswordSettings = () => {
	const {
		register,
		handleSubmit,
		setFocus,
		formState: { isSubmitting },
		reset,
	} = useForm();
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const api = useApi(true);

	const [success, setSuccess] = useState(false);
	useEffect(() => {
		if (success) {
			const handle = setTimeout(() => {
				setSuccess((_) => false);
			}, 3000);
			return () => clearTimeout(handle);
		}
	}, [success]);

	const onSubmit = async (data) => {
		try {
			const { error } = await api.post("/user/updatepassword", data);
			if (error) setError(error);
			else {
				setSuccess((_) => true);
				reset();
			}
		} catch (error) {
			console.error({ data, error });
			setError(error.verb);
			setSuccess((_) => false);
		}
	};

	return (
		<form className="border rounded-xl" onSubmit={handleSubmit(onSubmit)}>
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium text-letters-secondary">Change Password</h1>
			</div>
			<div className="px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
				{error ? <span className="block px-3 py-1 text-danger-default">{error}</span> : null}
				<div className="px-3 py-2 border rounded-sm" onClick={() => setFocus("old")}>
					<label className="block mb-1 text-xs text-letters-tertiary cursor-text">
						Old Password
					</label>
					<input
						type={"password"}
						className="w-full text-sm text-letters-secondary focus:outline-none"
						placeholder="••••••••••••"
						{...register("old")}
					/>
				</div>
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
					<div className="col-span-1 px-3 py-2 border rounded-sm" onClick={() => setFocus("new")}>
						<label className="block mb-1 text-xs text-letters-tertiary cursor-text">
							New Password
						</label>
						<input
							type={"password"}
							className="w-full text-sm text-letters-secondary focus:outline-none"
							placeholder="••••••••••••"
							{...register("new")}
						/>
					</div>
					<div
						className="col-span-1 px-3 py-2 border rounded-sm"
						onClick={() => setFocus("confirm")}
					>
						<label className="block mb-1 text-xs text-letters-tertiary cursor-text">
							Confirm New Password
						</label>
						<input
							type={"password"}
							className="w-full text-sm text-letters-secondary focus:outline-none"
							placeholder="••••••••••••"
							{...register("confirm")}
						/>
					</div>
				</div>
				<div className="mt-6 flex items-center justify-end gap-4">
					<p className="text-xs text-green-600">
						{success ? "Password updated successfully!" : null}
					</p>
					<div className="min-w-[6rem] flex flex-col">
						<Button theme={"primary"} isLoading={isSubmitting} label={"Save"} />
					</div>
				</div>
			</div>
		</form>
	);
};

const Devices = () => {
	const [devices, setDevices] = useState(null);
	const api = useApi(true);
	useEffect(() => {
		api.post("/user/devices").then(setDevices).catch(console.error);
	}, []);
	return (
		<div className="border rounded-xl mt-6">
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium text-letters-secondary">Devices</h1>
			</div>
			<div className="px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
				{devices
					? devices.length
						? devices.map((val, index) => {
								return (
									<div key={index}>
										<div className="flex items-center gap-3">
											<div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary text-lg text-white">
												<FontAwesomeIcon
													icon={
														/windows/i.test(val.os)
															? faWindows
															: /ios/i.test(val.os) || /mac\sos/i.test(val.os)
															? faApple
															: /android/i.test(val.os)
															? faAndroid
															: /linux/i.test(val.os)
															? faLinux
															: /chrome/i.test(val.os)
															? faChrome
															: faQuestionCircle
													}
												/>
											</div>
											<div>
												<p className="capitalize text-sm mb-1">{val.os}</p>
												<p className="text-xs text-letters-secondary mb-0.5">
													Last accessed: {format(new Date(val.lastAccessed), "hh:mm - dd MMM")}
												</p>
												<p className="text-xs text-letters-tertiary">
													<FontAwesomeIcon icon={faLocation} /> {val.location}
												</p>
											</div>
										</div>
										{index != devices.length - 1 ? <hr className="my-2" /> : null}
									</div>
								);
						  })
						: null
					: null}
			</div>
		</div>
	);
};

export default function PrivacyPreferences() {
	return (
		<div className="h-full">
			<div className="flex md:hidden items-center px-4 py-2 bg-background-200">
				<Link to={"/preferences"} className="p-2 mr-2 rounded-full hover:bg-violet-50">
					<FontAwesomeIcon icon={faChevronLeft} />
				</Link>
				<p className="font-medium">Privacy & Security</p>
			</div>
			<div className=" p-6 overflow-y-auto">
				<PasswordSettings />
				<Devices />
			</div>
		</div>
	);
}
