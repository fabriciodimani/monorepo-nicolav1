/* eslint-disable react-hooks/rules-of-hooks */
/*global google*/
// import ReactDOM from 'react-dom';
import React from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import axios from 'axios';
// import routes from '../routes2.json';

const defaultLocation = { lat: -26.860128, lng: -65.21991 };
let directionsService;
var routesAux = [];
var routes = [];

class Map extends React.Component {
  state = {
    directions: null,
    bounds: null,
    clientes: [],
  };


  componentDidMount() {
    axios.get("http://localhost:3004/comandaspreparadas")
      .then(res => {
        const clientes = res.data;
        this.setState({ clientes });
      })
  }

  onMapLoad = (map) => {

    directionsService = new google.maps.DirectionsService();
    
    const routesCopy = routes.map((route) => {
      return {
        location: { lat: route.location.lat, lng: route.location.lng },
        stopover: true,
      };
    });

    const origin =
      routesCopy.length === 1
        ? new google.maps.LatLng(
          routesCopy[0].location.lat,
          routesCopy[0].location.lng
        )
        : routesCopy.shift().location;
    const destination =
      routesCopy.length === 1
        ? new google.maps.LatLng(
          routesCopy[0].location.lat,
          routesCopy[0].location.lng
        )
        : routesCopy.pop().location;
    //put all the remaining coordinates in waypoints after(pop and shift)
    const waypoints = routesCopy;

    // console.log(origin, destination, waypoints);
    //call getDirection function
    this.getDirection(origin, destination, waypoints);
    //*

    navigator.geolocation.getCurrentPosition(function (position) {
      
      var geolocate = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      // var geolocate2 = new google.maps.LatLng(-26.860128, -65.21991);
      
      // new google.maps.InfoWindow({
      //   map: map,
      //   visible: false,
      //   position: geolocate2,
      //   content: ' ORIGEN ',
        
      // })
     
      for (let index = 0; index < routesAux.length; index++) {
        let geo = new google.maps.LatLng(routesAux[index].location.lat,routesAux[index].location.lng)
        // var geo = new google.maps.LatLng(-26.860128, -65.21991);
        new google.maps.Marker({
          position: geo,
          map,
          visible: true,
          // title: routesAux[index].location.id,
          optimized: false,
          label: {
            color: 'black',
            fontWeight: "bold",
            fontSize: "15px",
            text: routesAux[index].location.id,
            // position: "absolute",
            // top: "-50px",
            // width: "150px",

          },
          zIndex: -100,
        })
        
      }
      // new google.maps.Marker({
      //   position: geolocate,
      //   map,
      //   label: {
      //     fontWeight: "bold",
      //     fontSize: "20px",
      //     text: "Ubicacion actual!",
      //   }
      // })
      new google.maps.InfoWindow({
        map: map,
        visible: false,
        position: geolocate,
        content: ' <h4> Usted esta aqui! </h4> ' + localStorage.getItem("usuario"),
      })

    },
      function (error) {
        alert(error.message);
      }, {
      enableHighAccuracy: true
      , timeout: 5000
    },
    )
   
  };

  //function that is calling the directions service
  getDirection = (origin, destination, waypoints) => {
    //this will check if there is a waypoint meaning the array  has 3 or more coordinates
    waypoints.length >= 1
      ? directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints: waypoints,
          provideRouteAlternatives: false,
          optimizeWaypoints: true,
        },
        (result, status) => {
          // console.log(result);
          if (status === google.maps.DirectionsStatus.OK) {
            //changing the state of directions to the result of direction service
            this.setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      )
      : directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: google.maps.TravelMode.DRIVING,
          // sea agrego nuevo
          waypoints: waypoints,
          provideRouteAlternatives: false,
          optimizeWaypoints: true,
        },
        (result, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            //changing the state of directions to the result of direction service
            this.setState({
              directions: result,
            });
          } else {
            console.error(`error fetching directions ${result}`);
          }
        }
      );

  };

  render() {

    routesAux = [
      {
        "location": {
          "id": "ORIGEN",
          "lat": -26.860128,
          "lng": -65.21991
        }
      }
    ]

    if (this.state?.clientes?.ok) {
      // console.log(this.state?.clientes?.comandas[0].codcli.lat)
      // console.log(localStorage.getItem("id"));
      const foundClientUser = this.state?.clientes?.comandas?.filter(element => element.camionero === localStorage.getItem("id"));
      // console.log(foundClientUser[0].codcli._id)
      // const salida = foundClientUser.filter((item,index) => foundClientUser.map.codcli._id.indexOf(item) === index)
      const uniqueIds = [];
      const unique = foundClientUser.filter(element => {
        const isDuplicate = uniqueIds.includes(element.codcli._id);
        if (!isDuplicate) {
          uniqueIds.push(element.codcli._id);
          return true;
        }
        return false;
      });
      // console.log(unique);
      for (let i = 0; i < unique.length; i++) {
        routesAux.push({
          "location": {
            "id": unique[i].codcli.razonsocial,
            "lat": unique[i].codcli.lat,
            "lng": unique[i].codcli.lng
          }
        })
      }

      routesAux.push({
        "location": {
          "id": "ORIGEN",
          "lat": -26.860128,
          "lng": -65.21991
        }
      })
      routes = routesAux;
      // console.log(JSON.stringify(routes));
      // console.log(routes);
    }
    // console.log(routes)
    return (
      <div>
        {(this.state?.clientes?.ok) ?
          <GoogleMap
            center={defaultLocation}
            //clickableIcons={false}
            zoom={3}
            onLoad={(map) => this.onMapLoad(map)}
            mapContainerStyle={{ height: '100vh', width: '100%' }} // Full Screen
          >
            {/* {console.log(this.state?.directions?.routes[0].legs[0].distance.value)}; */}
            <h1>MAPSSSS</h1>
            {this.state.directions !== null && (
              <DirectionsRenderer directions={this.state.directions} />
              
            )}
            
          </GoogleMap>
          

          : <h1>Cargando Mapas.........</h1>}
          
            
      </div>
    );
  }
}

export default Map;

