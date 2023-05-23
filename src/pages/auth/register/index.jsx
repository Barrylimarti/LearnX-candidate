import { useEffect, useRef, useState } from "react";

import { AnimatePresence, motion, MotionConfig } from "framer-motion";
import { useForm, useFormState } from "react-hook-form";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import {
  faArrowRight,
  faLock,
  faPhone,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import AuthBg from "../../../assets/images/profile-bg.jpg";
import SpehreLogo from "../../../assets/logo/spehre-full-black.png";
import Button from "../../../components/utils/Button";
import useApi from "../../../lib/useApi";
import userSelector from "../../../state/user";

export const RegisterEmail = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();
  const { errors } = useFormState({ control });
  const navigate = useNavigate();

  const api = useApi(false);
  const onSubmit = async (data) => {
    const state = crypto.randomUUID();
    await api.post("/auth/preRegister", { state, ...data });
    navigate("/register/verify", { state: { ...data, state } });
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
        <label htmlFor="name" className="block text-sm mb-2 text-[#696969]">
          Name
        </label>
        <input
          className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
          type="text"
          id="name"
          autoComplete={false}
          {...register("name")}
        />
      </div>
      <div className="relative">
        <label htmlFor="email" className="block text-sm mb-2 text-[#696969]">
          Email
        </label>
        <input
          className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
          type="email"
          id="email"
          autoComplete={false}
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
          autoComplete={false}
          {...register("password")}
        />
      </div>
      <Button
        theme={"primary"}
        label={
          <span className="inline-block p-1 text-sm font-normal">
            Create Account
          </span>
        }
        isLoading={isSubmitting}
      />
      <div className="mt-2">
        <p className="text-xs text-center mb-5 text-[#323647]">or</p>
        <p className="text-xs text-center mb-5 text-[#323647]">Log in with</p>
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
        <p className="mt-10 mb-2 text-xs text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-brand-primary">
            Log in
          </Link>
        </p>
      </div>
    </motion.form>
  );
};

export const RegisterVerify = () => {
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    setFocus,
  } = useForm();
  const location = useLocation();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const submitRef = useRef(null);

  const api = useApi(false);
  useEffect(() => {
    if (!location.state || !location.state?.state || !location.state?.email) {
      navigate("/register", { state: undefined });
    }
    api
      .post("/auth/sendPreOtp", {
        state: location.state?.state,
        email: location.state?.email,
      })
      .then(({ error }) => {
        if (!!error) setError((_) => error);
      })
      .catch(({ error, verb }) => {
        console.error(error);
        if (verb) setError((_) => verb);
        else setError((_) => "Unknown error!");
      });
  }, []);

  const onSubmit = async ({ otp }) => {
    try {
      const { error, token } = await api.post("/auth/preVerify", {
        otp: otp.join(""),
        email: location.state?.email,
      });
      if (error) {
        setError(error);
      } else {
        navigate("/register/details", { state: token });
      }
    } catch (error) {
      setError(error?.verb || "unknown_error");
    }
  };

  return (
    <motion.div className="flex items-center w-full max-w-6xl h-full md:max-h-[50rem] my-auto border md:rounded-lg shadow-2xl bg-white overflow-hidden">
      <div className="shrink-0 w-[55%] h-full hidden md:block">
        <img
          className="h-full w-full object-cover object-right"
          src={AuthBg}
          alt="bg"
        />
      </div>
      <div className="grow p-20">
        <motion.h1
          key={"header"}
          {...frames}
          className="mb-6 text-3xl font-medium text-[#343434]"
        >
          Verify Email
        </motion.h1>
        <motion.p
          key={"subheader"}
          {...frames}
          className="text-xs text-[#575757] mb-5"
        >
          Enter the OTP recieved in your email: {location.state?.email}.
        </motion.p>
        <div className="flex flex-col gap-6">
          <motion.form
            key={"reg2formde"}
            {...frames}
            className="relative flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid grid-cols-6 gap-2">
              <input
                type="text"
                {...register("otp.0", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.0", "");
                  }
                }}
                onChange={(e) => {
                  setFocus("otp.1");
                }}
              />
              <input
                type="text"
                {...register("otp.1", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.1", "");
                    setFocus("otp.0");
                  }
                }}
                onChange={(e) => {
                  setFocus("otp.2");
                }}
              />
              <input
                type="text"
                {...register("otp.2", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.2", "");
                    setFocus("otp.1");
                  }
                }}
                onChange={(e) => {
                  setFocus("otp.3");
                }}
              />
              <input
                type="text"
                {...register("otp.3", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.3", "");
                    setFocus("otp.2");
                  }
                }}
                onChange={(e) => {
                  setFocus("otp.4");
                }}
              />
              <input
                type="text"
                {...register("otp.4", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.4", "");
                    setFocus("otp.3");
                  }
                }}
                onChange={(e) => {
                  setFocus("otp.5");
                }}
              />
              <input
                type="text"
                {...register("otp.5", { required: true })}
                className="col-span-1 flex items-center justify-center h-12 border border-[#575757] rounded-md focus:outline-none text-center"
                placeholder=""
                onKeyDown={(e) => {
                  if (e.target.value.length > 0 || !/^\d$/.test(e.key))
                    e.preventDefault();
                  if (e.key.toLowerCase() == "backspace") {
                    setValue("otp.5", "");
                    setFocus("otp.4");
                  }
                }}
                onChange={(e) => {
                  // submitRef.current?.click();
                }}
              />
              {error ? (
                <p className="col-span-6 text-center text-xs text-danger-default">
                  {error}
                </p>
              ) : null}
            </div>
            <Button
              theme={"primary"}
              iconPosition="right"
              isLoading={isSubmitting}
              label="Next"
              icon={<FontAwesomeIcon icon={faArrowRight} className="" />}
            />
            <p className="text-xs text-letters-tertiary">
              Not you?{" "}
              <Link className="text-brand-primary" to={"/register"}>
                Go back
              </Link>
            </p>
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

export const RegisterDetails = () => {
  const setUser = useSetRecoilState(userSelector);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      phone: "",
      password: "",
    },
  });
  const location = useLocation();
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const api = useApi(false);
  useEffect(() => {
    if (!location.state) {
      navigate("/register", { state: undefined });
    }
  }, []);

  const frames = {
    initial: { y: "5px", opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { opacity: 0 },
  };

  const onSubmit = async (data) => {
    try {
      const { error, accessToken, refreshToken, user } = await api.post(
        "/auth/register",
        {
          ...data,
          token: location.state,
        }
      );
      if (error) {
        setError(error);
      } else {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("lastRefresh", Date.now());
        setUser((_) => user);
        navigate("/start");
      }
    } catch (error) {
      setError(error?.verb || "unknown_error");
    }
  };

  return (
    <motion.div className="flex items-center w-full max-w-6xl h-full md:max-h-[50rem] my-auto border md:rounded-lg shadow-2xl bg-white overflow-hidden">
      <div className="shrink-0 w-[55%] h-full hidden md:block">
        <img
          className="h-full w-full object-cover object-right"
          src={AuthBg}
          alt="bg"
        />
      </div>
      <div className="grow p-20">
        <motion.h1
          key={"header"}
          {...frames}
          className="mb-6 text-3xl font-medium text-[#343434]"
        >
          Account Details
        </motion.h1>
        <motion.p
          key={"subheader"}
          {...frames}
          className="text-xs text-[#575757] mb-5"
        >
          Add a few details about yourself.
        </motion.p>
        <div className="flex flex-col gap-6">
          <motion.form
            key={"regdetails"}
            {...frames}
            className="relative flex flex-col gap-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="relative">
              <input
                className="w-full py-2 pl-7 pr-3 border border-[#575757] rounded-md focus:outline-none text-xs"
                type="text"
                placeholder="Jay Logan"
                {...register("name", { required: true })}
                autoComplete={false}
              />
              <FontAwesomeIcon
                icon={faUser}
                className="absolute top-[0.605rem] left-2 text-[#575757]/50"
              />
            </div>
            <div className="relative">
              <input
                className="w-full py-2 pl-7 pr-3 border border-[#575757] rounded-md focus:outline-none text-xs"
                type="text"
                placeholder="8984xxxx34"
                {...register("phone", { required: true })}
                autoComplete={false}
              />
              <FontAwesomeIcon
                icon={faPhone}
                className="absolute top-[0.605rem] left-2 text-[#575757]/50"
              />
            </div>
            <div className="relative">
              <input
                className="w-full py-2 pl-7 pr-3 border border-[#575757] rounded-md focus:outline-none text-xs"
                type="password"
                placeholder="•••••••••••••••"
                {...register("password", { required: true })}
                autoComplete={false}
              />
              <FontAwesomeIcon
                icon={faLock}
                className="absolute top-[0.605rem] left-2 text-[#575757]/50"
              />
            </div>
            <Button
              theme={"primary"}
              iconPosition="right"
              isLoading={isSubmitting}
              label="Complete"
              icon={<FontAwesomeIcon icon={faArrowRight} className="" />}
            />
          </motion.form>
        </div>
      </div>
    </motion.div>
  );
};

const gradientAnimation = keyframes`
	0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

const GradientAnimatedDiv = styled.div`
  background: linear-gradient(-45deg, #df5fff, #8132ff, #f715ff, #c061ff);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
`;

export default function Register() {
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
                Get Started with Spehre!
              </h1>
              <Outlet />
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
