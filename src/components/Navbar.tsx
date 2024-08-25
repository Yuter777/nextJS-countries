"use client";
import React from "react";
import { MdDarkMode } from "react-icons/md";

import { useTheme } from "next-themes";
import Link from "next/link";

function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="dark:dark-element  light-element flex items-center justify-between p-5 shadow-md shadow-gray-200 dark:shadow-gray-700  xl:px-10 ">
      <Link href="/" className="text-xl font-bold xl:text-2xl">
        Where in the world?
      </Link>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="flex cursor-pointer select-none  items-center  gap-1 active:scale-95"
      >
        <MdDarkMode /> Change theme
      </button>
    </div>
  );
}

export default Navbar;
