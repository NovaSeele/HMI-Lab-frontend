"use client";

import { useState } from "react";
import { signup } from "api/api"; // Import the signup API function
import { useRouter } from "next/navigation";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [full_name, setFull_name] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent page reload
    const userData = {
      email: email,
      username: username,
      full_name: full_name,
      password: password,
    };

    try {
      const response = await signup(userData); // Call the signup function
      if (response) {
        setError(""); // Clear any previous error message
        setSuccess("Signed up successfully!"); // Set success message
        console.log("Response:", response);
        setTimeout(() => {
          router.push("/login"); // back to login page
        }, 2000); // 2 seconds
      }

      //handle wrong password or email
      if (!response) {
        setError("Failed to signup. Please check your emails or password.");
      }
    } catch (err) {
      setError("Failed to signup. Please check your credentials.");
      console.log(err);
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);
    console.log("Email:", emailValue);
  };

  const handleUsernameChange = (e) => {
    const usernameValue = e.target.value;
    setUsername(usernameValue);
    console.log("Username:", usernameValue);
  };

  const handleFull_nameChange = (e) => {
    const full_nameValue = e.target.value;
    setFull_name(full_nameValue);
    console.log("Full Name:", full_nameValue);
  };

  const handlePasswordChange = (e) => {
    const passwordValue = e.target.value;
    setPassword(passwordValue);
    console.log("Password:", passwordValue);
  };

  return (
    // <div className="flex min-h-full flex-1">
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <img
              alt="Your Company"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              className="h-10 w-auto"
            />
            <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Signup
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Start a 14 day free trial
              </a>
            </p>
          </div>

          <div className="mt-6"> {/* mt-10 */}
            <div>
              <form onSubmit={handleSignup} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={handleEmailChange}
                      className="pl-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Username
                  </label>
                  <div className="mt-2">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      autoComplete="username"
                      value={username}
                      onChange={handleUsernameChange}
                      className="pl-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="full_name"
                      name="full_name"
                      type="text"
                      required
                      autoComplete="full_name"
                      value={full_name}
                      onChange={handleFull_nameChange}
                      className="pl-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={handlePasswordChange}
                      className="pl-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                {/* <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Confirm Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      autoComplete="current-password"
                      className="pl-4 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div> */}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-3 block text-sm leading-6 text-gray-700"
                    >
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm leading-6">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {error && (
                    <div className="text-red-600 text-sm font-semibold">
                      {error}
                    </div>
                  )}
                  {success && (
                    <div className="text-green-600 text-sm font-semibold">
                      {success}
                    </div>
                  )}
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="relative hidden w-0 flex-1 lg:block">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1908&q=80"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div> */}
    </div>
  );
}
