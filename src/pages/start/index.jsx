import {
  useEffect,
  useState,
} from "react";

import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import Button from "../../components/utils/Button";
import useApi from "../../lib/useApi";
import userSelector from "../../state/user";

const reactSelectProps = {
	classNames: {
		container: () => `w-full`,
		control: ({ isFocused }) => {
			return `!px-2 !py-1 !border-solid !border ${
				isFocused ? "!border-violet-800" : "!border-letter-secondary"
			} !shadow-none !outline-none !rounded-md !min-h-0 !text-xs`;
		},
		indicatorSeparator: () => `hidden`,
		valueContainer: () => `!py-0`,
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

const arrayToOptions = (arr) =>
	arr.map((val) => ({
		label: val,
		value: val,
	}));

const gradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const GradientAnimatedDiv = styled.div`
	background: linear-gradient(-45deg, #df5fff, #8132ff, #f715ff, #c061ff);
	background-size: 400% 400%;
	animation: ${gradientAnimation} 15s ease infinite;
`;

export default function Start() {
	const [user, setUser] = useRecoilState(userSelector);
	const {
		register,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();

	const username = useWatch({ control, name: "username" });

	const [error, setError] = useState(null);
	const [locState, setLocState] = useState("");

	const api = useApi(true);
	const navigate = useNavigate();

	useEffect(() => {
		if (user?.username == username) {
			setError(false);
		} else if (username) {
			const handle = setTimeout(() => {
				api.post("/data/validateusername", { username }).then(({ error }) => {
					setError((_) => error);
				});
			}, 300);

			return () => clearTimeout(handle);
		}
	}, [username]);

	useEffect(() => {
		if (user.startCompleted) {
			navigate("/home");
		}
	}, []);

	const onSubmit = async (data) => {
		try {
			await api.post("/user/start", data);
			const newUser = { ...user };
			newUser.startCompleted = true;
			setUser((_) => newUser);
			navigate("/home");
		} catch (err) {
			setError(err.response?.data?.error);
		}
	};

	const dataApi = useApi(false);
	const getStates = async (key) => {
		return await dataApi.post("/data/states", { key: key }).then((results) => {
			return results.map((name) => ({ label: name, value: name }));
		});
	};
	const getLocations = async (key) => {
		return await dataApi
			.post("/data/locations", { key: key, state: locState })
			.then((locations) => {
				return locations.map(({ name, _id }) => ({ label: name, value: _id }));
			});
	};
	const getDesignations = async (key) => {
		return await dataApi.post("/data/designations", { key: key }).then((results) => {
			return results.map(({ name }) => ({ label: name, value: name }));
		});
	};

	return (
		<div className="fixed left-0 top-0 w-screen h-screen bg-brand-primary">
			<form
				className="w-full max-w-xl px-16 py-10 rounded-lg mt-36 mx-auto bg-white shadow-2xl"
				onSubmit={handleSubmit(onSubmit)}
				action=""
			>
				<div className="mb-6">
					<h1 className="text-center text-2xl leading-relaxed font-semibold text-brand-primary">
						Let's start your journey with Spehre!
					</h1>
				</div>
				<div className="mb-4">
					<label className="block mb-1 text-xs font-medium text-letters-secondary">Username</label>
					<input
						spellCheck={false}
						type={"text"}
						className="w-full py-2 px-3 border rounded-md focus:outline-none text-xs"
						{...register("username", { pattern: /\w+/ })}
					/>
					{error ? <span className="block py-1 text-xs text-danger-default">{error}</span> : null}
				</div>
				<div className="grid grid-cols-2 gap-3 mb-4">
					<div className="col-span-1">
						<label className="block mb-1 text-xs font-medium text-letters-secondary">State</label>
						<AsyncSelect
							{...reactSelectProps}
							placeholder="Select..."
							value={locState ? { label: locState, value: locState } : null}
							defaultOptions
							cacheOptions
							loadOptions={getStates}
							onChange={({ value }) => setLocState(value)}
						/>
					</div>
					<div className="col-span-1">
						<label className="block mb-1 text-xs font-medium text-letters-secondary">City</label>
						<Controller
							name={"location"}
							control={control}
							rules={{ required: true }}
							render={({ field: { onChange, value } }) => (
								<AsyncSelect
									key={locState}
									{...reactSelectProps}
									placeholder="Select..."
									loadOptions={getLocations}
									defaultOptions
									onChange={({ value }) => onChange(value)}
									isDisabled={locState.length == 0}
								/>
							)}
						/>
					</div>
				</div>
				<div className="mb-4"></div>
				<div className="mb-4">
					<label className="block mb-1 text-xs font-medium text-letters-secondary">
						Designation You Have Or Looking For
					</label>
					<Controller
						name={"field"}
						control={control}
						rules={{ required: true }}
						render={({ field: { onChange, value } }) => (
							<AsyncSelect
								{...reactSelectProps}
								placeholder="Select designation"
								loadOptions={getDesignations}
								defaultOptions
								cacheOptions
								onChange={({ value }) => onChange(value)}
							/>
						)}
					/>
				</div>

				<div className="flex justify-center">
					<Button theme={"primary"} isLoading={isSubmitting} label="Start" />
				</div>
			</form>
		</div>
	);
}
