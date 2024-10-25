"use client";

import { useState, useEffect } from "react";
import Banner from "components/common/banner";
import { getCurrentUser, deleteHistoryHandSign } from "api/api";
import React from "react";

export default function Page1() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Track loading state for fetching user

  const characterImages = {
    A: "/alphabet/a_small.jpg",
    B: "/alphabet/b_small.jpg",
    C: "/alphabet/c_small.jpg",
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser(token)
        .then((data) => {
          setUser(data);
          if (data.history_hand_sign) {
            const results = data.history_hand_sign.map((entry) => ({
              characters: entry,
              images: entry
                .split("")
                .map(
                  (char) => characterImages[char] || "/images/placeholder.jpg"
                ),
            }));
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        })
        .finally(() => {
        //   setIsLoading(false); // Set loading to false after fetching
        });
    } else {
      // setIsLoading(false); // Set loading to false if no token
    }
  }, []);


  return (
    <div>
      <Banner label="History">
        <img src="/images/translation_banner.png" alt="" />
      </Banner>
      <div className="mt-10">
        <h3 className="text-lg font-semibold">Instructions how to use sign language</h3>
        <p className="mt-2 text-sm text-gray-600">
          Follow the images below to learn sign language:
        </p>
      </div>
      <div className="mt-10 flex justify-center">
        <img src="/images/sign_language_table.jpg" alt="" />
      </div>
      {/* {isLoading && (
        <div className="fixed h-[100vh] inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#F37B8F]"></div>
            <p className="mt-3 text-[#F37B8F] font-semibold">Loading...</p>
          </div>
        </div>
      )} */}
    </div>
  );
}
