import React from "react";
// import Principal from "../components/Principal";
import Login from "../pages/Login";
import Footer from "../components/Footer";

// import "../css/home.css";
import "../css/footer.css";

const Home = () => {
  return (
    <>
      {/* <Login /> */}
     
      <div className="">
      <div className="container mt-5">
        <div className="row text-center mb-3">
          <div className="col-12">
            <h1>Bienvenido al Sistema de Administracion de Comandas</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <p className="text-center">Puede Loguearse e ingresar a opciones del Menu</p>
            <div className="text-center text-muted mt-4 mb-5">
              <span>
                El acceso al mismo será restrigido de acuerdo a los permisos
                que se le asignaron en su declaracion. 
              </span> 
            </div>
            <p className="text-center">Para desloguearse haga click en el menu y 
            en su nombre de usuario</p>
          </div>
        </div>
      </div></div>
       <Footer />
    </>
  );
};

export default Home;
