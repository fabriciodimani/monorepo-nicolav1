import React from "react";
// import TableComandas from "../components/TableComandas";
import AppPreventaReactTable from "../table/AppPreventaReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Comandas = () => {
  return (
    <>
      <AppPreventaReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Comandas;
