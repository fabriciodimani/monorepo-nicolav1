
import React from 'react'
import { useState, useEffect }  from 'react';
import axios from 'axios';

const Calculateroutes = () => {

    const [dato, setDato] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        axios
          .get("https://maps.googleapis.com/maps/api/distancematrix/json?origins=-26.860128+-65.21991&destinations=-26.928437054693628+-65.3321522736327|Tucuman+Monteros|Tucuman+Concepcion&mode=driving&language=sp-SP&key=AIzaSyDs7CcTIstu9N4pm0joa3z4Tk_Zm6cJ754")
          .then((res) => {
            setDato(res);
            setLoading (false);
          })
          .catch((err) => console.log(err));
          
      }, []);    

       if (!loading) console.log(dato.data.rows[0].elements[0].distance.value);


  return (
    <> 
    {!loading && <h1> {dato.data.rows[0].elements[0].distance.value} </h1> }
     </>
  )
}

export default Calculateroutes