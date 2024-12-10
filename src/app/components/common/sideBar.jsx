"use client";

import { useState, useEffect, useRef } from "react";
import { getCurrentUser, uploadAvatar } from "api/api";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

export default function SideBar({ isVisible, toggleSidebar }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [token, setToken] = useState(" ");
  const fileInputRef = useRef(null);
  const pathname = usePathname();
  const [tabId, setTabId] = useState(pathname);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          setUser(data);
        })
        .catch((err) => {
          console.error(err);
        });
    }
    if (file) {
      handleUpload();
    }
  }, [file]);

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file && token) {
      try {
        const updatedUser = await uploadAvatar(file, token);
        console.log("Avatar uploaded successfully:", updatedUser);
        setUser((prevUser) => ({
          ...prevUser,
          avatar: updatedUser.avatar,
        }));
      } catch (error) {
        console.error("Error uploading avatar:", error.message);
      }
    } else {
      console.error("No file selected or token missing.");
    }
  };

  const userGuest = {
    full_name: "Guest",
    username: "guest",
    avatar: "/images/guest_icon.png",
  };

  const currentUser = {
    ...userGuest,
    ...user,
    avatar: user?.avatar || userGuest.avatar,
  };

  return (
    <div
      className={`fixed w-[320px]  pr-[20px] pb-[80px] transition-transform duration-300 ${
        isVisible ? "translate-x-0" : "-translate-x-full -ml-[20px]"
      }`}
    >
      {/* Toggle Button */}
      {/* <button
        onClick={toggleSidebar}
        className="absolute right-[-8px] top-0 mt-2 bg-[#ffcccb] text-red-500 w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:bg-red-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#4A5568] transition duration-300 ease-in-out"
      >
        <span className={`transform ${isVisible ? "rotate-180" : ""}`}>
          ➔
        </span>
      </button> */}

      {/* User part */}
      <div className="flex gap-4">
        <div>
          <button onClick={triggerFileInput} className="p-0">
            <img
              src={currentUser.avatar}
              alt="user profile image"
              className="w-[50px] h-[50px] rounded-full object-cover"
            />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
        </div>
        <div className="flex flex-col justify-evenly">
          <span className="text-black text-base font-bold">
            {currentUser.full_name}
          </span>
          <span className="text-black opacity-45">@{currentUser.username}</span>
        </div>
      </div>
      {/* features */}
      <div className="flex flex-col gap-[10px] mt-[42px]">
        <strong className="text-black text-base font-[700]">Features</strong>
        <ul className="flex flex-col gap-[10px] *:text-base *:text-black *:transition-all *:duration-300 *:font-[400] *:flex *:items-center *:gap-3 *:p-4 *:rounded-md hover:*:bg-slate-200">
          <a href="/" className={tabId === "/" && "selected_item_sidebar"}>
            <div className="min-w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="19"
                viewBox="0 0 20 19"
                fill="none"
              >
                <g clipPath="url(#clip0_4680_38)">
                  <path
                    d="M6.88068 12.3265C6.63727 12.3265 6.44148 12.1209 6.44148 11.8673C6.44148 11.6137 6.63903 11.408 6.88068 11.408H9.28477C9.52818 11.408 9.72396 11.6137 9.72396 11.8673C9.72396 12.1209 9.52641 12.3265 9.28477 12.3265H6.88068ZM15.1089 10.4231C16.46 10.4231 17.6823 10.9024 18.5678 11.6786C19.4532 12.4548 20 13.5264 20 14.7108C20 15.8952 19.4532 16.9667 18.5678 17.7429C17.6823 18.5191 16.46 18.9985 15.1089 18.9985C13.7578 18.9985 12.5355 18.5191 11.6501 17.7429C10.7646 16.9667 10.2178 15.8952 10.2178 14.7108C10.2178 13.5264 10.7646 12.4548 11.6501 11.6786C12.5355 10.9024 13.7578 10.4231 15.1089 10.4231ZM14.735 12.7053C14.735 12.4935 14.9308 12.3219 15.1724 12.3219C15.4141 12.3219 15.6098 12.4935 15.6098 12.7053V14.703L17.3137 15.5875C17.5218 15.6942 17.5906 15.9292 17.4671 16.1117C17.3454 16.2941 17.0773 16.3544 16.8692 16.2462L14.9731 15.2612C14.832 15.1978 14.735 15.0695 14.735 14.9195V12.7053ZM17.9504 12.2214C17.2237 11.5843 16.2184 11.19 15.1089 11.19C13.9995 11.19 12.9941 11.5843 12.2674 12.2214C11.5407 12.8584 11.0909 13.7397 11.0909 14.7123C11.0909 15.6849 11.5407 16.5662 12.2674 17.2033C12.9941 17.8403 13.9995 18.2346 15.1089 18.2346C16.2184 18.2346 17.2237 17.8403 17.9504 17.2033C18.6771 16.5662 19.1269 15.6849 19.1269 14.7123C19.1269 13.7397 18.6771 12.8584 17.9504 12.2214ZM7.77846 16.9992C8.06773 16.9992 8.30232 17.2048 8.30232 17.4584C8.30232 17.712 8.06773 17.9176 7.77846 17.9176H1.22057C0.88544 17.9176 0.580298 17.797 0.358056 17.6038C0.137578 17.4105 0 17.143 0 16.8492V1.06999C0 0.774658 0.137578 0.508708 0.358056 0.313883C0.578534 0.120605 0.883676 0 1.22057 0H16.1954C16.5306 0 16.8357 0.120605 17.0579 0.313883C17.2784 0.507161 17.416 0.774658 17.416 1.06999V8.38053C17.416 8.63412 17.1814 8.83976 16.8921 8.83976C16.6029 8.83976 16.3683 8.63412 16.3683 8.38053V1.06999C16.3683 1.02979 16.3489 0.992676 16.3171 0.964844C16.2854 0.937012 16.2431 0.920003 16.1972 0.920003H1.22057C1.17471 0.920003 1.13061 0.937012 1.10063 0.964844C1.06711 0.99113 1.04771 1.02824 1.04771 1.06999V16.8492C1.04771 16.8894 1.06711 16.9281 1.09886 16.9543C1.13061 16.9822 1.17294 16.9992 1.2188 16.9992H7.77846ZM3.37243 11.2086H4.68648C4.78173 11.2086 4.85933 11.2766 4.85933 11.3601V12.512C4.85933 12.5955 4.78173 12.6636 4.68648 12.6636H3.37243C3.27718 12.6636 3.19958 12.5955 3.19958 12.512V11.3601C3.20134 11.2751 3.27895 11.2086 3.37243 11.2086ZM3.37243 3.32284H4.68648C4.78173 3.32284 4.85933 3.39087 4.85933 3.47437V4.6263C4.85933 4.7098 4.78173 4.77783 4.68648 4.77783H3.37243C3.27718 4.77783 3.19958 4.7098 3.19958 4.6263V3.47437C3.20134 3.39087 3.27895 3.32284 3.37243 3.32284ZM6.88068 4.44076C6.63727 4.44076 6.44148 4.23511 6.44148 3.98153C6.44148 3.72795 6.63903 3.5223 6.88068 3.5223H13.1352C13.3786 3.5223 13.5744 3.72795 13.5744 3.98153C13.5744 4.23511 13.3768 4.44076 13.1352 4.44076H6.88068ZM3.9104 8.6805C3.79751 8.75936 3.63524 8.73926 3.52059 8.64185C3.50825 8.63412 3.4959 8.62484 3.48355 8.61401L2.93324 8.11613C2.81859 8.01099 2.84505 7.83626 2.99321 7.72494C3.14137 7.61361 3.35479 7.60742 3.47121 7.71257L3.77106 7.98315L4.73587 7.30282C4.86463 7.21159 5.06217 7.25179 5.17506 7.39095C5.28794 7.53011 5.27383 7.7172 5.14507 7.80843L3.9104 8.6805ZM6.59141 8.29549C6.348 8.29549 6.15222 8.08984 6.15222 7.83626C6.15222 7.58268 6.34977 7.37703 6.59141 7.37703H12.8459C13.0893 7.37703 13.2851 7.58268 13.2851 7.83626C13.2851 8.08984 13.0876 8.29549 12.8459 8.29549H6.59141Z"
                    fill={tabId === "/" ? "red" : "black"}
                  />
                </g>
                <defs>
                  <clipPath id="clip0_4680_38">
                    <rect width="20" height="19" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <span>Hand Sign</span>
          </a>
          <a
            href="/text_to_sign"
            className={tabId === "/text_to_sign" && "selected_item_sidebar"}
          >
            <div className="min-w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M2 10H18M10 2V10M10 10V18"
                  stroke={tabId === "/text_to_sign" ? "red" : "#4A5568"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>Text to Sign</span>
          </a>
          <a
            href="/voice_to_sign"
            className={tabId === "/voice_to_sign" && "selected_item_sidebar"}
          >
            <div className="min-w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M10 2C6.47715 2 3 5.47715 3 10s3.47715 8 8 8 8-3.47715 8-8S13.5228 2 10 2zm0 16a8 8 0 100-16 8 8 0 000 16zm0-14a6 6 0 100 12 6 6 0 000-12zm0 12a2 2 0 100-4 2 2 0 000 4zm0-6a4 4 0 100 8 4 4 0 000-8z"
                  fill={tabId === "/voice_to_sign" ? "red" : "#4A5568"}
                />
              </svg>
            </div>
            <span>Voice to Sign</span>
          </a>
          <a
            href="/history"
            className={tabId === "/history" && "selected_item_sidebar"}
          >
            <div className="min-w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M1 3H13M7 1V3M8.0482 12.5C6.52083 10.9178 5.28073 9.0565 4.41187 7M10.5 16H17.5M9 19L14 9L19 19M10.7511 3C9.7831 8.7702 6.06969 13.6095 1 16.129"
                  stroke={tabId === "/history" ? "red" : "#4A5568"}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>History</span>
          </a>
          <a
            href="/instructions"
            className={tabId === "/instructions" && "selected_item_sidebar"}
          >
            <div className="min-w-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 30 30"
                fill="none"
                className="-translate-x-1"
              >
                <path
                  d="M22.948 12.8421C22.485 12.5803 22.0421 12.2984 21.5188 11.9965C22.0421 11.6744 22.5255 11.3925 22.9885 11.1307C25.1424 9.96304 26.3302 7.58783 25.9676 5.1721C25.4441 1.20671 20.8744 -1.08783 17.4122 0.884659C13.8693 2.91807 10.3264 4.91097 6.82364 7.00431C4.04569 8.67516 3.64296 10.8894 4.08587 13.5063C4.36775 15.137 5.45475 16.3445 6.8839 17.17C7.38707 17.4519 7.87015 17.7338 8.41382 18.0558C7.80989 18.4181 7.26655 18.7401 6.6827 19.0421C4.10595 20.6728 3.22015 24.0141 4.66971 26.7117C6.19962 29.5503 9.74253 30.6373 12.5807 29.1074C15.6406 27.3763 18.7004 25.6046 21.7401 23.8334C22.4649 23.4105 23.2299 23.0282 23.874 22.5046C27.1149 19.807 26.6318 14.9157 22.948 12.8421ZM12.1382 19.4448V10.648L19.7476 15.0365L12.1382 19.4448Z"
                  fill={tabId === "/instructions" ? "red" : "black"}
                />
              </svg>
            </div>
            <span>Instructions</span>
          </a>
        </ul>
      </div>
      {/* About */}
      <div className="flex flex-col gap-[10px] mt-[42px]">
        <strong className="text-black text-base font-[700]">About</strong>
        <ul className="flex flex-col gap-[10px] *:text-base *:font-[400] *:text-slate-600">
          <li>Developed by Nhóm 1</li>
          <li>Product name: HMI Lab - Sign Language Detection</li>
          <li>
            Copyright © 2024 Nhóm 1 - Tương Tác Người Máy. All rights reserved.
          </li>
          {/* <li>Members:</li>
          <li>Nguyễn Hoàng Anh Dũng</li>
          <li>Nguyễn Huy Minh</li>
          <li>Kiều Đức Long</li>
          <li>Hoàng Minh Đức</li>
          <li>Nguyễn Huy Tú</li> */}
        </ul>
      </div>
    </div>
  );
}