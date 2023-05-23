import "react-datepicker/dist/react-datepicker.css";

import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import {
	Behance,
	CameraFill,
	CloudUpload,
	Dribbble,
	Github,
	GlobeAmericas,
	Linkedin,
	Medium,
	PlusCircleFill,
	X,
} from "react-bootstrap-icons";
import { Controller, useForm } from "react-hook-form";
import { NavLink, Outlet, useOutletContext } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { useRecoilState, useRecoilValue } from "recoil";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPen, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AvatarBackground from "../../assets/images/profile-bg.jpg";
import Button from "../../components/utils/Button";
import HugeIcon from "../../components/utils/HugeIcon";
import PopupMenu from "../../components/utils/PopupMenu";
import PrimaryModal from "../../components/utils/PrimaryModal";
import useApi from "../../lib/useApi";
import userSelector from "../../state/user";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Posts from "./components/Posts";
import Skills from "./components/Skills";
import Spaces from "./components/Spaces";

const AvatarForm = ({ onSave, onCancel }) => {
	const { register, handleSubmit, watch } = useForm();
	const api = useApi(true);
	const imgRef = useRef(null);

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append("file", data.file[0]);
		try {
			const { avatar } = await api.post("/user/avatar/edit", formData, "multipart/form-data");
			onSave(avatar);
		} catch (error) {
			console.error(error);
		}
	};

	const file = watch("file");
	useEffect(() => {
		if (file && file[0]) {
			const reader = new FileReader();
			reader.onload = () => {
				imgRef.current.src = reader.result;
			};
			reader.readAsDataURL(file[0]);
		}
	}, [file]);

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<input
				id="avatar-input"
				type="file"
				className="absolute h-[1px] w-[1px] opacity-0"
				{...register("file")}
			/>
			<div
				className="relative flex items-center justify-center h-64 w-64 border-dashed border-2 rounded-xl overflow-hidden mx-auto border-primary-default"
				onClick={() => document.getElementById("avatar-input").click()}
			>
				<img ref={imgRef} className="absolute w-full h-full" />
				<p className="text-center">Select or drop files here!</p>
			</div>
			<div className="flex justify-end gap-4 mt-3">
				<Button theme={"secondary"} label="Cancel" size="sm" onClick={onCancel} />
				<Button type="submit" theme={"primary"} label="Add" size="sm" />
			</div>
		</form>
	);
};

const ProfileHeroLeft = ({}) => {
	const [counter, setCounter] = useState(0);
	const [user, setUser] = useRecoilState(userSelector);
	const modalRef = useRef(null);
	const [openToJob, setOpenToJob] = useState(false);

	const api = useApi(true);

	useEffect(() => {
		api
			.post("/user/info", { keys: "openToJobs" })
			.then(({ openToJobs }) => setOpenToJob((_) => openToJobs))
			.catch(console.error);
	}, []);

	useEffect(() => {
		setCounter((r) => r + 1);
	}, [user]);

	return (
		<div
			className="relative p-4 border rounded-lg border-[#e8efff] bg-white"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			<img
				className="w-full h-32 object-cover rounded-xl"
				src={AvatarBackground}
				alt="avatar_background"
			/>
			<div className="flex items-center pl-44">
				<div className="absolute left-14 w-32 h-32 p-1 rounded-full overflow-hidden bg-white">
					<img
						className="w-full h-full object-cover rounded-full"
						src={
							(user.avatar ||
								"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name) +
							"?" +
							counter
						}
						alt="user"
					/>
					<div
						className="absolute bottom-0 flex items-center justify-center w-full py-2 bg-black/50"
						onClick={() => modalRef.current.open()}
					>
						<CameraFill size={"1.2rem"} className="text-neutral-0" />
					</div>
				</div>
				<div className="relative top-2 left-2 user-info">
					<p className="text-letters-secondary text-2xl font-semibold">{user.name}</p>
					<p className="text-letters-tertiary text-sm font-normal">{user.field}</p>
				</div>
			</div>
			<div className="flex justify-between mt-14 mb-2">
				<div className="grow">
					<h4 className="font-medium text-letters-secondary">
						Make my profile visible to employers
					</h4>
					<p className="text-xs text-letters-tertiary">
						Your profile and career goals will appear when employers search our database for
						candidates.
					</p>
				</div>
				<div className="shrink-0">
					<motion.button
						animate={{
							backgroundColor: openToJob ? "rgb(168,85,247)" : "rgb(156,163,175)",
						}}
						className={`flex items-center ${
							openToJob ? "justify-end bg-purple-500" : "justify-start bg-gray-400"
						} w-10 h-6 p-1 rounded-3xl shadow-inner`}
						onTap={() => {
							setOpenToJob((_) => !_);
							api
								.post("/user/update", { keys: "openToJobs", openToJobs: !openToJob })
								.then(({ openToJobs }) => {
									if (openToJob != openToJobs) setOpenToJob((_) => openToJobs);
								})
								.catch((err) => {
									setOpenToJob((_) => !_);
									console.error(err);
								});
						}}
						layout
					>
						<motion.div
							transition={{ duration: 0.25 }}
							className="h-full aspect-square rounded-full bg-white shadow"
							layout
						></motion.div>
					</motion.button>
				</div>
			</div>

			<PrimaryModal title="Change avatar" ref={modalRef}>
				{(closeModal) => (
					<AvatarForm
						onSave={(data) => {
							setUser((curr) => ({ ...curr, avatar: data }));
							setCounter((r) => r + 1);
							closeModal();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
		</div>
	);
};

const ProfileHeroRight = ({ updatePointsRef }) => {
	const [points, setPoints] = useState(0);
	const api = useApi(true);

	const updatePoints = () => {
		api
			.post("/user/points")
			.then(({ points }) => {
				setPoints(parseInt(points || 0) / 2000);
			})
			.catch(console.error);
	};
	if (updatePointsRef) updatePointsRef.current = updatePoints;

	useEffect(() => {
		updatePoints();
	}, []);

	return (
		<div
			className="relative shrink-0 flex flex-row-reverse lg:flex-col items-center gap-6 h-full p-4 border rounded-lg border-[#e8efff] bg-white"
			style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
		>
			<div className="grow relative flex justify-center items-center max-w-[13rem] aspect-square rounded-xl">
				<svg className="w-full aspect-square overflow-visible">
					<circle
						className="text-white drop-shadow-lg"
						cx="50%"
						cy="50%"
						r="calc(50% - 1.3rem)"
						strokeWidth="1rem"
						stroke="currentColor"
						fill="transparent"
					/>
					<motion.circle
						className="text-purple-500"
						cx="50%"
						cy="50%"
						r="calc(50% - 1.3rem)"
						strokeWidth="1.5rem"
						stroke="currentColor"
						fill="transparent"
						strokeLinecap={"round"}
						animate={{
							pathLength: points,
							rotate: `${45 - 180 * points}deg`,
						}}
						style={{
							originX: "50%",
							originY: "50%",
						}}
					/>
				</svg>
				<div className="absolute">
					<p className="text-2xl text-center font-medium text-letters-secondary">{points * 2000}</p>
					<p className="text-xs text-center text-letters-tertiary">Points Earned</p>
				</div>
				<div
					className="absolute"
					style={{
						translate: "0 -5rem",
					}}
				></div>
			</div>
			<div className="w-50%">
				<p className="text-xs md:text-sm text-letters-tertiary text-center">
					Add your education details and skills to increase your profile strength.
				</p>
			</div>
		</div>
	);
};

const PortfolioForm = ({ onSave, onCancel }) => {
	const { register, control, handleSubmit } = useForm();

	const api = useApi(true);

	const onSubmit = async (data) => {
		try {
			onSave(await api.post("/user/links/add", { ...data }));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-x-4 gap-y-3 grid-cols-1 lg:grid-cols-12">
				<div className="col-span-1 lg:col-span-5">
					<label className="block mb-1 text-sm font-medium">Institute Name</label>
					<Controller
						name="name"
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<CreatableSelect
								formatCreateLabel={(_) => `${_}`}
								createOptionPosition="first"
								placeholder="Choose or create link"
								options={["Behance", "Dribble", "GitHub", "LinkedIn", "Medium"].map((val) => ({
									label: val,
									value: val,
								}))}
								defaultValue={value}
								onChange={({ value }) => onChange(value)}
								onBlur={onBlur}
							/>
						)}
					/>
				</div>
				<div className="col-span-1 lg:col-span-5">
					<label className="block mb-1 text-sm font-medium">Institute Name</label>
					<input
						type="text"
						placeholder="Enter link"
						{...register("link")}
						className="w-full px-3 py-[6px] border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
					/>
				</div>
			</div>
			<div className="flex justify-end gap-4 mt-8">
				<Button theme={"secondary"} label="Cancel" size="sm" onClick={onCancel} />
				<Button type="submit" theme={"primary"} label="Add" size="sm" />
			</div>
		</form>
	);
};

const PortfolioLink = ({
	icon: Icon,
	label = "Other",
	link = "",
	color = "#000000",
	onRequestDelete,
}) => {
	return (
		<div className="relative shrink-0 grid grid-cols-2 w-80 h-24 border rounded-lg bg-background-0 shadow">
			<div className="col-span-1 flex items-center justify-between">
				<div
					className="ml-8 px-4 py-3 rounded-xl"
					style={{ boxShadow: "0px 5.30157px 7.95235px rgba(163, 174, 208, 0.25)" }}
				>
					<Icon size={"2.5rem"} color={color} />
				</div>
				<div
					className="w-2 h-14 rounded-tl-lg rounded-bl-lg"
					style={{
						background: "linear-gradient(90deg, #1BE7FF 0%, #C2F4FF 100%)",
					}}
				></div>
			</div>
			<div className="col-span-1 flex items-center p-4 border-l">
				<div className="max-w-full">
					<p className="text-sm text-primary-default font-medium">{label}</p>
					<a
						href={link}
						target="_blank"
						className="block text-xs text-blue-500 max-w-full overflow-hidden overflow-ellipsis"
					>
						{link}
					</a>
				</div>
			</div>
			<PopupMenu
				triggerContent={
					<div className="absolute right-2 top-2 p-2 cursor-pointer">
						<X size="1.2rem" className="text-danger-faded" />
					</div>
				}
				position="left center"
				offsetX={16}
			>
				{(closeMenu) => (
					<motion.div
						className="border rounded-xl bg-background-0 overflow-hidden shadow-2xl"
						style={{ originX: "100%", originY: "50%" }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
					>
						<div className="p-4 border-b">Delete this link?</div>
						<div className="grid grid-cols-2">
							<div
								className="col-span-1 px-4 py-2 border-r font-medium text-white bg-danger-default"
								onClick={() => {
									closeMenu();
									onRequestDelete();
								}}
							>
								Delete
							</div>
							<div className="col-span-1 px-4 py-2" onClick={() => closeMenu()}>
								Cancel
							</div>
						</div>
					</motion.div>
				)}
			</PopupMenu>
		</div>
	);
};

const supportedPortfolios = {
	behance: { icon: Behance, color: "#0056FF" },
	dribble: { icon: Dribbble, color: "#EC296A" },
	github: { icon: Github, color: "#333" },
	linkedin: { icon: Linkedin, color: "#0077B5" },
	medium: { icon: Medium, color: "#000" },
};

const Portfolio = () => {
	const [links, setLinks] = useState([]);
	const modalRef = useRef();

	const api = useApi(true);
	const deleteLink = (id) => {
		api
			.post("/user/links/delete", { id })
			.then((data) => setLinks((_) => data))
			.catch(console.error);
	};

	useState(() => {
		api
			.post("/user/links")
			.then((data) => setLinks((_) => data))
			.catch(console.error);
	}, []);

	return (
		<div className="flex flex-nowrap gap-3">
			{links.map(({ _id, name, link }) => {
				let props = supportedPortfolios[name.toLowerCase()];
				if (!props) props = { icon: GlobeAmericas };
				return (
					<PortfolioLink
						key={_id}
						{...props}
						label={name}
						link={link}
						onRequestDelete={() => deleteLink(_id)}
					/>
				);
			})}
			<div
				className="shrink-0 flex items-center gap-4 p-8 border rounded-lg bg-white shadow cursor-pointer"
				onClick={() => modalRef.current.open()}
			>
				<PlusCircleFill size={"2rem"} className="text-primary-default" />
				<p>Add new portfolio link</p>
			</div>
			<PrimaryModal title="Add portfolio link" ref={modalRef}>
				{(closeModal) => (
					<PortfolioForm
						onSave={(data) => {
							setLinks((_) => data);
							closeModal();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
		</div>
	);
};

const AboutEditor = ({ defaultValue, onSave, onCancel }) => {
	const { register, handleSubmit, setFocus } = useForm();
	const api = useApi(true);
	const inputRef = useRef(null);

	const onSubmit = async (data) => {
		try {
			const { about } = await api.post("/user/about/edit", data);
			onSave(about);
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<textarea
				ref={inputRef}
				className="resize-none h-24 w-full px-3 py-[6px] border rounded-md border-gray-600/30 focus:border-blue-600 focus:outline-none"
				defaultValue={defaultValue}
				autoFocus
				{...register("about")}
			></textarea>
			<div className="flex justify-end gap-4 mt-3">
				<Button theme={"secondary"} label="Cancel" size="sm" onClick={onCancel} />
				<Button type="submit" theme={"primary"} label="Add" size="sm" />
			</div>
		</form>
	);
};

const About = () => {
	const [about, setAbout] = useState(null);
	const [editing, setEditing] = useState(false);

	const api = useApi(true);
	useEffect(() => {
		api
			.post("/user/about")
			.then(({ about }) => setAbout((_) => about))
			.catch(console.error);
	}, []);

	return (
		<>
			<div className="flex justify-between items-center gap-5 mb-3">
				<div className="grow">
					{editing ? (
						<AboutEditor
							defaultValue={about}
							onSave={(data) => {
								setEditing(false);
								setAbout((_) => data);
							}}
							onCancel={() => setEditing(false)}
						/>
					) : (
						<p className="w-full max-w-full text-sm text-letters-tertiary text-justify">
							{about ? about : "Loading..."}
						</p>
					)}
				</div>
				<div className="shrink-0">
					<FontAwesomeIcon
						icon={faPen}
						className="text-letters-secondary text-sm"
						onClick={() => setEditing((o) => !o)}
					/>
				</div>
			</div>
		</>
	);
};

const CertificateForm = ({ onSave, onCancel }) => {
	const { register, handleSubmit, watch, reset } = useForm();
	const api = useApi(true);
	const imgRef = useRef(null);

	const onSubmit = async (data) => {
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("about", data.about);
		formData.append("file", data.file[0]);
		try {
			const data = await api.post("/user/certificates/add", formData, "multipart/form-data");
			onSave(data);
			reset();
			imgRef.current.src = "";
		} catch (error) {
			console.error(error);
		}
	};

	const file = watch("file");
	useEffect(() => {
		if (file && file[0]) {
			const reader = new FileReader();
			reader.onload = () => {
				imgRef.current.src = reader.result;
			};
			reader.readAsDataURL(file[0]);
		}
	}, [file]);

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="col-span-1 lg:col-span-12 flex">
			<input
				type="file"
				required
				{...register("file")}
				className="absolute h-[1px] w-[1px] opacity-0"
				id="certificate-input"
			/>
			<div
				className="relative shrink-0 flex flex-col px-6 py-8 min-h-[18rem] border-dashed border-2 rounded-[1.3125rem] overflow-hidden border-primary-washedout/25 items-center justify-center cursor-pointer"
				onClick={() => document.getElementById("certificate-input").click()}
			>
				<img ref={imgRef} className="absolute w-full h-full border-none" />
				<CloudUpload className="text-primary-default" size={"2.5rem"} />
				<p className="text-lg mt-3">Upload Files</p>
				<p className="text-xs text-primary-washedout/75 mt-2">PNG, JPG and GIF files are allowed</p>
			</div>
			<div className="grow flex flex-col px-6">
				<label className="block text-sm font-medium">Name of Certificate</label>
				<input
					type="text"
					className="w-full p-2 border-1 rounded-lg border-primary-washedout/25 text-xs"
					required
					{...register("name")}
				/>
				<label className="block mt-4 text-sm font-medium">About Certificate</label>
				<textarea
					className="grow resize-none w-full p-2 border-1 rounded-lg border-primary-washedout/25 text-xs"
					placeholder="Write Something About Certificate"
					required
					{...register("about")}
				/>
				<p className="text-xs text-primary-washedout/75">Not more than 100 words</p>
				<div className="shrink-0 mt-4">
					<button
						type="submit"
						className="px-5 py-2 rounded-lg mr-4 bg-gradient-primary font-medium text-white"
					>
						Upload
					</button>
					<button
						onClick={onCancel}
						type="submit"
						className="px-5 py-2 borde-2 rounded-lg bg-transparent border-primary-default font-medium text-white"
					>
						Cancel
					</button>
				</div>
			</div>
		</form>
	);
};

const CertificateItem = ({ name, about, image, onRequestDelete }) => {
	return (
		<div className="relative flex gap-4 pb-3 border-b last:pb-0 last:border-b-0">
			<div className="shrink-0 h-20 aspect-video bg-gray-100 rounded-lg overflow-hidden">
				<img className="w-full h-full object-cover" src={image} alt="cert" />
			</div>
			<div className="grow">
				<p className="text-lg font-medium">{name}</p>
				<p className="text-sm text-primary-washedout/75 mt-2">{about}</p>
			</div>
			<PopupMenu
				triggerContent={
					<div className="shrink-0 flex items-center px-2.5 cursor-pointer">
						<FontAwesomeIcon icon={faTrashCan} size="1.3rem" className="text-danger-faded" />
					</div>
				}
				position="left center"
				offsetX={16}
			>
				{(closeMenu) => (
					<motion.div
						className="border rounded-xl bg-background-0 overflow-hidden shadow-2xl"
						style={{ originX: "100%", originY: "50%" }}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
					>
						<div className="p-4 border-b">Delete this certificate?</div>
						<div className="grid grid-cols-2">
							<div
								className="col-span-1 px-4 py-2 border-r font-medium text-white bg-danger-default"
								onClick={() => {
									closeMenu();
									onRequestDelete();
								}}
							>
								Delete
							</div>
							<div className="col-span-1 px-4 py-2" onClick={() => closeMenu()}>
								Cancel
							</div>
						</div>
					</motion.div>
				)}
			</PopupMenu>
		</div>
	);
};

const Certificates = ({ onPointsChange }) => {
	const [certificates, setCertificates] = useState([]);

	const formRef = useRef();

	const api = useApi(true);

	const deleteCertificate = (id) => {
		api
			.post("/user/certificates/delete", { id })
			.then((data) => setCertificates((_) => data))
			.catch(console.error);
	};

	useEffect(() => {
		api
			.post("/user/certificates")
			.then((data) => setCertificates((_) => data))
			.catch(console.error);
	}, []);

	return (
		<div className="flex flex-col h-full bg-neutral-0">
			<div className="flex justify-between mb-4">
				<div className="">
					<p className="font-medium text-letters-secondary">Certificates</p>
					<p className="text-sm text-letters-tertiary">Add your certificates.</p>
				</div>
				<button type="button" className="text-letters-secondary text-sm">
					<button type="button" className="text-letters-secondary text-2xl">
						<FontAwesomeIcon icon={faPlusCircle} className="text-brand-primary" />
					</button>
				</button>
			</div>
			<div className="flex flex-col gap-2">
				{certificates.map(({ _id, name, about, file }, i) => (
					<CertificateItem
						name={name}
						about={about}
						image={file}
						key={_id + i}
						onRequestDelete={() => deleteCertificate(_id)}
					/>
				))}
			</div>
			<PrimaryModal title="Add internship details" ref={formRef}>
				{(closeModal) => (
					<CertificateForm
						onSave={(data) => {
							setCertificates((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={() => closeModal()}
					/>
				)}
			</PrimaryModal>
		</div>
	);
};

export function ProfileAbout() {
	const { updatePointsRef } = useOutletContext();

	return (
		<div className="flex flex-col gap-5 p-4">
			<div>
				<About />
			</div>
			<hr />
			<div className="">
				<Experience onPointsChange={updatePointsRef} />
			</div>
			<hr />
			<div className="">
				<Education onPointsChange={updatePointsRef} />
			</div>
			<hr />

			<div className="">
				<Certificates onPointsChange={updatePointsRef} />
			</div>
		</div>
	);
}

export function ProfilePosts() {
	return <Posts />;
}

export function ProfileSpaces() {
	return <Spaces />;
}

export function ProfileSkills() {
	const { updatePointsRef } = useOutletContext();
	return (
		<div className="flex flex-col gap-6">
			<div>
				<Skills onPointsChange={updatePointsRef} />
			</div>
		</div>
	);
}

const WheelOfOpp = ({ points }) => {
	return (
		<div className="grow relative flex justify-center items-center max-w-[13rem] aspect-square rounded-xl">
			<svg className="w-full aspect-square overflow-visible -rotate-90">
				<defs>
					<mask id="stroke-dash">
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 1}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 2}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 3}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 4}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 5}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 6}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 7}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 8}deg`,
							}}
						/>
						<motion.circle
							className="text-white"
							cx="50%"
							cy="50%"
							r="calc(50% - 1.3rem)"
							strokeWidth="1.3rem"
							stroke="currentColor"
							fill="transparent"
							animate={{
								pathLength: 34 / 360,
								rotate: `${36 * 9}deg`,
							}}
						/>
					</mask>
				</defs>
				<motion.circle
					className="text-brand-primary/20"
					cx="50%"
					cy="50%"
					r="calc(50% - 1.3rem)"
					strokeWidth="1.3rem"
					stroke="currentColor"
					fill="transparent"
					animate={
						{
							// pathLength: 34 / 360,
							// rotate: `${36 * 9}deg`,
						}
					}
					mask="url(#stroke-dash)"
				/>
				<motion.circle
					className="text-brand-primary"
					cx="50%"
					cy="50%"
					r="calc(50% - 1.3rem)"
					strokeWidth="1.3rem"
					stroke="currentColor"
					fill="transparent"
					// strokeLinecap={"square"}
					animate={{
						pathLength: points,
						// rotate: `-90deg`,
						// rotate: `${45 - 180 * points}deg`,
					}}
					style={{
						originX: "50%",
						originY: "50%",
					}}
					mask="url(#stroke-dash)"
				/>
			</svg>
			<div className="absolute">
				<p className="text-2xl text-center font-medium text-letters-secondary">{points * 10000}</p>
				<p className="text-xs text-center text-letters-tertiary">Points Earned</p>
			</div>
			<div
				className="absolute"
				style={{
					translate: "0 -5rem",
				}}
			></div>
		</div>
	);
};

const ProfileLeft = ({ updatePointsRef }) => {
	const user = useRecoilValue(userSelector);
	const [followers, setFollowers] = useState([]);
	const [following, setFollowing] = useState([]);
	const [openToJob, setOpenToJob] = useState(false);
	const [points, setPoints] = useState(0);

	const updatePoints = () => {
		api
			.post("/user/points")
			.then(({ points }) => {
				setPoints(parseInt(points || 0) / 10000);
			})
			.catch(console.error);
	};
	if (updatePointsRef) updatePointsRef.current = updatePoints;

	const api = useApi(true);

	useEffect(() => {
		api.post("/user/following").then(setFollowing);
		api.post("/user/followers").then(setFollowers);
		api
			.post("/user/info", { keys: "openToJobs" })
			.then(({ openToJobs }) => setOpenToJob((_) => openToJobs))
			.catch(console.error);
		updatePoints();
	}, []);

	return (
		<div className="flex flex-col items-center w-80 px-4 bg-white">
			<div className="relative h-[6rem]">
				<div className="absolute -translate-x-1/2 bottom-0 w-44 h-44 p-1 rounded-full bg-white">
					<img
						className="w-full h-full object-cover rounded-full"
						src={
							user.avatar ||
							"https://ui-avatars.com/api/?background=random&size=128&name=" + user.name
						}
						alt="user"
					/>
				</div>
			</div>
			<div className="text-center mt-1">
				<p className="text-xl font-semibold text-[#2B276C]">{user.name}</p>
				<p className="text-letters-tertiary/60 text-sm font-normal">{user.field}</p>
			</div>
			<div className="flex items-center justify-center gap-1.5 text-[#2B276C]">
				<HugeIcon icon="user-group" solid={true} size="1.2rem" />
				<p className="text-xs">{followers.length} Followers</p>
				<p className="text-xs">{following.length} Following</p>
			</div>
			<div className="w-full mt-5">
				<div className="flex gap-2 justify-between">
					<div className="grow">
						<h4 className="font-medium text-[#2B276C] text-sm">
							Make my profile visible to employers
						</h4>
					</div>
					<div className="shrink-0">
						<motion.button
							animate={{
								backgroundColor: openToJob ? "rgb(123,116,255)" : "rgb(156,163,175)",
							}}
							className={`flex items-center ${
								openToJob ? "justify-end bg-brand-primary" : "justify-start bg-gray-400"
							} w-10 h-5 p-0.5 rounded-3xl shadow-inner`}
							onTap={() => {
								setOpenToJob((_) => !_);
								api
									.post("/user/update", { keys: "openToJobs", openToJobs: !openToJob })
									.then(({ openToJobs }) => {
										if (openToJob != openToJobs) setOpenToJob((_) => openToJobs);
									})
									.catch((err) => {
										setOpenToJob((_) => !_);
										console.error(err);
									});
							}}
							layout
						>
							<motion.div
								transition={{ duration: 0.25 }}
								className="h-full aspect-square rounded-full bg-white shadow"
								layout
							></motion.div>
						</motion.button>
					</div>
				</div>
				<p className="mt-1 text-2xs text-letters-tertiary/60">
					Your profile and career goals will appear when employers search our database for
					candidates.
				</p>
			</div>
			<div className="w-full flex flex-col items-center p-4 border rounded-xl mt-6 border-brand-primary/50 bg-brand-primary/5">
				<h3 className="text-sm font-medium text-center">
					Wheel of Opportunities{" "}
					<span className="relative inline">
						<HugeIcon icon="unknown" size="0.875rem" className={"text-brand-primary"} />
					</span>
				</h3>
				<WheelOfOpp points={points} />
			</div>
			<div className="w-full mt-6">
				<h3 className="text-sm font-medium">Your Ranking</h3>
				<div className="mt-4 flex items-center w-full h-6 rounded-2xl border border-brand-primary/50 bg-brand-primary/5 p-1">
					<div
						className="h-4 rounded-2xl"
						style={{
							width: "73%",
							background: "linear-gradient(90deg, #6B63FF -10.52%, #B233DE 129.45%)",
						}}
					></div>
				</div>
				<p className="mt-2 text-2xs text-letters-tertiary text-center">
					Hurray! You're in the top{"  "}
					<span className="text-base font-semibold text-[#8750F2]">27%</span>
				</p>
			</div>
		</div>
	);
};

export default function Profile() {
	const user = useRecoilValue(userSelector);
	const updatePointsRef = useRef(null);

	return (
		<main className="relative grow">
			<img className="w-full h-48 object-cover" src={AvatarBackground} alt="avatar_background" />
			{/* <div className="flex flex-col lg:flex-row items-stretch gap-5">
				<div className="relative grow">
					<ProfileHeroLeft user={user} />
				</div>
				<div className="shrink-0 lg:max-w-[17rem]">
					<ProfileHeroRight updatePointsRef={updatePointsRef} />
				</div>
			</div> */}
			<div className="flex items-stretch">
				<ProfileLeft />
				<div
					className="grow m-4 p-3 border rounded-lg border-[#e8efff] bg-white"
					style={{ boxShadow: "2px 2px 8px rgba(131, 139, 180, 0.25)" }}
				>
					<div className="grid grid-cols-4 border-b-2">
						<NavLink
							className={({ isActive }) =>
								`relative top-[1px] px-5 py-2 text-center font-medium ${
									isActive
										? "border-b-2 border-purple-500 text-letters-secondary"
										: "text-letters-tertiary"
								}`
							}
							end
							to={""}
						>
							About
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								`relative top-[1px] px-5 py-2 text-center font-medium ${
									isActive
										? "border-b-2 border-purple-500 text-letters-secondary"
										: "text-letters-tertiary"
								}`
							}
							to={"skills"}
						>
							Skills
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								`relative top-[1px] px-5 py-2 text-center font-medium ${
									isActive
										? "border-b-2 border-purple-500 text-letters-secondary"
										: "text-letters-tertiary"
								}`
							}
							to={"posts"}
						>
							Posts
						</NavLink>
						<NavLink
							className={({ isActive }) =>
								`relative top-[1px] px-5 py-2 text-center font-medium ${
									isActive
										? "border-b-2 border-purple-500 text-letters-secondary"
										: "text-letters-tertiary"
								}`
							}
							to={"spaces"}
						>
							Spaces
						</NavLink>
					</div>
					<div className="">
						<Outlet context={{ updatePointsRef }} />
					</div>
				</div>
			</div>
		</main>
	);
}
