import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, NavDropdown, Offcanvas } from "react-bootstrap";
import logo from "../images/distripollo.jpeg";
import "../css/navbar.css";
import useNavbarState from "../hooks/useNavbarState";
import { getNavItemsForRole, shouldShowAdminLink } from "../utils/navItems";

const NavBar = ({ variant = "horizontal" }) => {
  const { handleLogin, payload, user } = useNavbarState();
  const role = payload?.role ?? "";
  const isVertical = variant === "vertical";
  const navItems = useMemo(() => getNavItemsForRole(role), [role]);
  const collapseId = isVertical
    ? "navbar-offcanvas"
    : "basic-navbar-nav-light";
  const labelId = `${collapseId}-label`;

  const renderNavItem = (item) => {
    if (item.type === "dropdown") {
      return (
        <NavDropdown title={item.title} id={item.id} key={item.title}>
          {item.items.map((dropdownItem) => (
            <NavDropdown.Item
              href={dropdownItem.href}
              className="nav-link3"
              key={`${item.title}-${dropdownItem.href}`}
            >
              {dropdownItem.label}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      );
    }

    const linkClassName = [
      "nav-link",
      !isVertical ? item.className : null,
      isVertical ? "w-100 text-center" : null,
      isVertical ? item.verticalClassName : null,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <Link
        to={item.to}
        className={linkClassName}
        key={item.to}
      >
        {item.label}
      </Link>
    );
  };

  const adminLinkClassName = isVertical
    ? "text-decoration-none text-muted w-100 text-center mt-3"
    : "text-decoration-none text-muted ml-5 mr-3";
  const logoutButtonClassName = isVertical
    ? "btn btn-outline-info w-100 mt-3"
    : "btn btn-outline-info";

  const navContent = (
    <>
      <Nav className={isVertical ? "flex-column w-100" : undefined}>
        {navItems.map((item) => renderNavItem(item))}
      </Nav>
      {shouldShowAdminLink(role) && (
        <Link
          to="/admin"
          id="user"
          className={adminLinkClassName}
        >
          Administrador
        </Link>
      )}
      <button
        id="booton"
        className={logoutButtonClassName}
        onClick={handleLogin}
      >
        {user}
      </button>
    </>
  );

  return (
    <div>
      <div id="navBar" className="navBar mr-auto">
        <Navbar bg="light" expand={isVertical ? false : "lg"}>
          <img src={logo} alt="logo" />
          <Link className="nav" to="/">
            <Navbar.Brand id={labelId}>Distri Pollo</Navbar.Brand>
          </Link>

          <Navbar.Toggle id="hamburguesa" aria-controls={collapseId} />
          {isVertical ? (
            <Navbar.Offcanvas
              id={collapseId}
              aria-labelledby={labelId}
              placement="start"
              className="navBar-offcanvas offcanvas-start"
            >
              <Offcanvas.Header closeButton closeVariant="white">
                <Offcanvas.Title id={labelId}>Distri Pollo</Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body className="d-flex flex-column w-100">
                {navContent}
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          ) : (
            <Navbar.Collapse id={collapseId} className="collapse">
              {navContent}
            </Navbar.Collapse>
          )}
        </Navbar>
      </div>
    </div>
  );
};

export default NavBar;
