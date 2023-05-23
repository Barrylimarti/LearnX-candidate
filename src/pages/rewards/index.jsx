import { PersonLock } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

export default function MyRewards() {
	return (
		<main className="flex flex-col justify-center items-center gap-4 h-full text-letters-tertiary">
			<PersonLock className="text-5xl" />
			<p className="max-w-sm text-center">
				You can access my rewards after you unlock{" "}
				<Link to={"/preferences/creator-mode"} className="text-letters-secondary hover:underline">
					creators mode
				</Link>
				.
			</p>
		</main>
	);
}
