"use client";

import Page1 from "components/voice_to_sign/page1";

import { useState } from "react";

export default function VoiceToSignPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState({});

  const onChangePage = (page, data) => {
    setCurrentPage(page);
    setData(data);
  };

  function getPage(currentPage) {
    if (currentPage === 1) {
      return <Page1 onChangePage={onChangePage} />;
    }
  }

  return getPage(currentPage);
}
