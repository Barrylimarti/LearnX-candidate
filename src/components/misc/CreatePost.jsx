import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github-dark.css";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import hljs from "highlight.js";
import {
  CloudUpload,
  XSquareFill,
} from "react-bootstrap-icons";
import {
  Controller,
  useFieldArray,
  useForm,
} from "react-hook-form";
import ReactQuill from "react-quill";
import ReactSelect from "react-select";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import {
  faImages,
  faRectangleList,
  faTrashAlt,
} from "@fortawesome/free-regular-svg-icons";
import {
  faChartColumn,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useApi from "../../lib/useApi";
import userSelector from "../../state/user";
import Button from "../utils/Button";

const reactSelectProps = {
	classNames: {
		container: () => `!w-full`,
		control: ({ isFocused }) => {
			return `!py-1 !border !rounded-lg !outline-none !shadow-none !min-h-0 !text-sm`;
		},
		input: () => `!outline-none`,
		indicatorSeparator: () => `!hidden`,
		dropdownIndicator: () => ``,
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

const CreatePollPost = ({ id, submitRef, onUpdate }) => {
	const user = useRecoilValue(userSelector);
	const api = useApi(true);

	const {
		register,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm({
		shouldUnregister: true,
		defaultValues: {
			content: [{ value: "" }],
		},
	});

	const [error, setError] = useState(null);

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			formData.append("id", id);
			formData.append("type", "poll");
			formData.append("title", data.title);
			formData.append("content", JSON.stringify(data.content.map(({ value }) => value)));
			await api.post("/community/createpost", formData, "multipart/form-data");
			onUpdate();
		} catch (error) {
			console.error(error);
			setError(error.verb || "Uknown error occured!");
		}
	};

	const { fields, append, remove } = useFieldArray({ control, name: "content" });

	return (
		<form className="relative flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-5">
				<input
					type="text"
					className="grow p-3 border-2 rounded-lg focus:outline-none focus:border-gray-500"
					placeholder="What's on your mind?"
					autoFocus={true}
					{...register("title", { required: true })}
				/>
			</div>
			<div className="flex flex-col justify-center gap-2 p-3 border-2 rounded-lg border-gray-300">
				{fields.map(({ id }, index) => (
					<div key={id} className="flex gap-3">
						<input
							key={id}
							className="grow px-4 py-2 border rounded-lg focus:outline-none focus:border-2 focus:border-blue-500"
							placeholder={`Option ${index + 1}`}
							{...register(`content.${index}.value`, { required: true })}
						/>
						<button
							type="button"
							className="shrink-0 aspect-square disabled:opacity-50"
							onClick={() => remove(index)}
							disabled={fields.length == 1}
						>
							<FontAwesomeIcon icon={faTrashAlt} className="text-lg text-danger-default" />
						</button>
					</div>
				))}
				<button
					type="button"
					className="px-4 py-2 border rounded-lg hover:bg-blue-500/30 text-blue-700 transition-colors"
					onClick={() => append({ value: "" })}
				>
					<FontAwesomeIcon icon={faPlus} /> Add Option
				</button>
			</div>

			<button
				ref={submitRef}
				className="w-1 h-1 opacity-0 px-4 py-3 rounded-lg bg-gradient-primary font-medium text-white"
			>
				Post
			</button>
		</form>
	);
};

const CreateMediaPost = ({ id, submitRef, onUpdate }) => {
	const user = useRecoilValue(userSelector);
	const {
		register,
		handleSubmit,
		watch,
		reset,
		resetField,
		setValue,
		formState: { isSubmitting },
	} = useForm();
	const [imageList, setImageList] = useState([]);
	const [error, setError] = useState(false);
	const api = useApi(true);

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append("id", id);
		formData.append("type", "media");
		formData.append("title", data.title);
		formData.append("content", "dummy");
		imageList.forEach(({ file }) => formData.append("media", file));
		try {
			await api.post("/community/createpost", formData, "multipart/form-data");
			onUpdate();
			reset();
			setImageList([]);
		} catch (error) {
			console.error(error);
			setError((_) => error?.verb ?? "Unknown error occured!");
		}
	};

	const file = watch("file");
	useEffect(() => {
		if (file && file[0]) {
			if (
				![
					"image/jpeg",
					"image/png",
					"image/apng",
					"image/gif",
					"image/webp",
					"image/svg+xml",
				].includes(file[0].type)
			) {
				resetField("file");
				setError((_) => "Only image files are supported!");
				return;
			}
			const reader = new FileReader();
			reader.onload = () => {
				const image = { file: file[0], src: reader.result };
				setImageList((l) => [...l, image]);
				resetField("file");
			};
			reader.readAsDataURL(file[0]);
		}
	}, [file]);

	useEffect(() => {
		if (error) {
			const handle = setTimeout(() => {
				setError(false);
			}, 3000);

			return () => {
				clearTimeout(handle);
			};
		}
	}, [error]);

	return (
		<form className="relative flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<AnimatePresence>
				{error ? (
					<motion.div
						key={"random"}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md text-white bg-danger-default"
					>
						<span>{error}</span>
					</motion.div>
				) : (
					<></>
				)}
			</AnimatePresence>
			<div className="flex gap-5">
				<input
					type="text"
					className="grow p-3 border-2 rounded-lg focus:outline-none focus:border-gray-500"
					placeholder="What's on your mind?"
					autoFocus={true}
					{...register("title", { required: true })}
				/>
			</div>
			<div className="">
				<div
					className="relative flex gap-2 w-full p-3 border-2 rounded-lg border-gray-300 overflow-x-auto"
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
					<div className="shrink-0 w-48 h-48">
						<input
							id="avatar-input"
							type="file"
							className="absolute h-[1px] w-[1px] opacity-0"
							{...register("file")}
						/>
						<div
							className="relative flex flex-col items-center justify-center h-48 w-48 border-dashed border-2 rounded-lg border-primary-default/60"
							onClick={() => document.getElementById("avatar-input").click()}
						>
							<CloudUpload size={"2rem"} />
							<p className="text-center text-sm">Select or drop files here!</p>
						</div>
					</div>
					{imageList.map(({ src }, index) => (
						<div
							key={index}
							className="relative shrink-0 w-48 h-48 border rounded-xl shadow overflow-hidden"
						>
							<XSquareFill
								className="absolute top-3 right-3 text-lg text-danger-default cursor-pointer"
								onClick={() => {
									setImageList((l) => {
										const newList = l.slice();
										newList.splice(index, 1);
										return newList;
									});
								}}
							/>
							<img src={src} alt="img" className="w-full h-full object-contain" />
						</div>
					))}
				</div>
			</div>

			<button
				ref={submitRef}
				className="w-1 h-1 opacity-0 px-4 py-3 rounded-lg bg-gradient-primary font-medium text-white"
			>
				Post
			</button>
		</form>
	);
};

//#region QuillJs

const quillToolModules = {
	toolbar: {
		container: "#quill-toolbar-custom",
	},
	syntax: {
		highlight: (text) => hljs.highlightAuto(text).value,
	},
};

const quillToolFormats = [
	"header",
	"size",
	"bold",
	"italic",
	"underline",
	"strike",
	"blockquote",
	"code-block",
	"list",
	"bullet",
	"script",
	"link",
	"color",
	"background",
];

const QuillToolbar = () => {
	return (
		<div
			id="quill-toolbar-custom"
			className="flex flex-wrap gap-3 p-3 !border-2 !rounded-b-lg !border-gray-300 ql-toolbar ql-snow"
		>
			<select className="ql-header" defaultValue={""} onChange={(e) => e.persist()}>
				<option value="1"></option>
				<option value="2"></option>
				<option selected></option>
			</select>
			<select className="ql-size">
				<option value="small"></option>
				<option selected></option>
				<option value="large"></option>
				<option value="huge"></option>
			</select>
			<button className="ql-bold">B</button>
			<button className="ql-italic">I</button>
			<button className="ql-strike"></button>
			<button className="ql-list" value="ordered" type="button"></button>
			<button className="ql-list" value="bullet" type="button"></button>
			<button className="ql-blockquote"></button>
			<button className="ql-code-block"></button>
			<select className="ql-color">
				<option value="red"></option>
				<option value="green"></option>
				<option value="blue"></option>
				<option value="orange"></option>
				<option value="violet"></option>
				<option value="#d0d1d2"></option>
				<option selected></option>
			</select>
			<select className="ql-background">
				<option value="red"></option>
				<option value="green"></option>
				<option value="blue"></option>
				<option value="orange"></option>
				<option value="violet"></option>
				<option value="#d0d1d2"></option>
				<option selected></option>
			</select>
			<button className="ql-script" value="sub"></button>
			<button className="ql-script" value="super"></button>
		</div>
	);
};

const QuillContainer = styled.div`
	& .ql-container {
		min-height: 10rem;
		height: 10rem;
		max-height: 15rem;
		border: solid 2px;
		border-bottom: none;
		border-radius: 0.5rem 0.5rem 0 0;
		border-color: rgb(209, 213, 219);
		overflow: auto;

		font-size: 1rem;
	}

	& .ql-editor {
		min-height: 100%;
	}
`;

const CreateTextPost = ({ id, submitRef, onUpdate }) => {
	const user = useRecoilValue(userSelector);
	const { register, control, handleSubmit } = useForm({ shouldUnregister: true });
	const api = useApi(true);

	const [error, setError] = useState(null);

	const onSubmit = async (data) => {
		try {
			const formData = new FormData();
			formData.append("id", id);
			formData.append("type", "text");
			formData.append("title", data.title);
			formData.append("content", data.content);
			await api.post("/community/createpost", formData, "multipart/form-data");
			onUpdate();
		} catch (error) {
			console.error({ error: error?.verb || error });
			setError(error.verb || "Unknown error occured!");
		}
	};

	return (
		<form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
			<div className="flex gap-5">
				<input
					type="text"
					className="grow p-3 border-2 rounded-lg border-gray-300 focus:outline-none focus:border-gray-500"
					placeholder="What's on your mind?"
					autoFocus={true}
					{...register("title", { required: true })}
				/>
			</div>
			<Controller
				name="content"
				control={control}
				defaultValue={null}
				render={({ field: { onChange, onBlur, value, ref } }) => (
					<QuillContainer className="flex flex-col">
						<ReactQuill
							ref={ref}
							placeholder="Start typing..."
							defaultValue={value}
							onChange={(value, _1, _2, _3) => {
								onChange(value);
							}}
							onBlur={onBlur}
							modules={quillToolModules}
							formats={quillToolFormats}
						/>
						<QuillToolbar />
					</QuillContainer>
				)}
			/>
			<button
				ref={submitRef}
				className="w-1 h-1 opacity-0 px-4 py-3 rounded-lg bg-gradient-primary font-medium text-white"
			>
				Post
			</button>
		</form>
	);
};

//#endregion

const CreatePostPlaceholder = ({ changeEditorType = () => {} }) => {
	const user = useRecoilValue(userSelector);

	return (
		<div className="flex">
			<div className="w-12 shrink-0">
				<img
					src={
						user.avatar ||
						"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name
					}
					alt="user"
					className="w-10 h-10 object-cover rounded-full"
				/>
			</div>
			<input
				type="text"
				className="grow h-10 px-5 rounded-3xl bg-background-200 text-sm"
				placeholder="What's on your mind?"
				onClick={(e) => {
					e.preventDefault();
					changeEditorType("text");
				}}
			/>
		</div>
	);
};

const Editors = {
	compact: (id, submitRef, onUpdate, changeEditorType) => (
		<CreatePostPlaceholder changeEditorType={changeEditorType} />
	),
	text: (id, submitRef, onUpdate) => (
		<CreateTextPost id={id} submitRef={submitRef} onUpdate={onUpdate} />
	),
	media: (id, submitRef, onUpdate) => (
		<CreateMediaPost id={id} submitRef={submitRef} onUpdate={onUpdate} />
	),
	poll: (id, submitRef, onUpdate) => (
		<CreatePollPost id={id} submitRef={submitRef} onUpdate={onUpdate} />
	),
};

export default function CreatePost({ commId, updateRef }) {
	const [editorType, setEditorType] = useState("compact");
	const [community, setCommunity] = useState(commId);

	const [communities, setCommunities] = useState([]);

	const submitRef = useRef();
	const api = useApi(true);

	useEffect(() => {
		api.post("/community/list", { userOnly: true }).then(setCommunities);
	}, []);

	const onUpdate = () => {
		updateRef?.current?.update();
		setEditorType("compact");
	};

	const selectRef = useRef(null);

	return (
		<div
			className="flex flex-col gap-4 px-3 py-4 bg-background-0 border border-[#e8efff] rounded-lg"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			{editorType !== "compact" ? (
				<div className="flex items-center justify-between">
					<h1 className="grow text-lg font-medium">Create new post</h1>
					{!commId ? (
						<div className="w-48">
							<ReactSelect
								{...reactSelectProps}
								// defaultValue={
								// 	communities.length
								// 		? { label: communities[0]?.name, value: communities[0]?._id }
								// 		: null
								// }
								ref={selectRef}
								options={communities.map(({ name, _id }) => ({ label: name, value: _id }))}
								onChange={({ value }) => {
									setCommunity(value);
								}}
								noOptionsMessage={({ inputValue: key }) => {
									if (key) return `${key} not found`;
									else return "Join communities";
								}}
							/>
						</div>
					) : null}
				</div>
			) : null}
			{Editors[editorType](community, submitRef, onUpdate, () => setEditorType((_) => "text"))}
			{editorType !== "compact" ? (
				<div className="flex justify-between text-sm font-medium text-primary-washedout">
					<div className="flex items-center">
						<button
							type="button"
							onClick={() => setEditorType((_) => "text")}
							className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg text-gray-500 hover:text-violet-700 ${
								editorType == "text" ? "bg-violet-50 text-violet-700" : ""
							} hover:bg-violet-50 transition-colors`}
						>
							<FontAwesomeIcon icon={faRectangleList} className="text-lg" />
							<p className="text-2xs">Text</p>
						</button>
						<button
							type="button"
							onClick={() => setEditorType((_) => "media")}
							className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg text-gray-500 hover:text-violet-700 ${
								editorType == "media" ? "bg-violet-50 text-violet-700" : ""
							} hover:bg-violet-50 transition-colors`}
						>
							<FontAwesomeIcon icon={faImages} className="text-xl" />
							<p className="text-2xs">Media</p>
						</button>
						<button
							type="button"
							onClick={() => setEditorType((_) => "poll")}
							className={`flex flex-col items-center justify-center gap-1 w-16 h-16 rounded-lg text-gray-500 hover:text-violet-700 ${
								editorType == "poll" ? "bg-violet-50 text-violet-700" : ""
							} hover:bg-violet-50 transition-colors`}
						>
							<FontAwesomeIcon icon={faChartColumn} className="text-xl" />
							<p className="text-2xs">Poll</p>
						</button>
					</div>

					<div className="flex items-center gap-3">
						<Button
							theme={"secondary"}
							label={"Cancel"}
							onClick={() => setEditorType("compact")}
							className="block h-fit px-5 py-2 border rounded-sm border-gray-300 text-sm leading-4 font-normal text-black"
						/>
						<Button
							theme={"primary"}
							label={"Post"}
							onClick={() => {
								if (community) submitRef.current?.click();
								else selectRef.current?.focus();
							}}
							className="block h-fit px-5 py-2 border rounded-sm border-gray-300 text-sm leading-4 font-normal text-black"
						/>
					</div>
				</div>
			) : null}
		</div>
	);
}
