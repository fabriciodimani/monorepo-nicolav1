import React from "react";
// import TableComandas from "../components/TableComandas";
import AppRemitoReactTable from "../table/AppRemitoReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Remitos = () => {
  return (
    <>
      <AppRemitoReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Remitos;
