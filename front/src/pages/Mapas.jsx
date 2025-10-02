import React, { Component } from 'react';
import { render } from 'react-dom';
import { LoadScript } from '@react-google-maps/api';
import { Map , Calculateroutes } from '../Maps';


// import './style.css';

// const key = ''; // PUT GMAP API KEY HERE
class Mapa extends React.Component {
  render() {
    return (
      <LoadScript googleMapsApiKey={'AIzaSyDs7CcTIstu9N4pm0joa3z4Tk_Zm6cJ754'}>
      {/* <Calculateroutes /> */}
        <Map />
      </LoadScript>
    );
  }
}

render(<Mapa />, document.getElementById('root'));

export default Mapa;


// import React from "react";
// import Remito from "../components/Remito";
// // import GetDataInvoice from "../report/GetDataInvoice";
// // import GetNrodeComanda from "../components/GetNrodeComanda";
// import Footer from "../components/Footer";
// import "../css/footer.css";

// const Remitos = () => {
//   return (
//     <>
//       {/* <GetNrodeComanda /> */}
//       <Remito />
//       {/* <GetDataInvoice /> */}
//       <Footer />
//     </>
//   );
// };

// export default Remitos;
