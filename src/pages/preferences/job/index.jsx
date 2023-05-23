import {
  useEffect,
  useState,
} from "react";

import { useForm } from "react-hook-form";
import { LineWave } from "react-loader-spinner";
import { Link } from "react-router-dom";
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

const JobField = () => {
	const [field, setField] = useState(null);
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
		api
			.post("/user/info", { keys: "field" })
			.then(({ field }) => setField((_) => field))
			.catch(console.error);
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

	const getDesignations = async (key) => {
		return await api.post("/data/designations", { key: key }).then((results) => {
			return results.map(({ name }) => ({ label: name, value: name }));
		});
	};

	const onSubmit = async (data) => {
		try {
			const updatedUser = await api.post("/user/update", {
				field: field,
				keys: "field",
			});
			setField((_) => updatedUser.field);
			setSuccess((_) => true);
			setError(false);
		} catch (err) {
			console.error(err);
			setError(err.verb);
			setSuccess(false);
		}
	};
	return (
		<form className="border rounded-xl overflow-visible" onSubmit={handleSubmit(onSubmit)}>
			<div className="bg-background-200 px-4 py-3 border-b rounded-t-xl">
				<h1 className="font-medium">Career Profile</h1>
			</div>
			{field ? (
				<div className="px-6 py-5 bg-background-0 border-none border-0 rounded-b-xl">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-2">
						<div className="col-span-2 grid grid-cols-2 gap-3">
							<div className="col-span-1 py-2 border mt-4 rounded-sm">
								<label className="block px-3 text-xs text-letters-tertiary cursor-text">
									Designation
								</label>
								<AsyncSelect
									{...reactSelectProps}
									placeholder="Select designation"
									defaultValue={field ? { label: field, value: field } : null}
									defaultOptions
									cacheOptions
									loadOptions={getDesignations}
									onChange={({ value }) => setField(value)}
								/>
							</div>
						</div>
					</div>
					<div className="mt-6 flex items-center justify-end gap-4">
						<p className="text-xs text-green-600">
							{success ? "Profile updated successfully!" : null}
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

export default function JobPreferences() {
	return (
		<div className="grow h-full">
			<div className="flex md:hidden items-center px-4 py-2 bg-background-200">
				<Link to={"/preferences"} className="p-2 mr-2 rounded-full hover:bg-violet-50">
					<FontAwesomeIcon icon={faChevronLeft} />
				</Link>
				<p className="font-medium">Job</p>
			</div>
			<div className="h-full p-6">
				<JobField />
			</div>
		</div>
	);
}
