import { Helmet } from "react-helmet";
import { useLocation } from "react-router-dom";

import AppRoutes from "./routes";

function App() {
	const location = useLocation();
	let title =
		location.state?.title ||
		(location.pathname
			?.split("/")
			.filter((x) => !!x)[0]
			?.split("-")
			.map((x) => x.substring(0, 1).toUpperCase() + x.substring(1).toLowerCase())
			.join(" ") ??
			"Home");

	return (
		<>
			<Helmet>
				<title>{title} - Spehre</title>
				{/* <link rel="icon" type="image/x-icon" href="/favicon.ico" /> */}
			</Helmet>
			<AppRoutes />
		</>
	);
}

export default App;
