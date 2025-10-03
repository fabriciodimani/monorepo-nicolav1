const NAVIGATION_CONFIG = {
  ADMIN_ROLE: [
    {
      type: "dropdown",
      title: "Preventa",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/comandas", label: "Generar Comandas" },
        { href: "/StocksPrev", label: "Consultar Stock" },
        { href: "/InformePreventas", label: "Listar Comandas" },
        { href: "/ClientesPrev", label: "Altas Clientes" },
      ],
    },
    {
      type: "link",
      to: "/camiones",
      label: "Distribucion",
      className: "ml-3 mt-2",
    },
    {
      type: "link",
      to: "/remitos",
      label: "Remito",
      className: "ml-3 mt-2",
    },
    {
      type: "link",
      to: "/stocks",
      label: "Stock",
      className: "ml-3 mt-2",
    },
    {
      type: "link",
      to: "/precios",
      label: "Precios",
      className: "ml-3 mt-2",
    },
    {
      type: "dropdown",
      title: "Altas",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/clientes", label: "Clientes" },
        { href: "/proveedores", label: "Proveedores" },
        { href: "/producservs", label: "Productos" },
        { href: "/rutas", label: "Rutas" },
        { href: "/rubros", label: "Rubros" },
        { href: "/marcas", label: "Marcas" },
        { href: "/localidades", label: "Localidades" },
      ],
    },
    {
      type: "dropdown",
      title: "Informes",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/InformeComandas", label: "Listar Comandas" },
        { href: "/InformeImpresion", label: "Impresion Comandas" },
        { href: "/InformeRemitos", label: "Listar Remitos" },
        { href: "/InformeStock", label: "Historico de Stock" },
        { href: "/InformeOrdenAPreparar", label: "Ordenes a Preparar" },
        { href: "/InformeHojaRuta", label: "Hoja de Ruta" },
      ],
    },
    {
      type: "dropdown",
      title: "Gestion",
      id: "navbarScrollingDropdown",
      items: [{ href: "/InformeGestion", label: "Tablero Control" }],
    },
    {
      type: "link",
      to: "/quienes",
      label: "Acerca",
      className: "ml-3 mt-2 mr-5",
    },
  ],
  ADMIN_SUP: [
    {
      type: "dropdown",
      title: "Preventa",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/comandas", label: "Generar Comandas" },
        { href: "/StocksPrev", label: "Consultar Stock" },
        { href: "/InformePreventas", label: "Listar Comandas" },
        { href: "/ClientesPrev", label: "Altas Clientes" },
      ],
    },
    {
      type: "link",
      to: "/camiones",
      label: "Distribucion",
      className: "ml-3 mt-2",
    },
    {
      type: "dropdown",
      title: "Altas",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/clientes", label: "Clientes" },
        { href: "/proveedores", label: "Proveedores" },
        { href: "/producservs", label: "Productos" },
        { href: "/rutas", label: "Rutas" },
        { href: "/rubros", label: "Rubros" },
        { href: "/marcas", label: "Marcas" },
        { href: "/localidades", label: "Localidades" },
      ],
    },
    {
      type: "dropdown",
      title: "Informes",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/InformeComandas", label: "Listar Comandas" },
        { href: "/InformeRemitos", label: "Listar Remitos" },
        { href: "/InformeStock", label: "Historico de Stock" },
        { href: "/InformeOrdenAPreparar", label: "Ordenes a Preparar" },
        { href: "/InformeHojaRuta", label: "Hoja de Ruta" },
      ],
    },
    {
      type: "dropdown",
      title: "Gestion",
      id: "navbarScrollingDropdown",
      items: [{ href: "/InformeGestion", label: "Tablero Control" }],
    },
  ],
  USER_PREV: [
    {
      type: "dropdown",
      title: "Preventa",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/comandas", label: "Generar Comandas" },
        { href: "/StocksPrev", label: "Consultar Stock" },
        { href: "/InformePreventas", label: "Listar Comandas" },
        { href: "/ClientesPrev", label: "Altas Clientes" },
      ],
    },
  ],
  USER_CAM: [
    {
      type: "link",
      to: "/camiones",
      label: "Distribucion",
      className: "ml-3 mt-2",
    },
    {
      type: "link",
      to: "/mapas",
      label: "Mapa",
      className: "ml-3 mt-2",
    },
  ],
  USER_STK: [
    {
      type: "link",
      to: "/remitos",
      label: "Remito",
      className: "ml-3 mt-2",
    },
    {
      type: "link",
      to: "/stocks",
      label: "Stock",
      className: "ml-3 mt-2",
    },
    {
      type: "dropdown",
      title: "Informes",
      id: "navbarScrollingDropdown",
      items: [
        { href: "/InformeRemitos", label: "Listar Remitos" },
        { href: "/InformeStock", label: "Historico de Stock" },
      ],
    },
  ],
};

export const getNavItemsForRole = (role) => NAVIGATION_CONFIG[role] ?? [];

export const shouldShowAdminLink = (role) => role === "ADMIN_ROLE";
