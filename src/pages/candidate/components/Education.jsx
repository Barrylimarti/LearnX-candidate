import { format as formatDate } from "date-fns";

const EducationItem = ({ institute, start, end, course, specialization, cgpa, percentage }) => {
	return (
		<div className="relative flex py-1">
			{/* <div className="shrink-0 mr-3">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-400 text-neutral-0">
					<Buildings size={"1.6rem"} />
				</div>
			</div> */}
			<div className="flex flex-col">
				<p className="text-sm">
					{course ? course : "XII/12th"}
					{specialization ? " - " + specialization : null}
				</p>
				<p className="text-xs text-letters-tertiary">{institute}</p>
				<p className="text-xs font-light text-neutral-1000 mt-1">
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
		</div>
	);
};

const Education = ({ education }) => {
	return (
		<div className="flex flex-col grow bg-neutral-0 overflow-hidden">
			<div className="mb-2">
				<p className="font-medium text-letters-secondary">Education</p>
			</div>
			{education &&
			!!(education.bachelors.length +
			education.masters.length +
			education.doctorates.length +
			!!education.school?.institute
				? 1
				: 0) ? (
				<div className="flex flex-col">
					{["doctorates", "masters", "bachelors"].map((key) => (
						<>
							{education[key].length ? (
								<div key={"education-" + key}>
									{education[key].map((val) => (
										<EducationItem key={val._id} {...val} />
									))}
								</div>
							) : null}
						</>
					))}
					{education.school?.institute ? <EducationItem {...education.school} /> : null}
				</div>
			) : (
				<div className="grow flex items-center">
					<h3 className="text-xs text-letters-tertiary">No education information</h3>
				</div>
			)}
		</div>
	);
};

export default Education;
