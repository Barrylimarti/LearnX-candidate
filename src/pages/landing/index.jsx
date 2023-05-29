import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import logo from "../../assets/logo/spehre-logo-full.svg";
import dots from "../../assets/backgrounds/dots.svg";
import element from "../../assets/backgrounds/Element.svg";
import element2 from "../../assets/backgrounds/Element2.svg";
import dk1 from "../../assets/backgrounds/dk1.svg";
import icon from "../../assets/backgrounds/icon.svg";
import dots2 from "../../assets/backgrounds/dots2.svg";
import dk2 from "../../assets/backgrounds/dk2.svg";
import leftArrow from "../../assets/backgrounds/arrow-left-circle.svg";
import rightArrow from "../../assets/backgrounds/arrow-right-circle.svg";
import tick from "../../assets/backgrounds/tick.svg";
import dk3 from "../../assets/backgrounds/dk3.svg";
import dk4 from "../../assets/backgrounds/dk4.svg";
import dk5 from "../../assets/backgrounds/dk5.svg";
import dk6 from "../../assets/backgrounds/dk6.svg";
import reward from "../../assets/backgrounds/reward.svg";
import map from "../../assets/backgrounds/map.svg";
import phone from "../../assets/backgrounds/phone.svg";
import mail from "../../assets/backgrounds/mail.svg";

const Landing = () => {
  const navigate = useNavigate();
  const navigateLogin = () => {
    // 👇️ navigate to /
    navigate("/login");
  };
  return (
    <div>
      <nav className="bg-[#F6F9FF] flex justify-between">
        <img src={logo} className="px-4" />
        <ul className="px-28 py-4 space-x-8 justify-end flex align-middle">
          <li className="text-alt-blue-100 cursor-pointer font-semibold pt-2">
            About Us
          </li>
          <li className="text-alt-blue-100 cursor-pointer font-semibold pt-2">
            For Companies
            <span className="text-alt-purple-100 cursor-pointer font-semibold pt-2">
              (Coming Soon)
            </span>
          </li>
          <li className="text-alt-blue-100 cursor-pointer font-semibold pt-2">
            Testimonials
          </li>
          <li className="text-alt-blue-100 cursor-pointer font-semibold pt-2">
            Our Team
          </li>
          <li>
            <button
              className="bg-alt-purple-0 text-white text-base h-11 pr-5 pl-5 rounded-3xl"
              onClick={navigateLogin}
            >
              Login/SignUp
            </button>
          </li>
        </ul>
      </nav>
      <div className="flex justify-between mt-24">
        <img src={dots} className="mb-36" />
        <div className=" flex text-center flex-col items-center w-128 ml-52">
          <span className="text-6xl text-alt-purple-100  font-bold tracking-wide leading-snug">
            Create a <span className="text-alt-blue-200">Perfect CV</span> & Get
            Your Dream Job
          </span>
          <div className="text-xl font-bold w-100 text-center  text-alt-purple-100 my-11">
            Spehre{" "}
            <span className="text-alt-grey-0 font-normal">
              is a platform that will help you create a perfect CV for your
              desired job.
            </span>
          </div>
          <div className="flex">
            <button className="bg-alt-purple-100 text-white text-lg py-3 px-8 rounded-4xl mx-4 tracking-wide">
              Sign In
            </button>
            <button className="bg-alt-purple-100 text-white text-lg py-3 px-4 rounded-4xl tracking-wide">
              Create CV
            </button>
          </div>
        </div>
        <div className="flex flex-col mt-6 gap-24">
          <img src={element} className="w-36 mx-20" />
          <img src={element2} className="w-96" />
        </div>
      </div>
      <div className="flex justify-between">
        <div className="relative w-128 ml-10">
          <div>
            <div className="bg-[#DFDCFF] w-128 h-96 rounded-3xl"></div>
            <div className="absolute -left-10 -top-10 w-128">
              <img src={dk1} />
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-6 items-center">
          <div className="flex justify-between w-80 h-20 rounded-2xl border-2 border-[#C2C2C2]">
            <img src={icon} className="h-14 pt-6 px-4" />
            <div className="flex flex-col">
              <span className="font-medium pt-4">Human Resource</span>
              <span className="text-alt-grey-0">Crosss</span>
            </div>
            <div className="px-2 pt-6 text-alt-purple-0">Apply {"  >"}</div>
          </div>
          <div className="flex justify-between gap-20 items-center">
            <div className="flex justify-between w-80 h-20 rounded-2xl border-2 border-[#C2C2C2]">
              <img src={icon} className="h-14 pt-6 px-4" />
              <div className="flex flex-col">
                <span className="font-medium pt-4">Human Resource</span>
                <span className="text-alt-grey-0">Crosss</span>
              </div>
              <div className="px-2 pt-6 text-alt-purple-0">Apply {"  >"}</div>
            </div>
            <img src={dots2} />
          </div>
        </div>
      </div>
      <div className="flex gap-24 p-10 mt-10">
        <img src={logo} />
        <img src={logo} />
        <img src={logo} />
        <img src={logo} />
        <img src={logo} />
        <img src={logo} />
        <img src={logo} />
      </div>
      <div className="flex justify-center text-6xl mt-24 font-bold">
        <span className="text-alt-blue-200">
          Get<span className="text-alt-purple-100"> Started!</span>
        </span>
      </div>
      <div className="flex justify-evenly items-center mt-16">
        <img src={leftArrow} />
        <img src={dk2} />
        <div className="flex flex-col gap-5">
          <span className="text-alt-purple-0 font-semibold text-3xl">
            Login or Register
          </span>
          <span className="text-alt-grey-0 font-medium tracking-wide w-100 text-xl">
            Follow the steps and you{"’"}re just ready to get started to get
            your dream job.
          </span>
          <div className="flex w-96 font-normal gap-3">
            <img src={tick} className="w-16" />
            <span>
              One Workflow.{" "}
              <span className="text-alt-grey-0">
                Easily collaborate with terms to find & hire the right candidate
              </span>
            </span>
          </div>
          <div className="flex w-80 font-normal gap-3">
            <img src={tick} className="w-16" />
            <span>
              Easy Appyling.{" "}
              <span className="text-alt-grey-0">
                Create account that will engage your profile.
              </span>
            </span>
          </div>
        </div>
        <div className="flex flex-col mb-52">
          <img src={dots2} className="-mt-32" />
          <img src={rightArrow} className="h-8 mt-28" />
        </div>
      </div>
      <div className="flex justify-around gap-3 mt-16">
        <div className="flex flex-col gap-3 w-64">
          <div className="flex rounded-full w-12 h-12 text-white bg-alt-purple-0 text-center items-center justify-center text-3xl">
            1
          </div>
          <span className="text-alt-purple-0 font-semibold text-xl">
            Login or Register
          </span>
          <span className="text-alt-grey-0 font-medium text-sm ">
            Follow the steps and you’re just ready to get started.
          </span>
        </div>
        <div className="flex flex-col gap-3 w-64">
          <div className="flex rounded-full w-12 h-12 text-white bg-alt-purple-0 text-center items-center justify-center text-3xl">
            2
          </div>
          <span className="text-alt-purple-0 font-semibold text-xl">
            Fill your Personal Data
          </span>
          <span className="text-alt-grey-0 font-medium text-sm ">
            Finish your register and complete your personal data.
          </span>
        </div>
        <div className="flex flex-col gap-3 w-64">
          <div className="flex rounded-full w-12 h-12 text-white bg-alt-purple-0 text-center items-center justify-center text-3xl">
            3
          </div>
          <span className="text-alt-purple-0 font-semibold text-xl">
            Create your Resume
          </span>
          <span className="text-alt-grey-0 font-medium text-sm ">
            Create your resume that matches your background.
          </span>
        </div>
        <div className="flex flex-col gap-3 w-64">
          <div className="flex rounded-full w-12 h-12 text-white bg-alt-purple-0 text-center items-center justify-center text-3xl">
            4
          </div>
          <span className="text-alt-purple-0 font-semibold text-xl">
            Find the Match Job
          </span>
          <span className="text-alt-grey-0 font-medium text-sm ">
            Look for job vacancy and immediately get your dream job.
          </span>
        </div>
      </div>
      <div>
        <div className="bg-[#F6F9FF] h-128 mt-28">
          <div className="grid grid-cols-6 gap-4 pt-32">
            <div className="flex flex-col gap-12 justify-center items-center col-start-2 col-span-4">
              <span className="text-alt-blue-200 text-6xl font-bold">
                Build Professional{" "}
                <span className="text-alt-purple-100">CV</span>
              </span>
              <span className="text-alt-grey-0 w-98 text-center font-medium">
                Upscale your CV with help of Spehre to get your dream job in a
                quicker way possible.{" "}
              </span>
              <button className="bg-alt-purple-100 text-white px-6 py-2 rounded-3xl font-medium">
                Know more
              </button>
            </div>
            <div className="flex items-center">
              <img src={dots2} className="ml-auto h-40" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 pt-12">
            <div className="flex items-center">
              <img src={dots} className="h-40" />
            </div>
            <div className="flex flex-col gap-12 justify-center items-center col-start-2 col-span-4">
              <img src={dk3} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-96">
        <span className="text-alt-blue-200 font-bold text-6xl w-128 tracking-wide leading-snug">
          Check your <span className="text-alt-purple-100">Profile</span> &
          Application <span className="text-alt-purple-100">Progress</span>
        </span>
      </div>
      <div className="grid grid-cols-2 mt-8 ">
        <div className="relative grid grid-cols-6">
          <div className="col-start-1 col-span-4 bg-[#F6F9FF] h-128"></div>
          <div className="flex absolute left-36">
            <img src={dk4} />
          </div>
          <div className="flex absolute bottom-10">
            <img src={dots} />
          </div>
        </div>
        <div className="flex flex-col">
          <div className="flex justify-end">
            <img src={dots2} />
          </div>
          <div className="flex flex-col gap-5 ml-24 w-100">
            <div className="flex gap-3">
              <img src={tick} className="w-6" />
              <span className="text-alt-grey-0 text-xl">
                Checkout new job opportunities in your field.
              </span>
            </div>
            <div className="flex gap-3">
              <img src={tick} className="w-8" />
              <span className="text-alt-grey-0 text-xl">
                Apply to jobs and check theirs status get job invites in your
                industry.
              </span>
            </div>
            <div className="flex gap-3">
              <img src={tick} className="w-6" />
              <span className="text-alt-grey-0 text-xl">
                Easy to apply Jobs.
              </span>
            </div>
            <button className="bg-alt-purple-100 w-32 rounded-3xl px-4 py-2 text-white font-medium">
              Know More
            </button>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-[#F6F9FF] h-128 mt-16">
          <div className="grid grid-cols-6 gap-4 pt-32">
            <div className="flex flex-col gap-12 justify-center items-center col-start-2 col-span-4">
              <span className="text-alt-blue-200 text-6xl font-semibold">
                Wheel of{" "}
                <span className="text-alt-purple-100">Opportunity</span>
              </span>
              <span className="text-alt-grey-0 w-98 text-center font-medium">
                Update your Profile and keep adding new skills to earn points
                and gain reward.{" "}
              </span>
              <button className="bg-alt-purple-100 text-white px-6 py-2 rounded-3xl font-medium">
                Know more
              </button>
            </div>
            <div className="flex items-center">
              <img src={dots2} className="ml-auto h-40" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-2 pt-12">
            <div className="flex gap-20 justify-center items-center col-start-2 col-span-4 ">
              <div className="bg-[#DFDCFF] w-80 h-72 rounded-2xl relative ">
                <img src={dk5} className="absolute left-10 top-10" />
              </div>
              <div className="flex flex-col gap-4 font-medium ">
                <div className="flex ">
                  <img src={reward} />
                  <span className="text-alt-grey-0">Update your Profile</span>
                </div>
                <div className="flex">
                  <img src={reward} />
                  <span className="text-alt-grey-0">Add new skills</span>
                </div>
                <div className="flex">
                  <img src={reward} />
                  <span className="text-alt-grey-0">Earn points</span>
                </div>
                <div className="flex">
                  <img src={reward} />
                  <span className="text-alt-grey-0">
                    Increase Profile strength
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="bg-[#F6F9FF] h-128 mt-28">
          <div className="grid grid-cols-6 gap-4 pt-32">
            <div className="flex flex-col gap-12 justify-center items-center col-start-2 col-span-4">
              <span className="text-alt-blue-200 text-6xl font-bold w-128 text-center">
                Stay Updated About{" "}
                <span className="text-alt-purple-100">your industry</span>
              </span>
              <span className="text-alt-grey-0 w-98 text-center font-medium">
                Get up to date news about your industry. Be a part of latest
                discussions in your industry{" "}
              </span>
            </div>
            <div className="flex items-center">
              <img src={dots2} className="ml-auto h-40" />
            </div>
          </div>
          <div className="grid grid-cols-6 gap-4 pt-12">
            <div className="flex items-end">
              <img src={dots} className="h-40" />
            </div>
            <div className="flex flex-col gap-12 justify-center items-center col-start-2 col-span-4">
              <img src={dk6} />
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-4 bg-[#F6F9FF] gap-4 mt-80">
        <div className="flex flex-col gap-3 justify-center items-center">
          <img src={logo} />
          <span className="text-alt-blue-100 font-medium text-xs w-48">
            Lorem ipsum dolor sit amet consectetur. Ut quis et nullam et sit
            ultrices mauris vestibulum sagittis.
          </span>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-alt-blue-100 text-lg font-medium">Links</span>
          <span className="text-[#716EA6] text-xs font-medium">About Us</span>
          <span className="text-[#716EA6] text-xs font-medium">Profile</span>
          <span className="text-[#716EA6] text-xs font-medium">Jobs</span>
          <span className="text-[#716EA6] text-xs font-medium">Reviews</span>
        </div>
        <div className="flex flex-col gap-3 justify-center items-center">
          <span className="text-alt-blue-100 text-lg font-medium">Help</span>
          <span className="text-[#716EA6] text-xs font-medium">My Account</span>
          <span className="text-[#716EA6] text-xs font-medium">
            Returns & Refunds
          </span>
          <span className="text-[#716EA6] text-xs font-medium">
            Payment Policy
          </span>
          <span className="text-[#716EA6] text-xs font-medium">FAQ</span>
        </div>
        <div className="flex flex-col gap-4 justify-center pl-16">
          <span className="text-alt-blue-100 text-lg font-medium">
            Contact Us
          </span>
          <div className="flex gap-2">
            <img src={map} />
            <span className="text-alt-purple-0 text-xs font-medium">
              2464 Royal Ln. Mesa, New Jersey 45463
            </span>
          </div>
          <div className="flex gap-2">
            <img src={phone} />
            <span className="text-alt-purple-0 text-xs font-medium">
              (505) 555-0125
            </span>
          </div>
          <div className="flex gap-2">
            <img src={mail} />
            <span className="text-alt-purple-0 text-xs font-medium">
              connect@ewsfg
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        Spehre 2022. All Rights Reserved.
      </div>
    </div>
  );
};

export default Landing;
