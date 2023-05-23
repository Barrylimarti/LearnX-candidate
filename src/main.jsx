import "./index.css";

import React from "react";

import { createRoot } from "react-dom/client";
import ReactModal from "react-modal";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import App from "./App";

ReactModal.setAppElement("#root");

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<RecoilRoot>
			<App />
		</RecoilRoot>
	</BrowserRouter>
);
