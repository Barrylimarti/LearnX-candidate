import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import useApi from "../../../../lib/useApi";
import userSelector from "../../../../state/user";
import { Controller, useForm, useWatch } from "react-hook-form";
import AsyncSelect from "react-select/async";

import sideimg from "../../../../assets/backgrounds/sideimg.svg";
import sideimg2 from "../../../../assets/backgrounds/sideimg.png";
import logo from "../../../../assets/logo/spehre-logo-full.svg";
import user from "../../../../assets/icons/user.svg";
import email from "../../../../assets/icons/mail.svg";
import lock from "../../../../assets/icons/lock.svg";
import CheckBox from "../../../../components/CheckBox";
import profilepic from "../../../../assets/icons/profilepic.svg";

import states from "../../../../data/states.json";
import citiesArr from "../../../../data/cities.json";
import designation from "../../../../data/designations.json";

import { useRecoilState } from "recoil";
import {
  faIndianRupeeSign,
  faRupee,
  faRupiahSign,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const reactSelectProps = {
  classNames: {
    container: () => `w-full`,
    control: ({ isFocused }) => {
      return `!px-2 !py-1 !border-solid !border ${
        isFocused ? "!border-violet-800" : "!border-letter-secondary"
      } !shadow-none !outline-none !rounded-md !min-h-0 !text-xs !border-[#95A5D2]`;
    },
    indicatorSeparator: () => `hidden`,
    valueContainer: () => `!py-0`,
  },
  styles: {
    indicatorsContainer: (baseStyles, state) => ({
      ...baseStyles,
      div: {
        padding: "1!important",
      },
    }),
  },
};
const jobType = [
  { value: "Full Time", text: "Full Time" },
  { value: "Part Time", text: "Part Time" },
  { value: "Internship", text: "Internship" },
  { value: "Freelance", text: "Freelance" },
];
const options = [
  { value: "value-1", text: "text-1" },
  { value: "value-2", text: "text-2" },
  { value: "value-3", text: "text-3" },
];
const CreateProfile = () => {
  const [user, setUser] = useRecoilState(userSelector);
  const {
    register,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const username = useWatch({ control, name: "username" });

  const [error, setError] = useState(null);
  const [locState, setLocState] = useState("");
  const [locCity, setLocCity] = useState("");
  const [dsg, setDsg] = useState("");
  const [jt, setJt] = useState("");
  const [prefLoc, setPrefLoc] = useState([]);
  const [prefOg, setPrefOg] = useState([]);

  console.log(locState);

  const api = useApi(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.username == username) {
      setError(false);
    } else if (username) {
      const handle = setTimeout(() => {
        api.post("/data/validateusername", { username }).then(({ error }) => {
          setError((_) => error);
        });
      }, 300);

      return () => clearTimeout(handle);
    }
  }, [username]);

  useEffect(() => {
    if (user.startCompleted) {
      navigate("/home");
    }
  }, []);

  const onSubmit = async (data) => {
    console.log({ ...data, locCity, locState, jt, dsg, prefLoc });
    try {
      await api.post("/user/start", {
        ...data,
        city: locCity,
        state: locState,
        jobType: jt,
        preferred_locations: prefLoc,
      });
      const newUser = { ...user };
      newUser.startCompleted = true;
      setUser((_) => newUser);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  const dataApi = useApi(false);
  const getStates = async (key) => {
    return await dataApi.post("/data/states", { key: key }).then((results) => {
      return results.map((name) => ({ label: name, value: name }));
    });
  };
  const getLocations = async (key) => {
    return await dataApi
      .post("/data/locations", { key: key, state: locState })
      .then((locations) => {
        return locations.map(({ name, _id }) => ({ label: name, value: _id }));
      });
  };
  const handleChange = (data) => {
    setPrefOg(data);
    let arr = [];
    data.forEach((item) => {
      arr.push(item.label);
    });
    setPrefLoc(arr);
  };
  const getDesignations = async (key) => {
    return await dataApi
      .post("/data/designations", { key: key })
      .then((results) => {
        return results.map(({ name }) => ({ label: name, value: name }));
      });
  };

  return (
    <div className="grid grid-cols-2">
      <div className="flex flex-col items-center justify-start">
        <div className="flex w-full justify-start ">
          <img src={logo} />
        </div>
        <div className="flex flex-col items-center mt-44 justify-center ">
          <div className="flex flex-col border-2 border-[#D5D3FF] justify-center items-center gap-6 w-100 p-5 rounded-3xl drop-shadow-md">
            <span className="text-2xl text-alt-blue-200 font-bold mt-4">
              Let’s create your Profile
            </span>
            <img src={profilepic} />
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className="flex flex-col gap-4 w-98 items-center justify-center">
                <div className="flex gap-4 w-98">
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      First name
                    </span>
                    <div className="flex w-full">
                      <input
                        className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="text"
                        id="first_name"
                        placeholder="First Name"
                        {...register("first_name")}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      Last name
                    </span>
                    <div className="flex w-full">
                      <input
                        className="w-full p-3 border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="text"
                        id="last_name"
                        placeholder="Last Name"
                        {...register("last_name")}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-98">
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">State</span>
                    <div className="flex w-full">
                      <AsyncSelect
                        {...reactSelectProps}
                        placeholder="Select..."
                        value={
                          locState ? { label: locState, value: locState } : null
                        }
                        defaultOptions
                        cacheOptions
                        loadOptions={getStates}
                        onChange={({ value }) => setLocState(value)}
                      />
                      {/* <select
                        className="w-full p-3 bg-white border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="text"
                        id="State"
                        placeholder="Email"
                      >
                        {states.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.text}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>
                  </div>
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">City</span>
                    <div className="flex w-full">
                      <Controller
                        name={"location"}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <AsyncSelect
                            key={locState}
                            {...reactSelectProps}
                            value={
                              locCity
                                ? { label: locCity, value: locCity }
                                : null
                            }
                            placeholder="Select..."
                            loadOptions={getLocations}
                            defaultOptions
                            onChange={({ label, value }) => {
                              console.log(label);
                              setLocCity(label), onChange(value);
                            }}
                            isDisabled={locState.length == 0}
                          />
                        )}
                      />
                      {/* <select
                        className="w-full p-3 bg-white border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="text"
                        id="city"
                        placeholder="Password"
                      >
                        {options.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.text}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-98">
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      Designation applying for*
                    </span>
                    <div className="flex w-full">
                      <Controller
                        name={"field"}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <AsyncSelect
                            {...reactSelectProps}
                            placeholder="Select designation"
                            value={dsg ? { label: dsg, value: dsg } : null}
                            loadOptions={getDesignations}
                            defaultOptions
                            cacheOptions
                            onChange={({ value }) => {
                              onChange(value), setDsg(value);
                            }}
                          />
                        )}
                      />
                      {/* <select
                        className="w-full p-3 bg-white border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="email"
                        id="email"
                        placeholder="Email"
                        value={""}
                      >
                        {options.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.text}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>
                  </div>
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      Job Type*
                    </span>
                    <div className="flex w-full">
                      <select
                        className="w-full p-3 bg-white  border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={jt}
                        onChange={(event) => {
                          setJt(event.target.value);
                        }}
                      >
                        {jobType.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.text}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 w-98">
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      Preferred Job Location*
                    </span>
                    <div className="flex w-full">
                      <Controller
                        name={"location"}
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <AsyncSelect
                            key={locState}
                            {...reactSelectProps}
                            value={prefOg}
                            placeholder="Select..."
                            loadOptions={getLocations}
                            isMulti
                            defaultOptions
                            onChange={handleChange}
                            isDisabled={locState.length == 0}
                          />
                        )}
                      />
                      {/* <select
                        className="w-full p-3 bg-white border border-[#95A5D2] rounded-lg focus:outline-none text-xs"
                        type="email"
                        id="email"
                        placeholder="Email"
                      >
                        {options.map((item) => {
                          return (
                            <option key={item.value} value={item.value}>
                              {item.text}
                            </option>
                          );
                        })}
                      </select> */}
                    </div>
                  </div>
                  <div className="flex flex-col w-98">
                    <span className="text-sm text-alt-grey-0 mb-2">
                      Current Salary*
                    </span>
                    <div className="flex w-full">
                      <div className="flex bg-[#F8F8FF] border-l border-t border-b rounded-l-lg w-12 border-[#95A5D2] items-center justify-center">
                        <FontAwesomeIcon
                          icon={faIndianRupeeSign}
                          className="text-xs"
                          color={"#A3AED0"}
                        />
                      </div>
                      <input
                        className="w-full p-3 border border-[#95A5D2] rounded-r-lg focus:outline-none text-xs"
                        type="number"
                        id="current_salary"
                        placeholder="Current Salary"
                        {...register("current_salary")}
                      />
                    </div>
                  </div>
                </div>
                {error ? (
                  <p className="my-1 text-center text-xs text-danger-default">
                    {error}
                  </p>
                ) : null}
                <button className="w-full bg-alt-purple-100 text-white px-6 py-2 rounded-md mb-8 mt-4">
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div>
        <img src={sideimg} className="" />
      </div>
    </div>
  );
};

export default CreateProfile;
