import {
  useEffect,
  useState,
} from "react";

import { format } from "date-fns";
import {
  Check,
  InfoCircle,
  X,
} from "react-bootstrap-icons";
import { Outlet } from "react-router-dom";

import useApi from "../../lib/useApi";

const Job = ({ job: { title, category, _id, openings }, date, status, update }) => {
	const api = useApi(true);

	return (
		<div className="flex p-8 rounded-2xl shadow-md border">
			<div className="grow">
				<p className="inline-block py-1 px-2 mb-2 text-xs font-medium rounded-md bg-blue-300/30 text-primary-default">
					{format(new Date(date), "HH:mm • MMM 14, yyyy")}
				</p>
				<h3 className="text-2xl font-semibold text-primary-default">{title}</h3>
				<h4 className="mt-2 text-lg font-medium text-primary-washedout/50">{category}</h4>
				<div className="mt-3">
					<h6 className="text-xs font-bold text-primary-faded">Invitations</h6>
					<div className="flex gap-2 mt-2">
						<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
							Sent: 23
						</span>
						<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
							Accepted: 9
						</span>
					</div>
				</div>
				<div className="mt-3">
					<h6 className="text-xs font-bold text-primary-faded">Status</h6>
					<div className="flex gap-2 mt-2">
						<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
							Vacancies: {openings}
						</span>
						<span className="inline-block text-sm px-2 py-1 rounded-sm bg-info-washedout/50">
							Hired: 2
						</span>
					</div>
				</div>
			</div>
			<div className="shrink-0 flex flex-col justify-between">
				<div className="flex justify-center items-center px-4 py-3 rounded-xl bg-info-faded text-blue-900 capitalize">
					<InfoCircle className="inline-block mr-2 " size={"0.9rem"} />
					{status}
				</div>
				<div className="flex flex-col gap-3">
					<button
						className="flex justify-center items-center px-4 py-3 rounded-xl bg-green-300 text-green-900"
						onClick={() => {
							api.post("/user/invite/accept", { id: _id }).then(update).catch(console.error);
						}}
					>
						<Check className="inline-block mr-2 " size={"1.6rem"} />
						Accept
					</button>
					<button
						className="flex justify-center items-center px-4 py-3 rounded-xl bg-red-300/75 text-red-900"
						onClick={() => {
							api.post("/user/invite/delete", { id: _id }).then(update).catch(console.error);
						}}
					>
						<X className="inline-block mr-2" size={"1.6rem"} />
						Delete
					</button>
				</div>
			</div>
		</div>
	);
};

export default function Invites() {
	const [counter, setCounter] = useState(0);
	const [jobs, setJobs] = useState([]);
	const api = useApi(true);

	const [invitePage, setInvitePage] = useState("all");

	useEffect(() => {
		api
			.post("/user/invite/list", {})
			.then((data) => setJobs((_) => data))
			.catch(console.error);
	}, [counter]);

	useEffect(() => {}, [jobs]);

	return jobs ? (
		<main className="grow flex items-stretch h-full bg-background-100">
			<div className="grow p-4 border-r">
				<Outlet />
			</div>
			<div className="shrink-0 flex flex-col w-80 bg-background-0">
				<div className="shrink-0 flex justify-around border-b">
					<button
						className={`px-2 pt-3 py-2 border-b-2 ${
							invitePage == "all" ? "border-violet-800" : "border-transparent"
						} text-sm`}
						onClick={() => setInvitePage((_) => "all")}
					>
						All Invites
					</button>
					<button
						className={`px-2 pt-3 py-2 border-b-2 ${
							invitePage == "accepted" ? "border-violet-800" : "border-transparent"
						} text-sm`}
						onClick={() => setInvitePage((_) => "accepted")}
					>
						Accepted
					</button>
					<button
						className={`px-2 pt-3 py-2 border-b-2 ${
							invitePage == "bookmarked" ? "border-violet-800" : "border-transparent"
						} text-sm`}
						onClick={() => setInvitePage((_) => "bookmarked")}
					>
						Bookmarked
					</button>
				</div>
				{jobs.length ? null : (
					<div className="flex flex-col justify-center items-center p-8">
						<p className="text-center text-xs text-letters-tertiary">
							Job invites you recieve will show up here
						</p>
					</div>
				)}
			</div>
		</main>
	) : (
		<div className="grow flex justify-center items-center">
			<LineWave width="200" color="#7A77FF" className="text-brand-primary" />
		</div>
	);
}
