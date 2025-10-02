import React from "react";
import Comanda from "../components/Comanda";
import GetDataInvoice from "../report/GetDataInvoice";
import GetNrodeComanda from "../components/GetNrodeComanda";
import Footer from "../components/Footer";

// import "../css/empresa.css";
import "../css/footer.css";

const Comandas = () => {
  return (
    <>
      {/* <GetNrodeComanda /> */}
      <Comanda />
      <GetDataInvoice />
      <Footer />
    </>
  );
};

export default Comandas;
