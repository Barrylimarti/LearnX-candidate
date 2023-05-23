import { useEffect, useRef, useState } from "react";

import { format } from "date-fns";
import { motion } from "framer-motion";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import AsyncSelect from "react-select/async";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import CheckBox from "../../../components/CheckBox";
import Button from "../../../components/utils/Button";
import PopupMenu from "../../../components/utils/PopupMenu";
import PrimaryModal from "../../../components/utils/PrimaryModal";
import useApi from "../../../lib/useApi";

const JobForm = ({ type, onComplete, onCancel }) => {
	const {
		register,
		control,
		handleSubmit,
		formState: { isSubmitting },
	} = useForm();
	const [current, setCurrent] = useState(false);

	const api = useApi(true);

	const getDesignations = async (key) => {
		return await api.post("/data/designations", { key: key }).then((results) => {
			return results.map(({ name }) => ({ label: name, value: name }));
		});
	};

	const onSubmit = async (data) => {
		if (current) {
			data.current = current;
			data.end = null;
		}
		try {
			onComplete(await api.post("/user/experience/add", { type, fields: data }));
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-x-4 gap-y-3 grid-cols-1 lg:grid-cols-2">
				<div className="col-span-1 lg:col-span-2">
					<label className="block mb-1 text-sm font-medium">Designation</label>
					<Controller
						name="designation"
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<AsyncSelect
								placeholder="Select designation"
								loadOptions={getDesignations}
								defaultOptions
								cacheOptions
								onChange={({ value }) => onChange(value)}
							/>
						)}
					/>
				</div>
				<div className={`col-span-1 ${type == "internship" ? "lg:col-span-2" : ""}`}>
					<label className="block mb-1 text-sm font-medium">Company / Organization</label>
					<input
						type="text"
						placeholder="Enter company / organization"
						{...register("company")}
						className="w-full px-3 py-[6px] border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
					/>
				</div>
				{type == "job" ? (
					<div className="col-span-1">
						<label className="block mb-1 text-sm font-medium">Job Type</label>
						<Controller
							name="type"
							control={control}
							render={({ field: { value, onChange, onBlur } }) => (
								<ReactSelect
									options={["Full-time", "Part-time"].map((val) => ({
										label: val,
										value: val,
									}))}
									placeholder="Full-time / Part-time"
									defaultValue={value}
									onChange={({ value }) => onChange(value)}
									onBlur={onBlur}
								/>
							)}
						/>
					</div>
				) : null}
				<div className="col-span-1 lg:col-span-2">
					<label className="block mb-1 text-sm font-medium">Job Profile</label>
					<textarea
						className="resize-none h-24 w-full px-3 py-[6px] border rounded-md border-gray-600/30 focus:border-blue-600 focus:outline-none"
						placeholder="Describe your role in short"
						{...register("description")}
					></textarea>
				</div>
				<div className="col-span-1">
					<label className="block mb-1 text-sm font-medium">Joining</label>
					<Controller
						name="start"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactDatePicker
									placeholderText="Select joining date"
									showPopperArrow={false}
									showMonthYearPicker
									dateFormat="MMM, yyyy"
									selected={value}
									onChange={(date) => {
										onChange(date);
									}}
									className="w-full px-3 py-1 border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
								/>
							);
						}}
					/>
				</div>
				<div className="col-span-1">
					<label className="block mb-1 text-sm font-medium">End</label>
					<Controller
						name="end"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactDatePicker
									disabled={current}
									placeholderText="Select end date"
									showPopperArrow={false}
									showMonthYearPicker
									dateFormat="MMM, yyyy"
									selected={value}
									onChange={(date) => {
										onChange(date);
									}}
									className="w-full px-3 py-1 border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
								/>
							);
						}}
					/>
					<div className="mt-1">
						<CheckBox
							label="Currently working here"
							onChange={(checked) => setCurrent((_) => checked)}
						/>
					</div>
				</div>
			</div>
			<div className="flex justify-end gap-4 mt-8">
				<Button theme={"secondary"} label="Cancel" onClick={onCancel} />
				<Button theme={"primary"} type="submit" label="Add" isLoading={isSubmitting} />
			</div>
		</form>
	);
};

const ExperienceItem = ({
	company,
	type,
	designation,
	description,
	start,
	end,
	current,
	onRequestDelete,
}) => {
	return (
		<div className="relative flex gap-5 pb-3 border-b last:pb-0 last:border-b-0">
			<div className="grow xborder-r">
				<p className="font-medium text-sm text-letters-primary">
					{designation}
					<span className="rounded-xl px-2 py-1 ml-3 bg-info-washedout/50 text-xs text-letters-secondary">
						{type ? type : "Internship"}
					</span>
				</p>
				<p className="text-xs mt-1 text-letters-secondary">
					at <span className="font-medium">{company}</span>
				</p>
				<p className="text-xs font-light text-letters-primary mt-1">
					{format(new Date(start), "MMM, yyyy")} -{" "}
					{current ? "Present" : format(new Date(end), "MMM, yyyy")}
				</p>
				<p className="text-xs text-letters-tertiary mt-3">{description}</p>
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
						<div className="p-4 border-b">Delete this skill?</div>
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

const Experience = ({ onPointsChange }) => {
	const [experience, setExperience] = useState(null);

	const modalRefs = {
		JobModal: useRef(null),
		InternModal: useRef(null),
	};

	const api = useApi(true);
	const deleteXp = (type, id) => {
		api
			.post("/user/experience/delete", { type, id })
			.then((data) => {
				setExperience((_) => data);
				onPointsChange.current();
			})
			.catch(console.error);
	};
	useEffect(() => {
		api.post("/user/experience").then(setExperience).catch(console.error);
	}, []);

	return (
		<div className="flex flex-col grow overflow-hidden">
			<div className="flex justify-between items-center mb-4">
				<div className="">
					<p className="font-medium text-letters-secondary">Experience</p>
					<p className="text-sm text-letters-tertiary">Add your work experiences</p>
				</div>
				<PopupMenu
					triggerContent={
						<button type="button" className="text-letters-secondary text-2xl">
							<FontAwesomeIcon icon={faPlusCircle} className="text-brand-primary" />
						</button>
					}
					offsetY={32}
				>
					{(closeMenu) => {
						return (
							<div className="flex flex-col rounded-xl bg-background-0 shadow-xl">
								<div
									className="px-3 py-2"
									onClick={() => {
										modalRefs.JobModal.current.open();
										closeMenu();
									}}
								>
									Add job
								</div>
								<hr />
								<div
									className="px-3 py-2"
									onClick={() => {
										modalRefs.InternModal.current.open();
										closeMenu();
									}}
								>
									Add internship
								</div>
							</div>
						);
					}}
				</PopupMenu>
			</div>
			<div className="flex flex-col gap-3">
				{experience && (experience?.jobs.length || experience?.internships.length) ? (
					<>
						{experience.jobs.length
							? experience.jobs.map((val) => (
									<ExperienceItem
										key={val._id}
										{...val}
										onRequestDelete={() => deleteXp("job", val._id)}
									/>
							  ))
							: null}
						{experience.internships.length
							? experience.internships.map((val) => (
									<ExperienceItem
										key={val._id}
										{...val}
										onRequestDelete={() => deleteXp("internship", val._id)}
									/>
							  ))
							: null}
					</>
				) : (
					<div className="grow flex items-center justify-center p-8">
						<h3 className="text-base font-medium text-primary-default/75">
							Add items to show here!
						</h3>
					</div>
				)}
			</div>
			<PrimaryModal title="Add job details" ref={modalRefs.JobModal}>
				{(closeModal) => (
					<JobForm
						type="job"
						onComplete={(data) => {
							setExperience((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
			<PrimaryModal title="Add internship details" ref={modalRefs.InternModal}>
				{(closeModal) => (
					<JobForm
						type="internship"
						onComplete={(data) => {
							setExperience((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
		</div>
	);
};

export default Experience;
