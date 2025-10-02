import React from "react";
import AppCamionReactTable from "../table/AppCamionReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Camiones = () => {
  return (
    <>
      <AppCamionReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Camiones;
