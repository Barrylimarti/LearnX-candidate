import { useState } from "react";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import AuthBg from "../../../assets/images/profile-bg.jpg";
import SpehreLogo from "../../../assets/logo/spehre-full-black.png";
import CheckBox from "../../../components/CheckBox";
import Button from "../../../components/utils/Button";
import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

export const LoginEmail = () => {
  const setUser = useSetRecoilState(userSelector);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const api = useApi(false);
  const onSubmit = async (data) => {
    try {
      const { error, accessToken, refreshToken, user } = await api.post(
        "/auth/login",
        data
      );
      if (error) {
        console.error(error);
        setError(error);
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("lastRefresh", Date.now());
        setUser((_) => user);
        navigate(user.startCompleted ? "/home" : "/start");
      }
    } catch (error) {
      // console.error(error);
      setError((_) => error.verb);
    }
  };

  const frames = {
    initial: { y: "5px", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.form
      key={"reg1form"}
      {...frames}
      className="relative flex flex-col gap-5"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="relative">
        <label htmlFor="email" className="block text-sm mb-2 text-[#696969]">
          Email
        </label>
        <input
          className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
          type="email"
          id="email"
          {...register("email")}
        />
      </div>

      <div className="relative">
        <label htmlFor="password" className="block text-sm mb-2 text-[#696969]">
          Password
        </label>
        <input
          className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
          type="password"
          id="password"
          {...register("password")}
        />
        <div className="flex justify-end mt-1">
          <Link className="text-xs">Forgot password?</Link>
        </div>
      </div>
      <div>
        <CheckBox
          label={<span className="text-xs text-[#6E6E6E]">Remember me</span>}
          defaultChecked={remember}
          onChange={(checked) => setRemember((_) => checked)}
        />
      </div>
      <div className="flex flex-col mt-4">
        <Button
          theme={"primary"}
          label={
            <span className="inline-block p-1 text-sm font-normal">Log In</span>
          }
          isLoading={isSubmitting}
        />
        {error ? (
          <p className="my-1 text-center text-xs text-danger-default">
            {error}
          </p>
        ) : null}
      </div>
    </motion.form>
  );
};

export default function Login() {
  return (
    <MotionConfig transition={{ staggerChildren: 0.01 }}>
      <AnimatePresence>
        <div className="fixed left-0 top-0 w-screen h-screen grid grid-cols-2">
          <div className="flex justify-center items-center">
            <div
              className="w-full max-w-md h-fit max-h-[min(80%,_45rem)] px-14 py-10 border rounded-md bg-white overflow-auto"
              style={{ boxShadow: "0px 6px 16px rgba(50, 54, 71, 0.12)" }}
            >
              <img
                className="fixed top-6 left-6 w-36"
                src={SpehreLogo}
                alt="logo"
              />
              <h1 className="text-2xl font-bold text-center text-[#2B276C] mb-8">
                Welcome back! Log In
              </h1>
              <LoginEmail />
              <div className="mt-5">
                <p className="text-xs text-center mb-5 text-[#323647]">or</p>
                <p className="text-xs text-center mb-5 text-[#323647]">
                  Log in with
                </p>
                <div className="flex justify-center gap-8">
                  <button className="flex items-center justify-center h-10 w-10 rounded-md border border-[#A3AED0]">
                    <img
                      className="w-5"
                      src="https://img.icons8.com/color/48/null/google-logo.png"
                    />
                  </button>
                  <button className="flex items-center justify-center h-10 w-10 rounded-md border border-[#A3AED0]">
                    <img
                      className="w-5"
                      src="https://img.icons8.com/color/48/null/facebook-new.png"
                    />
                  </button>
                </div>
                <p className="mt-12 mb-2 text-xs text-center">
                  New to Spehre?{" "}
                  <Link to={"/register"} className="text-brand-primary">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div
            style={{
              backgroundImage: `url("${AuthBg}")`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center center",
            }}
          ></div>
        </div>
      </AnimatePresence>
    </MotionConfig>
  );
}
