import { useEffect, useRef, useState } from "react";

import { format as formatDate } from "date-fns";
import { motion } from "framer-motion";
import ReactDatePicker from "react-datepicker";
import { Controller, useForm } from "react-hook-form";
import AsyncSelect from "react-select/async-creatable";
import ReactSelect from "react-select/creatable";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "../../../components/Button";
import PopupMenu from "../../../components/utils/PopupMenu";
import PrimaryModal from "../../../components/utils/PrimaryModal";
import useApi from "../../../lib/useApi";

const degrees = {
	ug: ["BA", "BSc", "BCom", "BTEch", "BEd", "BCA", "BBA"],
	pg: ["MA", "MSc", "MCom", "MTech", "MEd", "MCA", "MBA"],
	phd: ["PhD", "DA", "DBA", "DSc"],
};

const DegreeForm = ({ type, onComplete, onCancel }) => {
	const { register, control, handleSubmit } = useForm();

	const api = useApi(true);

	const onSubmit = async (data) => {
		try {
			onComplete(await api.post("/user/education/add", { type, fields: data }));
		} catch (error) {
			console.error(error);
		}
	};

	const dataApi = useApi(false);
	const getOptions = async (key) => {
		try {
			return await dataApi
				.post("/data/colleges", { key })
				.then((data) => data.map(({ name }) => ({ label: name, value: name })));
		} catch (error) {
			return [];
		}
	};

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-x-4 gap-y-3 grid-cols-2 lg:grid-cols-4">
				<div className="col-span-2 lg:col-span-3">
					<label className="block mb-1 text-sm font-medium">Institute Name</label>
					<Controller
						name="institute"
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<AsyncSelect
								formatCreateLabel={(_) => `${_}`}
								allowCreateWhileLoading
								createOptionPosition="first"
								loadOptions={getOptions}
								cacheOptions
								defaultOptions
								placeholder="Choose or create institute"
								defaultValue={value}
								onChange={({ value }) => onChange(value)}
								onBlur={onBlur}
							/>
						)}
					/>
				</div>
				<div className="col-span-2 lg:col-span-1">
					<label className="block mb-1 text-sm font-medium">Institute Name</label>
					<Controller
						name="course"
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<ReactSelect
								formatCreateLabel={(_) => `${_}`}
								createOptionPosition="last"
								options={degrees[type].map((val) => ({ label: val, value: val }))}
								placeholder="Choose or create degree"
								defaultValue={value}
								onChange={({ value }) => onChange(value)}
								onBlur={onBlur}
							/>
						)}
					/>
				</div>
				<div className="col-span-2">
					<label className="block mb-1 text-sm font-medium">Specialization</label>
					<input
						type="text"
						placeholder="e.g. Electrical Engineering"
						{...register("specialization")}
						className="w-full px-3 py-1 border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
					/>
				</div>
				<div className="col-span-2">
					<label className="block mb-1 text-sm font-medium">CGPA</label>
					<input
						type="number"
						step=".01"
						placeholder="Enter CGPA"
						{...register("cgpa", { min: 0, max: 10 })}
						className="w-full px-3 py-1 border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
					/>
				</div>
				<div className="col-span-2">
					<label className="block mb-1 text-sm font-medium">Admission</label>
					<Controller
						name="start"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactDatePicker
									placeholderText="Select admission date"
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
				<div className="col-span-2">
					<label className="block mb-1 text-sm font-medium">Completion</label>
					<Controller
						name="end"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactDatePicker
									placeholderText="Select completion date"
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
			</div>
			<div className="flex justify-end gap-4 mt-8">
				<Button theme={"secondary"} label="Cancel" size="sm" onClick={onCancel} />
				<Button type="submit" theme={"primary"} label="Add" size="sm" />
			</div>
		</form>
	);
};

const XIIForm = ({ onComplete, onCancel }) => {
	const { register, control, handleSubmit } = useForm();

	const api = useApi(true);

	const onSubmit = async (data) => {
		try {
			onComplete(await api.post("/user/education/add", { type: "xii", fields: data }));
		} catch (error) {
			console.error(error);
		}
	};

	const dataApi = useApi(false);
	const getOptions = async (key) => {
		try {
			return await dataApi
				.post("/data/colleges", { key })
				.then((data) => data.map(({ name }) => ({ label: name, value: name })));
		} catch (error) {
			return [];
		}
	};

	return (
		<form action="" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid gap-x-4 gap-y-3 grid-cols-1 lg:grid-cols-2">
				<div className="col-span-1 lg:col-span-2">
					<label className="block mb-1 text-sm font-medium">Institute Name</label>
					<Controller
						name="institute"
						control={control}
						render={({ field: { value, onChange, onBlur } }) => (
							<AsyncSelect
								formatCreateLabel={(_) => `${_}`}
								allowCreateWhileLoading
								createOptionPosition="first"
								loadOptions={getOptions}
								cacheOptions
								defaultOptions
								placeholder="Choose institute"
								defaultValue={value}
								onChange={({ value }) => onChange(value)}
								onBlur={onBlur}
							/>
						)}
					/>
				</div>
				<div className="col-span-1">
					<label className="block mb-1 text-sm font-medium">Passout Year</label>
					<Controller
						name="end"
						control={control}
						render={({ field: { onChange, value } }) => {
							return (
								<ReactDatePicker
									placeholderText="Select passout year"
									showPopperArrow={false}
									showYearPicker
									dateFormat="yyyy"
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
					<label className="block mb-1 text-sm font-medium">Percentage</label>
					<input
						type="number"
						step=".01"
						placeholder="Enter percentage"
						{...register(`percentage`)}
						className="w-full px-3 py-1 border-solid border border-gray-600/30 focus:border-blue-600 outline-none rounded-sm"
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

const EducationItem = ({
	institute,
	start,
	end,
	course,
	specialization,
	cgpa,
	percentage,
	onRequestDelete,
}) => {
	return (
		<div className="relative flex gap-5 pb-3 border-b last:pb-0 last:border-b-0">
			{/* <div className="shrink-0 pr-3">
				<div className="flex items-center justify-center w-14 h-14 rounded-full bg-orange-400 text-neutral-0">
					<Buildings size={"2rem"} />
				</div>
			</div> */}
			<div className="grow flex flex-col">
				<p className="text-sm font-medium text-letters-primary">
					{course ? course : "XII/12th"}
					{specialization ? " - " + specialization : null}
				</p>
				<p className="text-xs text-letters-tertiary">
					at <span className="font-medium text-letters-primary">{institute}</span>
				</p>
				<p className="text-xs text-letters-primary mt-1">
					{start ? formatDate(new Date(start), "MMM, yyyy") + " - " : ""}
					{end
						? start
							? formatDate(new Date(end), "MMM, yyyy")
							: formatDate(new Date(end), "yyyy")
						: ""}
				</p>

				{typeof cgpa != "undefined" ? (
					<p className="text-xs text-letters-tertiary mt-1">CGPA: {cgpa}</p>
				) : null}
				{typeof percentage != "undefined" ? (
					<p className="text-xs text-letters-tertiary mt-1">Score: {percentage}</p>
				) : null}
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

const Education = ({ onPointsChange }) => {
	const [education, setEducation] = useState(null);

	const modalRefs = {
		XIIFormModal: useRef(null),
		UGFormModal: useRef(null),
		PGFormModal: useRef(null),
		PhDFormModal: useRef(null),
	};

	const keys = { school: "xii", bachelors: "ug", masters: "pg", doctorates: "phd" };

	const api = useApi(true);
	const deleteEducation = (type, id) => {
		api
			.post("/user/education/delete", { type, id })
			.then((data) => {
				setEducation((_) => data);
				onPointsChange.current();
			})
			.catch(console.error);
	};

	useEffect(() => {
		api.post("/user/education").then(setEducation).catch(console.error);
	}, []);

	return (
		<div className="flex flex-col grow bg-white overflow-hidden">
			<div className="flex justify-between mb-4">
				<div className="">
					<p className="font-medium text-letters-secondary">Education</p>
					<p className="text-sm text-letters-tertiary">Add your schooling information</p>
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
										modalRefs.PhDFormModal.current.open();
										closeMenu();
									}}
								>
									Add doctorate degree
								</div>
								<hr />
								<div
									className="px-3 py-2"
									onClick={() => {
										modalRefs.PGFormModal.current.open();
										closeMenu();
									}}
								>
									Add masters degree
								</div>
								<hr />
								<div
									className="px-3 py-2"
									onClick={() => {
										closeMenu();
										modalRefs.UGFormModal.current.open();
									}}
								>
									Add bachelors degree
								</div>
								<hr />
								<div
									className="px-3 py-2"
									onClick={() => {
										closeMenu();
										modalRefs.XIIFormModal.current.open();
									}}
								>
									Add XII details
								</div>
							</div>
						);
					}}
				</PopupMenu>
			</div>
			{/* <div className="shrink-0 flex items-center justify-between px-7 py-4 text-xl font-semibold bg-background-200">
				<span>Education</span>
				<div></div>
			</div> */}

			{education &&
			!!(education.bachelors.length +
			education.masters.length +
			education.doctorates.length +
			!!education.school.institute
				? 1
				: 0) ? (
				<div className="flex flex-col gap-2">
					{["doctorates", "masters", "bachelors"].map((key) => (
						<>
							{education[key].length
								? education[key].map((val) => (
										<EducationItem
											key={val._id}
											{...val}
											onRequestDelete={() => deleteEducation(keys[key], val._id)}
										/>
								  ))
								: null}
						</>
					))}
					{education.school.institute ? (
						<EducationItem
							{...education.school}
							onRequestDelete={() => deleteEducation("xii", null)}
						/>
					) : null}
				</div>
			) : (
				<div className="grow flex items-center justify-center p-8">
					<h3 className="text-base font-medium text-primary-default/75">Add items to show here!</h3>
				</div>
			)}
			<PrimaryModal title="Add XII Details" ref={modalRefs.XIIFormModal}>
				{(closeModal) => (
					<XIIForm
						onComplete={(data) => {
							setEducation((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
			<PrimaryModal title="Add Bachelor's Degree" ref={modalRefs.UGFormModal}>
				{(closeModal) => (
					<DegreeForm
						type="ug"
						onComplete={(data) => {
							setEducation((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
			<PrimaryModal title="Add Master's Degree" ref={modalRefs.PGFormModal}>
				{(closeModal) => (
					<DegreeForm
						type="pg"
						onComplete={(data) => {
							setEducation((_) => data);
							closeModal();
							onPointsChange.current();
						}}
						onCancel={closeModal}
					/>
				)}
			</PrimaryModal>
			<PrimaryModal title="Add Doctorate Degree" ref={modalRefs.PhDFormModal}>
				{(closeModal) => (
					<DegreeForm
						type="phd"
						onComplete={(data) => {
							setEducation((_) => data);
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

export default Education;
