import React, { MouseEventHandler } from "react";
import { BiSearch } from "react-icons/bi";
import { useState } from "react";
import { useRouter } from "next/router";

function Filter() {
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  function inputChange(e: { target: { value: string } }) {
    router.replace(
      {
        pathname: "",
        query: { ...router.query, search: e.target.value },
      },
      undefined,
      { shallow: true }
    );
  }

  function regionChange(region: string) {
    router.replace(
      {
        pathname: "",
        query: { ...router.query, region: region },
      },
      undefined,
      { shallow: true }
    );
  }

  function clearRegion() {
    router.replace(
      {
        pathname: "",
        query: { ...router.query, region: null },
      },
      undefined,
      { shallow: true }
    );
  }

  function DropDownItem(props: {
    name: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }) {
    return (
      <button className=" p-1" onClick={props.onClick}>
        {props.name}
      </button>
    );
  }

  return (
    <div className=" flex  w-full flex-col items-center justify-between sm:flex-row 2xl:px-28">
      <div className="dark:dark-element light-element flex w-full items-center rounded-sm p-3 shadow-md shadow-gray-200 dark:shadow-gray-700 sm:w-2/5 ">
        <BiSearch />
        <input
          type="text"
          onChange={(e) => inputChange(e)}
          defaultValue={router.query.search}
          placeholder={"Search country"}
          className=" ml-2  w-full bg-transparent outline-none  "
        />
      </div>

      <div className="relative min-w-fit sm:mt-0 sm:w-[12%]">
        <button
          onClick={() => setShowDropdown((prevDropdown) => !prevDropdown)}
          className="dark:dark-element light-element mt-5 w-full  rounded-sm p-3 px-5 shadow-md shadow-gray-200 dark:shadow-gray-700 "
        >
          Select by region:
        </button>

        {showDropdown ? (
          <div
            className="dark:dark-element light-element absolute  z-10 mt-5 flex w-full flex-col items-start
            rounded-sm p-3 px-5 shadow-md  shadow-gray-200  dark:shadow-gray-700  "
          >
            <DropDownItem name="All" onClick={clearRegion} />

            <DropDownItem
              name="Africa"
              onClick={() => regionChange("Africa")}
            />

            <DropDownItem
              name="Americas"
              onClick={() => regionChange("Americas")}
            />

            <DropDownItem name="Asia" onClick={() => regionChange("Asia")} />

            <DropDownItem
              name="Europe"
              onClick={() => regionChange("Europe")}
            />

            <DropDownItem
              name="Oceania"
              onClick={() => regionChange("Oceania")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Filter;
