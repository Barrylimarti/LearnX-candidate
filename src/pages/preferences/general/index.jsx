import {
  useEffect,
  useState,
} from "react";

import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";
import { LineWave } from "react-loader-spinner";
import { Link } from "react-router-dom";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";

import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../../components/utils/Button";
import useApi from "../../../lib/useApi";

const reactSelectProps = {
	classNames: {
		container: () => `w-full`,
		control: ({ isFocused }) => {
			return `!px-3 !border-none !border-0 !shadow-none !outline-none !rounded-sm !min-h-0 !bg-transparent !text-gray-900 !text-sm`;
		},
		indicatorSeparator: () => `hidden`,
		valueContainer: () => `!py-0 !px-0`,
	},
	styles: {
		indicatorsContainer: (baseStyles, state) => ({
			...baseStyles,
			div: {
				padding: "0!important",
			},
		}),
	},
};

const Username = () => {
	const [user, setUser] = useState(null);
	const {
		register,
		control,
		handleSubmit,
		setFocus,
		formState: { isSubmitting },
	} = useForm();
	const username = useWatch({ control, name: "username" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);

	const api = useApi(true);
	useEffect(() => {
		if (!username) return;
		if (user?.username == username) {
			setError(false);
		} else {
			const handle = setTimeout(() => {
				api.post("/data/validateusername", { username }).then(({ error }) => {
					setError((_) => error);
				});
			}, 300);

			return () => clearTimeout(handle);
		}
	}, [username]);
	useEffect(() => {
		api.post("/user/info", { keys: "username" }).then(setUser).catch(console.error);
	}, []);

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
			const updatedUser = await api.post("/user/update", {
				...data,
				keys: "username",
			});
			setUser((_) => updatedUser);
			setSuccess((_) => true);
		} catch (err) {
			console.error(err);
			setError(err.verb);
		}
	};
	return (
		<form className="border rounded-xl mt-6 text-sm" onSubmit={handleSubmit(onSubmit)}>
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium">Change Username</h1>
			</div>
			{user ? (
				<div className="px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
					{error ? <span className="block px-3 py-1 text-danger-default">{error}</span> : null}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
						<div className="px-3 py-2 border rounded-sm" onClick={() => setFocus("username")}>
							<label className="block mb-1 text-xs text-letters-tertiary cursor-text">
								Username
							</label>
							<input
								spellCheck={false}
								type={"text"}
								className="w-full text-sm text-gray-900 focus:outline-none"
								defaultValue={user.username}
								{...register("username", { pattern: /\w+/ })}
							/>
						</div>
					</div>
					<span className="block px-3 py-1 text-xs text-primary-washedout/60">
						You can change your username to another username that is not currently in use.
					</span>
					<div className="mt-6 flex items-center justify-end gap-4">
						<p className="text-xs text-green-600">
							{success ? "Username updated successfully!" : null}
						</p>
						<div className="min-w-[6rem] flex flex-col">
							<Button theme={"primary"} isLoading={isSubmitting} label={"Save"} />
						</div>
					</div>
				</div>
			) : (
				<div className="h-32 flex items-center justify-center">
					<LineWave width="100" color="#7A77FF" className="text-brand-primary" />
				</div>
			)}
		</form>
	);
};

const availableGenders = {
	male: "Male",
	female: "Female",
	trans: "Transgender",
	na: "Rather Not Say",
};

const BasicProfile = () => {
	const [user, setUser] = useState(null);
	const {
		register,
		control,
		handleSubmit,
		setFocus,
		formState: { errors, isSubmitting },
	} = useForm();
	const [locState, setLocState] = useState("");

	const api = useApi(true);

	useEffect(() => {
		api.post("/user/info", { keys: "name location gender" }).then(setUser).catch(console.error);
	}, []);

	useEffect(() => {
		if (!user) return;
		setLocState(user.location?.state);
	}, [user]);

	const [error, setError] = useState(false);
	const [success, setSuccess] = useState(false);
	useEffect(() => {
		if (success) {
			const handle = setTimeout(() => {
				setSuccess((_) => false);
			}, 3000);
			return () => clearTimeout(handle);
		}
	}, [success]);

	const getStates = async (key) => {
		return await api.post("/data/states", { key: key }).then((results) => {
			return results.map((name) => ({ label: name, value: name }));
		});
	};
	const getLocations = async (key) => {
		return await api.post("/data/locations", { key: key, state: locState }).then((locations) => {
			return locations.map((location) => ({ label: location?.name, value: location?._id }));
		});
	};

	const onSubmit = async (data) => {
		try {
			const updatedUser = await api.post("/user/update", {
				...data,
				keys: "name location gender",
			});
			setUser((_) => updatedUser);
			setSuccess((_) => true);
			setError(false);
		} catch (err) {
			console.error(err);
			setError(err.verb);
			setSuccess(false);
		}
	};

	return (
		<form className="border rounded-xl" onSubmit={handleSubmit(onSubmit)}>
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium">Basic Profile</h1>
			</div>
			{user ? (
				<div className="px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
					<div className="px-3 py-2 border rounded-sm" onClick={() => setFocus("name")}>
						<label className="block mb-1 text-xs text-letters-tertiary cursor-text">Name</label>
						<input
							className="w-full text-sm text-gray-900 focus:outline-none"
							defaultValue={user.name}
							{...register("name")}
						/>
					</div>
					<span className="block px-3 py-1 text-xs text-primary-washedout/60">
						First words your peers read about you after your name, so it's important to make it
						count.
					</span>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
						<div className="col-span-1 grid grid-cols-2 gap-3">
							<div className="col-span-1 py-2 border mt-4 rounded-sm">
								<label className="block px-3 text-xs text-letters-tertiary cursor-text">
									State
								</label>
								<AsyncSelect
									{...reactSelectProps}
									placeholder="Select state"
									value={!!locState ? { label: locState, value: locState } : null}
									defaultOptions
									cacheOptions
									loadOptions={getStates}
									onChange={({ value }) => setLocState(value)}
								/>
							</div>
							<div className="col-span-1 py-2 border mt-4 rounded-sm">
								<label className="block px-3 text-xs text-letters-tertiary cursor-text">City</label>
								<Controller
									name={"location"}
									control={control}
									rules={{ required: true }}
									defaultValue={user.location?._id}
									render={({ field: { onChange, value } }) => (
										<AsyncSelect
											key={locState}
											{...reactSelectProps}
											placeholder="Select city"
											loadOptions={getLocations}
											defaultValue={{ label: user.location?.name, value: user.location?._id }}
											defaultOptions
											onChange={({ value }) => onChange(value)}
											isDisabled={locState?.length == 0}
										/>
									)}
								/>
							</div>
						</div>
						<div className="col-span-1 py-2 border mt-4 rounded-sm">
							<label className="block px-3 text-xs text-letters-tertiary cursor-text">Gender</label>
							<Controller
								name={"gender"}
								control={control}
								rules={{ required: true }}
								defaultValue={user.gender}
								render={({ field: { onChange, value } }) => (
									<ReactSelect
										{...reactSelectProps}
										placeholder="Select gender"
										defaultValue={{ label: availableGenders[user.gender], value: user.gender }}
										options={[
											{ label: "Male", value: "male" },
											{ label: "Female", value: "female" },
											{ label: "Transgender", value: "trans" },
											{ label: "Rather Not Say", value: "na" },
										]}
										onChange={({ value }) => onChange(value)}
									/>
								)}
							/>
						</div>
					</div>
					<div className="mt-6 flex items-center justify-end gap-4">
						<p className="text-xs text-green-600">
							{success ? "Profile updated successfully!" : null}
						</p>
						<div className="min-w-[6rem] flex flex-col">
							<Button
								theme={"primary"}
								isLoading={isSubmitting}
								label={"Save"}
								iconPosition="left"
								// icon={<HugeIcon icon="save" className={"bg-current"} size="1rem" />}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="h-32 flex items-center justify-center">
					<LineWave width="100" color="#7A77FF" className="text-brand-primary" />
				</div>
			)}
		</form>
	);
};

const ContactDetails = () => {
	const [user, setUser] = useState(null);
	const {
		register,
		control,
		handleSubmit,
		setFocus,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm();
	const [locState, setLocState] = useState("");

	const api = useApi(true);

	useEffect(() => {
		api.post("/user/info", { keys: "email phone" }).then(setUser).catch(console.error);
	}, []);

	const [error, setError] = useState(false);
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
			const updatedUser = await api.post("/user/update", {
				...data,
				keys: "email phone",
			});
			setUser((_) => updatedUser);
			setSuccess((_) => true);
			setError(false);
		} catch (err) {
			console.error(err);
			setError(err.verb);
			setSuccess(false);
		}
	};

	return (
		<form className="border mt-6 rounded-xl" onSubmit={handleSubmit(onSubmit)}>
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium">Contact Details</h1>
			</div>
			{user ? (
				<div className="flex flex-col gap-5 px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
					<div className="px-3 py-2 border rounded-sm" onClick={() => setFocus("email")}>
						<label className="block mb-1 text-xs text-letters-tertiary cursor-text">Email</label>
						<input
							type={"email"}
							className="w-full text-sm text-gray-900 focus:outline-none"
							defaultValue={user.email}
							{...register("email")}
						/>
					</div>
					<div className="px-3 py-2 border rounded-sm" onClick={() => setFocus("phone")}>
						<label className="block mb-1 text-xs text-letters-tertiary cursor-text">Phone</label>
						<input
							className="w-full text-sm text-gray-900 focus:outline-none"
							defaultValue={user.phone}
							// onKeyDown={(e) => {
							// 	if (!/^\d+$/.test(e.key)) {
							// 		e.preventDefault();
							// 	}
							// }}
							// onInput={(e) => {
							// 	if (!/^\d+$/.test(e.target.value)) {
							// 		e.target.value()
							// 		setError((_) => "phone number can only include digits");
							// 	}
							// 	setValue("phone", e.target.value);
							// }}
							{...register("phone")}
						/>
					</div>
					<div className="mt-6 flex items-center justify-end gap-4">
						<p className="text-xs text-green-600">
							{success ? "Profile updated successfully!" : null}
						</p>
						<div className="min-w-[6rem] flex flex-col">
							<Button
								theme={"primary"}
								isLoading={isSubmitting}
								label={"Save"}
								iconPosition="left"
								// icon={<HugeIcon icon="save" className={"bg-current"} size="1rem" />}
							/>
						</div>
					</div>
				</div>
			) : (
				<div className="h-32 flex items-center justify-center">
					<LineWave width="100" color="#7A77FF" className="text-brand-primary" />
				</div>
			)}
		</form>
	);
};

export default function GeneralPreferences() {
	return (
		<div className="h-full">
			<div className="flex md:hidden items-center px-4 py-2 bg-background-200">
				<Link to={"/preferences"} className="p-2 mr-2 rounded-full hover:bg-violet-50">
					<FontAwesomeIcon icon={faChevronLeft} />
				</Link>
				<p className="font-medium">General</p>
			</div>
			<div className=" p-6 overflow-y-auto">
				<BasicProfile />
				<Username />
				<ContactDetails />
			</div>
		</div>
	);
}
