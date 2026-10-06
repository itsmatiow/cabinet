import React from "react";
import Select from "./Select";
import { useSearchParams } from "react-router-dom";

export default function SortBy({ options }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || ""; // Default to the first option if no sort is set

  function handleChange(e) {
    const selectedValue = e.target.value;

    searchParams.set("sortBy", selectedValue);
    setSearchParams(searchParams);
    // window.history.replaceState(null, "", `?${searchParams.toString()}`);
  }
  return (
    <Select
      options={options}
      value={sortBy}
      type="white"
      onChange={handleChange}
    />
  );
}
