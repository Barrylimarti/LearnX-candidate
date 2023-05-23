import { PersonLock } from "react-bootstrap-icons";

export default function CreatorPreferences() {
	return (
		<main className="flex flex-col justify-center items-center gap-4 h-full text-letters-tertiary">
			<PersonLock className="text-5xl" />
			<p className="max-w-sm text-center">
				You can unlock creator's mode after you get a total of 5000 hits on your post collectively.
			</p>
		</main>
	);
}
