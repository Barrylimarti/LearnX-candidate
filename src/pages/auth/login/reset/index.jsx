import { useEffect, useState } from "react";

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import BackgroundImage from "../../../../assets/backgrounds/auth.svg";
import SassyGirlDesk from "../../../../assets/sassy-girl/having-idea-with-background.svg";
import useApi from "../../../../lib/useApi";

export default function ResetPassword() {
	const { register, handleSubmit } = useForm();
	const [searchParams, setSearchParams] = useSearchParams();
	const navigate = useNavigate();
	const [reqData, setReqData] = useState({ state: "", email: "" });
	const [error, setError] = useState(null);

	const api = useApi();

	useEffect(() => {
		if (!searchParams.has("state") || !searchParams.has("email")) {
			alert("invalid link! restart the process!");
			navigate("/login/forgot");
		} else {
			setReqData((_) => ({ state: searchParams.get("state"), email: searchParams.get("email") }));
			setSearchParams(undefined, { replace: true });
		}
	}, []);

	const onSubmit = async (data) => {
		if (data.password !== data.confirmPassword) {
			setError("Passwords don't match!");
			return;
		}
		const resetOptions = { ...data, ...reqData };
		const { error } = await api.post("/auth/reset", resetOptions);
		if (error) {
			setError(error);
		} else {
			setError(null);
			navigate("/login", { replace: true });
		}
	};

	return (
		<motion.div className="relative min-h-screen bg-[#091522]">
			<img className="absolute w-full h-full object-cover object-center" src={BackgroundImage} />
			<div className="absolute w-full h-full top-0 left-0 hidden lg:grid grid-cols-2">
				<div className="col-span-1"></div>
				<div className="col-span-1 rounded-tl-[4rem] border-l-[1px] border-t-[1px] border-white/30"></div>
			</div>
			<motion.div className="relative 2xl:container grid grid-cols-2 items-center min-h-screen mx-auto my-auto">
				<div className="hidden lg:block col-span-1">
					<div className="relative flex justify-center">
						<img
							className="relative max-h-full max-w-full"
							src={SassyGirlDesk}
							alt="sassy-girl-with-laptop"
						/>
					</div>
				</div>
				<div className="col-span-2 lg:col-span-1 p-16">
					<div className="relative top-12">
						<h1 className="text-5xl font-bold text-white">Reset Password ✍🏻</h1>
						<h6 className="text-md text-gray-400 mt-8">
							Email verification is done. Please choose another password
						</h6>
						<div
							className="w-20 h-[4px] mt-6"
							style={{
								background: "linear-gradient(94.86deg, #F84857 22.09%, #C7096F 85.17%)",
							}}
						></div>
						{error ? (
							<div className="mt-6">
								<p className="text-danger-default">{error}</p>
							</div>
						) : null}
						<form className="mt-6" action="" onSubmit={handleSubmit(onSubmit)}>
							<div className="mb-10">
								<label className="inline-block text-white mb-2">New Password</label>
								<input
									type="password"
									className="bg-transparent text-white w-full px-5 py-4 border-2 border-white/30 rounded-[3rem]"
									placeholder="e.g. davon@mail.com"
									{...register("password")}
								/>
							</div>
							<div className="mb-10">
								<label className="inline-block text-white mb-2">Confirm Password</label>
								<input
									type="password"
									className="bg-transparent text-white w-full px-5 py-4 border-2 border-white/30 rounded-[3rem]"
									placeholder="e.g. davon@mail.com"
									{...register("confirmPassword")}
								/>
							</div>
							<div className="mb-10 grid grid-cols-2 items-center">
								<div className="col-span-1">
									<motion.button
										className="w-full px-10 py-4 rounded-[3rem] font-semibold text-white disabled:cursor-not-allowed"
										style={{
											background:
												"linear-gradient(94.86deg, #F84857 22.09%, #C7096F 85.17%), #5D3FFF",
										}}
									>
										Reset Password
									</motion.button>
								</div>
							</div>
							<div className="text-white/70 text-sm">
								Go back to{" "}
								<a href="" className="font-semibold text-white">
									Login
								</a>
							</div>
						</form>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
}
