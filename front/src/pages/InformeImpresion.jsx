import React from "react";
// import TableComandas from "../components/TableComandas";
import AppImpresionReactTable from "../table/AppImpresionReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Comandas = () => {
  return (
    <>
      <AppImpresionReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Comandas;
