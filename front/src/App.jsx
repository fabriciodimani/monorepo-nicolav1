import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Error404 from "./pages/Error404";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Comandas from "./pages/Comandas";
import Camiones from "./pages/Camiones";
import Mapas from "./pages/Mapas";
import Remitos from "./pages/Remitos";
import Stocks from "./pages/Stocks";
import StocksPrev from "./pages/StocksPrev";
import Clientes from "./pages/Clientes";
import ClientesPrev from "./pages/ClientesPrev";
import Proveedores from "./pages/Proveedores";
import Localidades from "./pages/Localidades";
import Empresas from "./pages/Empresas";
import Producservs from "./pages/Producservs";
import Rutas from "./pages/Rutas";
import Rubros from "./pages/Rubros";
import Marcas from "./pages/Marcas";
import Precios from "./pages/Precios";
import Quienes from "./pages/Quienes";
import InformeComandas from "./pages/InformeComandas";
import InformeImpresion from "./pages/InformeImpresion";
import InformeGestion from "./pages/InformeGestion";
import InformePreventas from "./pages/InformePreventas";
import InformeRemitos from "./pages/InformeRemitos";
import InformeStock from "./pages/InformeStock";
import InformeOrdenAPreparar from "./pages/InformeOrdenAPreparar";
import InformeHojaRuta from "./pages/InformeHojaRuta";
import { ThemeProvider } from "./Context/ThemeContext";

const App = () => {
  return (
    <>
      <Router>
        <ThemeProvider>
          <Layout>
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/Comandas" component={Comandas} />
              <Route exact path="/Camiones" component={Camiones} />
              <Route exact path="/Mapas" component={Mapas} />
              <Route exact path="/Remitos" component={Remitos} />
              <Route exact path="/Stocks" component={Stocks} />
              <Route exact path="/StocksPrev" component={StocksPrev} />
              <Route exact path="/Clientes" component={Clientes} />
              <Route exact path="/ClientesPrev" component={ClientesPrev} />
              <Route exact path="/Proveedores" component={Proveedores} />
              <Route exact path="/Localidades" component={Localidades} />
              <Route exact path="/Empresas" component={Empresas} />
              <Route exact path="/Producservs" component={Producservs} />
              <Route exact path="/Rutas" component={Rutas} />
              <Route exact path="/Rubros" component={Rubros} />
              <Route exact path="/Marcas" component={Marcas} />
              <Route exact path="/Precios" component={Precios} />
              <Route exact path="/quienes" component={Quienes} />
              <Route exact path="/InformeComandas" component={InformeComandas} />
              <Route exact path="/InformeImpresion" component={InformeImpresion} />
              <Route exact path="/InformeGestion" component={InformeGestion} />
              <Route exact path="/InformePreventas" component={InformePreventas} />
              <Route exact path="/InformeRemitos" component={InformeRemitos} />
              <Route exact path="/InformeStock" component={InformeStock} />
              <Route
                exact
                path="/InformeOrdenAPreparar"
                component={InformeOrdenAPreparar}
              />
              <Route
                exact
                path="/InformeHojaRuta"
                component={InformeHojaRuta}
              />
              <Route exact path="/admin" component={Admin} />
            </Switch>
          </Layout>
        </ThemeProvider>
      </Router>
    </>
  );
};

export default App;
