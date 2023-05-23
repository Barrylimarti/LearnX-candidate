import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Controller,
  useForm,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { useSetRecoilState } from "recoil";

import CreateBg from "../../../assets/backgrounds/community_create.webp";
import Button from "../../../components/utils/Button";
import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

const reactSelectProps = {
	classNames: {
		container: () => `w-full`,
		control: ({ isFocused }) => {
			return `!px-2 !py-2 !border-solid !border !border-gray-200 ${
				isFocused ? "!border-gray-500" : ""
			} !shadow-none !outline-none !rounded-md !min-h-0 !bg-[#f6f9ff]/30 !text-sm`;
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

export default function CreateCommunity() {
	const setUser = useSetRecoilState(userSelector);
	const {
		register,
		handleSubmit,
		watch,
		setValue,
		control,
		formState: { isSubmitting },
	} = useForm();
	const [error, setError] = useState(null);
	const imgRef = useRef(null);

	const navigate = useNavigate();
	const api = useApi(true);

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append("file", data.file[0]);
		const { name, tags, description } = data;
		formData.append("meta", JSON.stringify({ name, tags, description }));
		try {
			await api.post("/community/create", formData, "multipart/form-data");
			setUser((user) => ({ ...user, _v: user._v + 1 }));
			navigate("/community/" + name.replace(/\s+/g, "-"));
		} catch (error) {
			if (!error) {
				setError(null);
			} else {
				setError(error.verb);
			}
		}
	};

	const file = watch("file");
	useEffect(() => {
		if (file && file[0]) {
			const reader = new FileReader();
			reader.onload = () => {
				imgRef.current.src = reader.result;
				imgRef.current.hidden = false;
			};
			reader.readAsDataURL(file[0]);
		} else {
			imgRef.current.hidden = true;
		}
	}, [file]);

	const selectRef = useRef();

	return (
		<main className="relative h-full max-h-[39rem] p-10">
			<div className="h-full grid grid-cols-12 border rounded-2xl shadow overflow-hidden">
				<div className="hidden lg:block col-span-5">
					<img src={CreateBg} alt="" className="w-full h-full object-cover" />
				</div>
				<div className="col-span-12 lg:col-span-7 relative h-full">
					<div className="absolute top-0 left-0 bottom-0 right-0 px-6 py-5 overflow-y-auto">
						<h1 className="mb-1 text-xl font-semibold text-[#343434]">Create your Community</h1>
						<p className="text-xs text-[#575757] mb-5">
							Give your community a individuality with a name and an icon. You can always change it
							later.
						</p>
						<form onSubmit={handleSubmit(onSubmit)}>
							<div className="flex items-center gap-2 mb-3">
								<div className="shrink-0">
									<div
										className="w-fit"
										onDragOver={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onDrop={(e) => {
											e.stopPropagation();
											e.preventDefault();
											const files = e.dataTransfer.files;
											if (files.length) {
												setValue("file", files);
											}
										}}
									>
										<input
											id="avatar-input"
											type="file"
											className="absolute h-[1px] w-[1px] opacity-0"
											{...register("file")}
										/>
										<div
											className="relative flex items-center justify-center h-28 w-28 border-2 border-dashed border-[#343434] rounded-full overflow-hidden cursor-pointer"
											onClick={() => document.getElementById("avatar-input").click()}
										>
											<img
												ref={imgRef}
												className="absolute w-full h-full border-0 object-cover"
												hidden={true}
											/>
											<p className="px-8 text-xs text-center text-[#575757]">
												Select or drop files here!
											</p>
										</div>
									</div>
								</div>
								<div className="grow">
									<label className="inline-block text-[#343434] mb-1 text-sm font-semibold">
										Community Name
									</label>
									<input
										type="name"
										className="bg-[#f6f9ff]/30 w-full px-4 py-3 border border-gray-200 focus:border-gray-500 rounded-md focus:outline-none text-sm"
										placeholder="e.g. UX Designers"
										{...register("name", { required: true })}
									/>
								</div>
							</div>
							<div className="mb-3">
								<label className="inline-block text-[#343434] mb-1 text-sm font-semibold">
									Tags
								</label>
								<Controller
									name={"tags"}
									control={control}
									rules={{ required: true }}
									render={({ field: { onChange, value } }) => (
										<CreatableSelect
											ref={selectRef}
											{...reactSelectProps}
											onKeyDown={(e) => {
												if (e.key == " " && selectRef.current.inputRef.value !== "") {
													e.keyCode = "13";
													e.key = "Enter";
													e.code = "Enter";
												} else if (e.key == " " && selectRef.current.inputRef.value === "") {
													e.preventDefault();
												} else if (e.key == "Enter" && selectRef.current.inputRef.value === "") {
													e.preventDefault();
												}
											}}
											isMulti
											placeholder="Enter tags"
											formatCreateLabel={(input) => `${input}`}
											noOptionsMessage={() => " "}
											onChange={(val) => onChange(val.map(({ value }) => value))}
										/>
									)}
								/>
							</div>
							<div className="mb-3 flex gap-6 flex-wrap">
								<div className="grow min-w-[20rem]">
									<label className="inline-block text-[#343434] mb-1 text-sm font-semibold">
										About
									</label>
									<textarea
										className="bg-[#f6f9ff]/30 resize-none w-full h-28 px-4 py-3 border border-gray-200 focus:border-gray-500 rounded-md focus:outline-none text-sm"
										placeholder="Something about this community..."
										{...register("description", { required: true })}
									/>
								</div>
							</div>

							<div className="flex justify-end">
								<Button isLoading={isSubmitting} theme={"tertiary"} label={"Create Community"} />
							</div>
						</form>
					</div>
				</div>
			</div>
		</main>
	);
}
