import { Outlet, useLocation, useRoutes } from "react-router-dom";

import BottomBar from "../components/layout/BottomBar";
import Navbar from "../components/layout/Navbar";
import SideBar from "../components/layout/SideBar";
import NoUserRoute from "../components/NoUserRoute";
import PrivateRoute from "../components/PrivateRoute";
import NotificationProvider from "../contexts/notificationContext";
import SocketProvider from "../contexts/socketContext";
import Login from "../pages/auth/login";
import ForgotPassword from "../pages/auth/login/forgot";
import ResetPassword from "../pages/auth/login/reset";
import Logout from "../pages/auth/logout";
import Register, { RegisterDetails, RegisterEmail, RegisterVerify } from "../pages/auth/register";
import Profile, {
	ProfileAbout,
	ProfilePosts,
	ProfileSkills,
	ProfileSpaces,
} from "../pages/profile";
import Start from "../pages/start";

const MainApp = ({}) => {
	return (
		<SocketProvider>
			<NotificationProvider>
				<Navbar className="shrink-0" />
				<div className="relative flex items-stretch min-h-screen max-h-screen xborder-x">
					<SideBar />
					<div className="grow relative flex flex-col">
						<div className="grow relative xpb-[6rem] md:pb-0">
							<div className="absolute top-0 left-0 bottom-0 right-0 bg-[#f6f9ff]/50">
								<Outlet />
							</div>
						</div>
						<BottomBar />
					</div>
				</div>
			</NotificationProvider>
		</SocketProvider>
	);
};

export default function AppRoutes() {
	const location = useLocation();
	const element = useRoutes([
		{
			path: "login",
			element: (
				<NoUserRoute>
					<Outlet />
				</NoUserRoute>
			),
			children: [
				{
					path: "",
					element: <Login />,
				},
				{
					path: "forgot",
					element: <ForgotPassword />,
				},
				{
					path: "reset",
					element: <ResetPassword />,
				},
			],
		},
		{
			path: "register",
			element: (
				<NoUserRoute>
					<Register />
				</NoUserRoute>
			),
			children: [
				{
					path: "",
					element: <RegisterEmail />,
				},
				{
					path: "verify",
					element: <RegisterVerify />,
				},
				{
					path: "details",
					element: <RegisterDetails />,
				},
			],
		},
		{
			path: "logout",
			element: <Logout />,
		},
		{
			path: "start",
			element: <PrivateRoute element={<Start />} />,
		},
		{
			path: "",
			element: <PrivateRoute element={<MainApp />} />,
			children: [
				// {
				// 	path: "",
				// 	element: <Navigate to={"/home"} />,
				// },
				// {
				// 	path: "search",
				// 	element: <Search />,
				// },
				// { path: "notifications", element: <Notifications /> },
				{
					path: "profile",
					element: <Profile />,
					children: [
						{
							path: "",
							element: <ProfileAbout />,
						},
						{
							path: "skills",
							element: <ProfileSkills />,
						},
						{
							path: "posts",
							element: <ProfilePosts />,
						},
						{
							path: "spaces",
							element: <ProfileSpaces />,
						},
					],
				},
				// {
				// 	path: "preferences",
				// 	element: <Preferences />,
				// 	children: [
				// 		{
				// 			path: "",
				// 			element: <PreferencesMenu />,
				// 		},
				// 		{
				// 			path: "general",
				// 			element: <GeneralPreferences />,
				// 		},
				// 		{
				// 			path: "privacy",
				// 			element: <PrivacyPreferences />,
				// 		},
				// 		{
				// 			path: "job",
				// 			element: <JobPreferences />,
				// 		},
				// 		{
				// 			path: "creator-mode",
				// 			element: <CreatorPreferences />,
				// 		},
				// 	],
				// },
				// {
				// 	path: "analytics",
				// 	element: <Analytics />,
				// },
				// {
				// 	path: "invites",
				// 	element: <Invites />,
				// 	children: [
				// 		{
				// 			path: "",
				// 			element: (
				// 				<div className="flex justify-center items-center h-full">
				// 					<p className="text-center text-sm text-letters-tertiary">
				// 						Select a invite to see details
				// 					</p>
				// 				</div>
				// 			),
				// 		},
				// 		{
				// 			path: "*",
				// 			element: <></>,
				// 		},
				// 	],
				// },
				// {
				// 	path: "candidate/:id",
				// 	element: <Candidate />,
				// 	children: [
				// 		{
				// 			path: "",
				// 			element: <CandidateAbout />,
				// 		},
				// 		{
				// 			path: "skills",
				// 			element: <CandidateSkills />,
				// 		},
				// 		{
				// 			path: "posts",
				// 			element: <CandidatePosts />,
				// 		},
				// 		{
				// 			path: "spaces",
				// 			element: <CandidateSpaces />,
				// 		},
				// 	],
				// },
				// {
				// 	path: "messaging",
				// 	element: <Messaging />,
				// 	children: [
				// 		{
				// 			path: "",
				// 			element: <EmptyRoom />,
				// 		},
				// 		{
				// 			path: ":room",
				// 			element: <Chat key={location.pathname} />,
				// 		},
				// 	],
				// },
				// {
				// 	path: "community/create",
				// 	element: <CreateCommunity />,
				// },
				// {
				// 	path: "community/:name",
				// 	element: <Community key={location.pathname} />,
				// children: [
				// 	{
				// 		path: "",
				// 		element: <CommunityPosts />,
				// 	},
				// 	{
				// 		path: "about",
				// 		element: <CommunityAbout />,
				// 	},
				// 	{
				// 		path: "*",
				// 		element: (
				// 			<div className="grow flex justify-center items-center">
				// 				<h1 className="text-4xl font-bold text-primary-default">Coming soon...</h1>
				// 			</div>
				// 		),
				// 	},
				// ],
				// },
				// {
				// 	path: "rewards",
				// 	element: <MyRewards />,
				// },
				// {
				// 	path: "saved",
				// 	element: <SavedPosts />,
				// },
				// {
				// 	path: "home",
				// 	element: <Home />,
				// 	children: [
				// 		{
				// 			path: "",
				// 			element: <Feed />,
				// 		},
				// 		{
				// 			path: "explore",
				// 			element: <Explore />,
				// 		},
				// 	],
				// },
			],
		},
		// {
		// 	path: "*",
		// 	element: (
		// 		<div className="grow flex justify-center items-center">
		// 			<h1 className="text-4xl font-bold text-primary-default">Coming soon...</h1>
		// 		</div>
		// 	),
		// },
	]);

	return element;
}
