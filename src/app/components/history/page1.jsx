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
    "A": "/alphabet/a_small.jpg",
    "B": "/alphabet/b_small.jpg",
    "C": "/alphabet/c_small.jpg",
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
