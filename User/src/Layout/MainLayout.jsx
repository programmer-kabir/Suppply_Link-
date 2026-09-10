import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/share/Navbar";
import Footer from "../components/share/Footer";

const MainLayout = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
