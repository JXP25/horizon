"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CREATE_USER } from "@/graphql/mutation/user";
import { useMutation, useLazyQuery } from "@apollo/client";
import Cookies from "js-cookie";
import { v4 as uuidv4 } from "uuid";
import { AnimatePresence, motion } from "framer-motion";
import {} from "@/graphql/query/user";
import { GET_USER_TOKEN } from "@/graphql/query/user";

export default function SignInForm(onSubmit: { onSubmit: () => void }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value) ? "" : "Invalid email format",
      }));
    }

    if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value)
          ? ""
          : "Password must be at least 8 characters",
      }));
    }
  };

  const [createUser] = useMutation(CREATE_USER);

  const handleGuestLogin = async () => {
    const guestUser = {
      firstName: "Guest",
      lastName: "User",
      email: `guest-${uuidv4()}@example.com`,
      password: `guest-${Math.random().toString(36).slice(-8)}`,
    };

    try {
      const { data } = await createUser({
        variables: {
          firstName: guestUser.firstName,
          lastName: guestUser.lastName,
          email: guestUser.email,
          password: guestUser.password,
        },
      });

      Cookies.set("token", data.createUser, { expires: 7 });

      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      toast.success("Registration successful");

      onSubmit.onSubmit();
    } catch (error: any) {}
  };

  const [signUp, setSignUp] = useState(true);
  const toggleSignUp = () => {
    setSignUp(!signUp);
  };

  const [getUser, { data, error }] = useLazyQuery(GET_USER_TOKEN);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    getUser({
      variables: {
        email: formData.email,
        password: formData.password,
      },
    });
  };

  useEffect(() => {
    if (data && data.getUserToken) {
      Cookies.set("token", data.getUserToken, { expires: 7 });
      console.log("Login success:", data.getUserToken);
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      toast.success("Login successful");
      onSubmit.onSubmit();
    }

    if (error) {
      console.error("Login error:", error);
      toast.error("Login failed");
    }
  }, [data, error, onSubmit]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email");
      return;
    }

    if (!validatePassword(formData.password)) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    try {
      const { data } = await createUser({
        variables: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
        },
      });

      Cookies.set("token", data.createUser, { expires: 7 });

      console.log("Registration success:", data.createUser);

      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      toast.success("Registration successful");

      onSubmit.onSubmit();
    } catch (error: any) {}
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute z-10 flex justify-center p-5 font-orbitron text-white   bg-lit  border border-white/10 rounded-3xl flex-col items-center gap-4  "
      >
        {signUp ? (
          <>
            <form
              onSubmit={handleSignIn}
              style={{
                width: "400px",
              }}
              className="space-y-8"
            >
              <div className=" font-orbitron text-[3rem] text-center text-white">
                {"Maps "}
                <span className=" text-[0.8rem] tracking-widest">
                  {" "}
                  by vector
                </span>
              </div>

              <div className="flex flex-row justify-between gap-4">
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First Name"
                  className={`w-full bg-black rounded-full ${
                    formData.firstName ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  autoFocus
                />

                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last Name"
                  className={`w-full bg-black rounded-full ${
                    formData.lastName ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className={`w-full bg-black rounded-full ${
                    formData.email ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-[0.8rem] mt-1 pl-6">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={`w-full bg-black rounded-full ${
                    formData.password ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-[0.8rem] mt-1 pl-6">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full font-orbitron py-4 rounded-full bg-neutral-700 hover:bg-white transition duration-200 font-semibold text-black"
              >
                Register
              </button>
            </form>
            <div className="w-full flex justify-around items-center gap-4 mt-3 mb-1">
              <span className="w-full rounded-full h-[1px] bg-white/60"></span>
              <span className=" uppercase text-[0.6rem] tracking-widest">
                OR
              </span>
              <span className="w-full h-[1px] rounded-full bg-white/60"></span>
            </div>

            <div className="flex flex-row justify-between gap-4 w-full px-2">
              <button
                className=" uppercase text-[0.8rem] tracking-widest text-center"
                onClick={handleGuestLogin}
              >
                {"Guest Mode"}
              </button>

              <button
                className=" uppercase text-[0.8rem] tracking-widest text-center"
                onClick={toggleSignUp}
              >
                {"Login Now"}
              </button>
            </div>
          </>
        ) : (
          <>
            <form
              onSubmit={handleLogin}
              style={{
                width: "400px",
              }}
              className="space-y-8"
            >
              <div className=" font-orbitron text-[3rem] text-center text-white">
                {"Maps "}
                <span className=" text-[0.8rem] tracking-widest">
                  {" "}
                  by vector
                </span>
              </div>

              <div className="flex flex-col">
                <input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  className={`w-full bg-black rounded-full ${
                    formData.email ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {errors.email && (
                  <span className="text-red-500 text-[0.8rem] mt-1 pl-6">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col">
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="Password"
                  className={`w-full bg-black rounded-full ${
                    formData.password ? "font-poppins" : ""
                  }  p-4 text-md border-0 focus:ring-1 focus:ring-gray-400 placeholder:text-gray-600`}
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                {errors.password && (
                  <span className="text-red-500 text-[0.8rem] mt-1 pl-6">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                className="w-full font-orbitron py-4 rounded-full bg-neutral-700 hover:bg-white transition duration-200 font-semibold text-black"
              >
                Login
              </button>
            </form>
            <div className="w-full flex justify-around items-center gap-4 mt-3 mb-1">
              <span className="w-full rounded-full h-[1px] bg-white/60"></span>
              <span className=" uppercase text-[0.6rem] tracking-widest">
                OR
              </span>
              <span className="w-full h-[1px] rounded-full bg-white/60"></span>
            </div>

            <div className="flex flex-row justify-between gap-4 w-full px-2">
              <button
                className=" uppercase text-[0.8rem] tracking-widest text-center"
                onClick={handleGuestLogin}
              >
                {"Guest Mode"}
              </button>

              <button
                className=" uppercase text-[0.8rem] tracking-widest text-center"
                onClick={toggleSignUp}
              >
                {"Sign Up"}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </>
  );
}
