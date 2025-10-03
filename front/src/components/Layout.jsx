import React, { useContext, useEffect } from "react";
import NavBar from "./NavBar";
// import Redes from "../components/Redes"
import { ThemeContext } from "../Context/ThemeContext";

const Layout = (props) => {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.dataset.theme = theme;
      return () => {
        document.body.dataset.theme = "";
      };
    }
  }, [theme]);

  return (
    <div className={`app-shell ${theme}`}>
      <NavBar />
      {props.children}
      {/* <Redes /> */}
    </div>
  );
};

export default Layout;
