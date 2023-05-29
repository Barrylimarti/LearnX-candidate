import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { useForm, useFormState } from "react-hook-form";
import { Outlet, useLocation } from "react-router-dom";

import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

import sideimg from "../../../assets/backgrounds/sideimg.svg";
import logo from "../../../assets/logo/spehre-logo-full.svg";
import user from "../../../assets/icons/user.svg";
import email from "../../../assets/icons/mail.svg";
import lock from "../../../assets/icons/lock.svg";

const Register = () => {
  const setUser = useSetRecoilState(userSelector);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const [error, setError] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const api = useApi(false);
  const onSubmit = async (data) => {
    try {
      const { error, accessToken, refreshToken, user } = await api.post(
        "/auth/register",
        data
      );
      if (error) {
        setError(error);
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("lastRefresh", Date.now());
        setUser((_) => user);
        navigate("create");
      }
    } catch (error) {
      setError(error?.verb || "unknown_error");
    }
  };
  useEffect(() => {
    if (!location.state) {
      navigate("/register", { state: undefined });
    }
  }, []);
  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-start">
        <div className="flex w-full justify-start">
          <img src={logo} />
        </div>
        <div className="flex flex-col items-center mt-52 ">
          <div className="flex flex-col border-2 border-[#D5D3FF] justify-center items-center gap-6 w-98 p-5 rounded-3xl drop-shadow-md">
            <span className="text-2xl text-alt-blue-200 font-bold">
              Get Started with Spehre!
            </span>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-4 w-80 items-center justify-center">
                <div className="flex w-full">
                  <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                    <img src={user} />
                  </div>
                  <input
                    className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                    type="text"
                    id="name"
                    placeholder="Name"
                    {...register("name", { required: true })}
                  />
                </div>
                <div className="flex w-full">
                  <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                    <img src={email} />
                  </div>
                  <input
                    className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                    type="email"
                    id="email"
                    placeholder="Email"
                    {...register("email", { required: true })}
                  />
                </div>
                <div className="flex w-full">
                  <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                    <img src={lock} />
                  </div>
                  <input
                    className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                    type="password"
                    id="password"
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />
                </div>
                {error ? (
                  <p className="my-1 text-center text-xs text-danger-default">
                    {error}
                  </p>
                ) : null}
                <button className="w-full bg-alt-purple-100 text-white px-6 py-2 rounded-md">
                  Create Account
                </button>
                <span>or</span>
                <span>Sign in with</span>
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
                  Already have an account?{" "}
                  <Link to={"/login"} className="text-brand-primary">
                    Login here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <img src={sideimg} className="w-full " />
      </div>
    </div>
  );
};

export default Register;
