import React from "react";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="pt-20"> 
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;
