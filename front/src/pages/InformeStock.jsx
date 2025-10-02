import React from "react";
// import TableComandas from "../components/TableComandas";
import AppMovStockReactTable from "../table/AppMovStockReactTable";

import Footer from "../components/Footer";

import "../css/footer.css";

const Stock = () => {
  return (
    <>
      <AppMovStockReactTable />
      {/* <TableComandas /> */}
      <Footer />
    </>
  );
};

export default Stock;
