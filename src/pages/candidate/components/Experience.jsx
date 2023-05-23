import { format } from "date-fns";

const ExperienceItem = ({ company, type, designation, description, start, end, current }) => {
	return (
		<div className="relative flex">
			{/* <div className="shrink-0 mr-3">
				<div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-400 text-neutral-0">
					<Briefcase size={"1.6rem"} />
				</div>
			</div> */}
			<div>
				<div className="flex items-center text-sm">
					<p>{designation}</p>
					<span className="px-2 py-0.5 ml-2 rounded-xl text-xs text-neutral-1000 bg-brand-primary/30">
						{type ? type : "Internship"}
					</span>
				</div>
				<p className="text-xs text-letters-tertiary">
					<span className="">{company}</span>
				</p>
				<p className="text-xs font-light text-neutral-1000 mt-1">
					{format(new Date(start), "MMM, yyyy")} -{" "}
					{current ? "Present" : format(new Date(end), "MMM, yyyy")}
				</p>
				<p className="text-xs text-letters-tertiary mt-1">{description}</p>
			</div>
		</div>
	);
};

const Experience = ({ experience }) => {
	return (
		<div className="flex flex-col grow bg-neutral-0 mt-2">
			<div className="mb-2">
				<p className="font-medium text-letters-secondary">Experience</p>
			</div>
			<div className="flex flex-col">
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
					<div className="grow flex items-center">
						<h3 className="text-xs text-letters-tertiary">No experience information</h3>
					</div>
				)}
			</div>
		</div>
	);
};

export default Experience;
