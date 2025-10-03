import React from "react";
import NavBar, { NAVBAR_LAYOUTS } from "./NavBar";
// import Redes from "../components/Redes"

const Layout = ({ children, navLayout = NAVBAR_LAYOUTS.HORIZONTAL }) => {
  return (
    <>
      <NavBar layout={navLayout} />
      {children}
      {/* <Redes /> */}
    </>
  );
};

export { NAVBAR_LAYOUTS };
export default Layout;
