import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";

const CustomNavbar = ({ user }) => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">Your Logo</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="/">Home</Nav.Link>
          <Nav.Link href="/dashboard">Dashboard</Nav.Link>
          <Nav.Link href="/artists">Artists</Nav.Link>
        </Nav>
        <Nav>
          <NavDropdown title={user.name} id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Profile</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default CustomNavbar;
