import React from "react";
import { useLocation } from "react-router-dom";
import NavBar from "./NavBar";
// import Redes from "../components/Redes"
const Layout = (props) => {
  const location = useLocation();
  const hideChrome = location.pathname === "/login";

  return (
    <>
      {!hideChrome && <NavBar />}
      {props.children}
      {/* {!hideChrome && <Redes />} */}
    </>
  );
};
export default Layout;
