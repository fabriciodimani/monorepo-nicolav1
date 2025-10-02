import React from "react";
// import TableComandas from "../components/TableComandas";
import AppComandaReactTable from "../table/AppComandaReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Comandas = () => {
  return (
    <>
      <AppComandaReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Comandas;
