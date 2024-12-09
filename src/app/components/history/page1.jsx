"use client";

import { useState, useEffect } from "react";
import Banner from "components/common/banner";
import { getCurrentUser, deleteHistoryHandSign } from "api/api";
import React from 'react';

export default function Page1() {
  const [user, setUser] = useState(null);
  const [historyResults, setHistoryResults] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(""); // Track delete status message
  const [searchQuery, setSearchQuery] = useState(""); // Track search query
  const [isLoading, setIsLoading] = useState(true); // Track loading state for fetching user

  const characterImages = {
    A: "/HMI_Lab/img-1.png",
    B: "/HMI_Lab/img-2.png",
    C: "/HMI_Lab/img-3.png",
    D: "/HMI_Lab/img-4.png",
    E: "/HMI_Lab/img-5.png",
    F: "/HMI_Lab/img-6.png",
    G: "/HMI_Lab/img-7.png",
    H: "/HMI_Lab/img-8.png",
    I: "/HMI_Lab/img-9.png",
    J: "/HMI_Lab/img-10.png",
    K: "/HMI_Lab/img-11.png",
    L: "/HMI_Lab/img-12.png",
    M: "/HMI_Lab/img-13.png",
    N: "/HMI_Lab/img-14.png",
    O: "/HMI_Lab/img-15.png",
    P: "/HMI_Lab/img-16.png",
    Q: "/HMI_Lab/img-17.png",
    R: "/HMI_Lab/img-18.png",
    S: "/HMI_Lab/img-19.png",
    T: "/HMI_Lab/img-20.png",
    U: "/HMI_Lab/img-21.png",
    V: "/HMI_Lab/img-22.png",
    W: "/HMI_Lab/img-23.png",
    X: "/HMI_Lab/img-24.png",
    Y: "/HMI_Lab/img-25.png",
    Z: "/HMI_Lab/img-26.png",
    1: "/HMI_Lab/img-27.png",
    2: "/HMI_Lab/img-28.png",
    3: "/HMI_Lab/img-29.png",
    4: "/HMI_Lab/img-30.png",
    5: "/HMI_Lab/img-31.png",
    6: "/HMI_Lab/img-32.png",
    7: "/HMI_Lab/img-33.png",
    8: "/HMI_Lab/img-34.png",
    9: "/HMI_Lab/img-35.png",
    0: "/HMI_Lab/img-36.png",
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
              images: entry.split('').map(char => characterImages[char] || "/images/placeholder.jpg")
            }));
            setHistoryResults(results);
          }
        })
        .catch((err) => {
          console.error("Error fetching user:", err);
        })
        .finally(() => {
          // setIsLoading(false); // Set loading to false after fetching
        });
    } else {
      // setIsLoading(false); // Set loading to false if no token
    }
  }, []);

  const handleDelete = async (handSignText, index) => {
    setLoadingIndex(index);
    const token = localStorage.getItem("token");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedUser = await deleteHistoryHandSign(handSignText, token);
      setHistoryResults(updatedUser.history_hand_sign.map((entry) => ({
        characters: entry,
        images: entry.split('').map(char => characterImages[char] || "/images/placeholder.jpg")
      })));
      setDeleteMessage("Delete successful!");
    } catch (error) {
      console.error("Error deleting hand sign:", error);
      setDeleteMessage("Failed to delete.");
    } finally {
      setLoadingIndex(null);
      setTimeout(() => setDeleteMessage(""), 3000); // Clear message after 3 seconds
    }
  };

  // Filter history results based on search query
  const filteredResults = historyResults.filter(result =>
    result.characters.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Banner label="History">
        <img src="/images/translation_banner.png" alt="" />
      </Banner>
      <div className="flex mt-10 items-center px-4 border-[1px] border-[#777e9066] rounded-md overflow-hidden w-[340px]">
        <img src="/images/search-icon-2.svg" alt="" className="size-6" />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search your history"
          className="mr-auto py-2 pl-[14px] border-none outline-none placeholder:text-[14px] placeholder:font-[700] placeholder:text-[#00000066]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <div className="mt-10">
        <h3 className="text-lg font-semibold">History Results</h3>
        <p className="mt-2 text-sm text-gray-600">
          Once deleted, result can't be reverted again.
        </p>
        {deleteMessage && (
          <p
            className={`mt-2 text-sm ${
              deleteMessage.includes("successful")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {deleteMessage}
          </p>
        )}
        {filteredResults.length === 0 ? (
          <div className="mt-4 text-center text-gray-500">
            No history results found.
          </div>
        ) : (
          <ul>
            {filteredResults.map((result, index) => (
              <li
                key={index}
                className="mt-2 border border-gray-300 p-4 rounded"
              >
                <p className="text-lg font-medium">
                  Detected Characters: {result.characters}
                </p>

                <p className="mt-2 text-lg font-medium">Step to do:</p>
                <div className="flex flex-wrap mt-2">
                  {result.images.map((imgSrc, imgIndex) => (
                    <div key={imgIndex} className="inline-block mr-2 mb-2">
                      <img src={imgSrc} alt="" className="inline-block" />
                    </div>
                  ))}
                </div>
                <div className="flex mt-4">
                  <button
                    onClick={() => handleDelete(result.characters, index)}
                    className={`p-1 text-white rounded ${
                      loadingIndex === index ? "bg-gray-500" : "bg-red-500"
                    }`}
                    disabled={loadingIndex === index}
                  >
                    {loadingIndex === index ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
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
