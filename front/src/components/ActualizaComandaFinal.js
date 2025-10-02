import React, { useState, useEffect } from "react";
import { getUltimacomandas } from "../helpers/rutaUltimacomandas";
import { addUltimacomanda } from "../helpers/rutaUltimacomandas";

function ActualizaComandaFinal() {

    const [ultimacomandas, setUltimacomandas] = useState({
      nrodecomanda:"",
      
    });
       useEffect(() => {
        addUltimacomanda(ultimacomandas).then((resp) => {
            setUltimacomandas({
                nrodecomanda: 181,
              
          });
        });
        }, []);
 
return  ultimacomandas

    }

export default ActualizaComandaFinal;
    

    // addComanda(inputFields[i]).then((resp) => {
        //     setInputFields({
        //       ...inputFields[i],
        //       [e.target.name]: e.target.value,
        //     });
        //     console.log("ADD COMANDA RESP", resp);
        //     // debugger;
        //   });
          
        //    let ult= ultimacomandas[ultimacomandas.length-1]
        //     setUltimacomandas(ult)

         // useEffect(() => {
      //   addUltimacomanda(ultimacomandas).then((resp) => {
      //       setUltimacomandas({
      //         nrodecomanda: 1,
      //         usuario:"",
              
      //       });
      //       console.log("ADD ULTIMA COMANDA RESP", resp);
      //       // debugger;
      //     });
      // }, []);


      // if (nrodecomanda!==null) {

      //     // actualizo el nro de comanda en la base

      //     addUltimacomanda(ultimacomandas).then((resp) => {
      //       setUltimacomandas({
      //         nrodecomanda: nrodecomanda+1,
      //         //usuario:"",
              
      //       });
      //       console.log("ADD ULTIMA COMANDA RESP", resp);
      //       // debugger;
      //     });

      // } 

      
          // actualizo el nro de comanda en la base

          // addUltimacomanda(ultimacomandas).then((resp) => {
          //   setUltimacomandas({
          //     nrodecomanda: 1,
          //     usuario:"",
              
          //   });
          //   // console.log("ADD ULTIMA COMANDA RESP", resp);
          //   // debugger;
          // });
        