import {
  NavLink,
  Outlet,
} from "react-router-dom";

import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function PreferencesMenu() {
	return (
		<div>
			<NavLink
				to={"general"}
				end
				className={({ isActive }) =>
					`flex justify-between items-center gap-2 w-full px-5 py-5 hover:bg-background-200 font-medium`
				}
			>
				<p className="grow">General</p>
				<FontAwesomeIcon icon={faChevronRight} />
			</NavLink>
			<NavLink
				to={"privacy"}
				className={({ isActive }) =>
					`flex justify-between items-center gap-2 w-full px-5 py-5 hover:bg-background-200 font-medium`
				}
			>
				<p className="grow">Privacy & Security</p>
				<FontAwesomeIcon icon={faChevronRight} />
			</NavLink>
			<NavLink
				to={"job"}
				className={({ isActive }) =>
					`flex justify-between items-center gap-2 w-full px-5 py-5 hover:bg-background-200 font-medium`
				}
			>
				<p className="grow">Job Preferences</p>
				<FontAwesomeIcon icon={faChevronRight} />
			</NavLink>
			<NavLink
				to={"creator-mode"}
				className={({ isActive }) =>
					`flex justify-between items-center gap-2 w-full px-5 py-5 hover:bg-background-200 font-medium`
				}
			>
				<p className="grow">Creator Mode</p>
				<FontAwesomeIcon icon={faChevronRight} />
			</NavLink>
		</div>
	);
}

export default function Preferences() {
	return (
		<main className="relative h-full grid grid-cols-12 gap-6">
			<div className="absolute top-0 left-0 bottom-0 right-0 flex border-t shadow-inner">
				<div className="grow w-full md:w-auto relative">
					<div className="absolute top-0 left-0 bottom-0 right-0">
						<Outlet />
					</div>
				</div>
				<div className="hidden md:block w-72 border-l shadow-md bg-background-0/80 text-primary-default">
					<NavLink
						to={"general"}
						end
						className={({ isActive }) =>
							`flex items-center gap-2 w-full px-5 py-5 ${
								isActive ? "bg-background-200 border-l-2 border-violet-800" : ""
							} text-lg font-semibold`
						}
					>
						<p className="grow text-sm">General</p>
					</NavLink>
					<NavLink
						to={"privacy"}
						className={({ isActive }) =>
							`flex items-center gap-2 w-full px-5 py-5 ${
								isActive ? "bg-background-200 border-l-2 border-violet-800" : ""
							} text-lg font-semibold`
						}
					>
						<p className="grow text-sm">Privacy & Security</p>
					</NavLink>
					<NavLink
						to={"job"}
						className={({ isActive }) =>
							`flex items-center gap-2 w-full px-5 py-5 ${
								isActive ? "bg-background-200 border-l-2 border-violet-800" : ""
							} text-lg font-semibold`
						}
					>
						<p className="grow text-sm">Job Preferences</p>
					</NavLink>
					<NavLink
						to={"creator-mode"}
						className={({ isActive }) =>
							`flex items-center gap-2 w-full px-5 py-5 ${
								isActive ? "bg-background-200 border-l-2 border-violet-800" : ""
							} text-lg font-semibold`
						}
					>
						<p className="grow text-sm">Creator Mode</p>
					</NavLink>
				</div>
			</div>
		</main>
	);
}
