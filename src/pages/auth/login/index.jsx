import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

import userSelector from "../../../state/user";
import useApi from "../../../lib/useApi";

import sideimg from "../../../assets/backgrounds/sideimg.svg";
import sideimg2 from "../../../assets/backgrounds/sideimg.png";
import logo from "../../../assets/logo/spehre-logo-full.svg";
import user from "../../../assets/icons/user.svg";
import email from "../../../assets/icons/mail.svg";
import lock from "../../../assets/icons/lock.svg";
import CheckBox from "../../../components/CheckBox";

const Login = () => {
  const setUser = useSetRecoilState(userSelector);
  const [error, setError] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const api = useApi(false);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
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
        navigate(user.startCompleted ? "/home" : "/register/create");
      }
    } catch (error) {
      // console.error(error);
      setError((_) => error.verb);
    }
  };
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-start">
        <div className="flex w-full justify-start">
          <img src={logo} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col items-center mt-52 ">
            <div className="flex flex-col border-2 border-[#D5D3FF] justify-center items-center gap-6 w-98 p-5 rounded-3xl drop-shadow-md">
              <span className="text-2xl text-alt-blue-200 font-bold">
                Welcome back! Log In
              </span>
              <div className="flex flex-col gap-6 w-80 items-center justify-center">
                <div className="flex w-full">
                  <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                    <img src={email} />
                  </div>
                  <input
                    className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                    type="email"
                    id="email"
                    placeholder="Email"
                    {...register("email")}
                  />
                </div>
                <div className="flex w-full flex-col">
                  <div className="flex w-full">
                    <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                      <img src={lock} />
                    </div>
                    <input
                      className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                      type="password"
                      id="password"
                      placeholder="Password"
                      {...register("password")}
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <Link className="text-xs">Forgot password?</Link>
                  </div>
                </div>

                <div className="flex w-full justify-start mt-4">
                  <CheckBox
                    label={
                      <span className="text-xs text-[#6E6E6E]">
                        Remember me for 30 days
                      </span>
                    }
                    defaultChecked={remember}
                    onChange={(checked) => setRemember((_) => checked)}
                  />
                  {/* <Link className="text-xs">Remember me for 30 days</Link> */}
                </div>
                {error ? (
                  <p className="my-1 text-center text-xs text-danger-default">
                    {error}
                  </p>
                ) : null}
                <button className="w-full bg-alt-purple-100 text-white px-6 py-2 rounded-md">
                  Log In
                </button>
                <span>or</span>
                <span>Log in with</span>
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
                <p className="mt-4 mb-2 text-xs text-center">
                  New to Spehere?{" "}
                  <Link to={"/register"} className="text-brand-primary">
                    Sign Up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
      <div>
        <img src={sideimg} className="w-full" />
      </div>
    </div>
  );
};

export default Login;
