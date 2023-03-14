import { Navbar, Container, Image, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const NavigationBar = () => {
  return (
    <Navbar className="navbar-dark" bg="dark" expand="lg">
      <Container>
        <Navbar.Toggle data-target="#navContent" aria-controls="navContent" />
        <Navbar.Brand>
          <NavLink to="/" className="nav-link">
            <Image src={logo} width="40px" alt="logo" />
            <span className="fw-bold h5 ps-3">HotelManagement</span>
          </NavLink>
        </Navbar.Brand>
        <Navbar.Collapse id="navContent">
          <Nav>
            <Nav.Item className="px-2">
              <NavLink to="/" className={({ isActive }) => 'nav-link ' + (isActive && 'active')}>Home</NavLink>
            </Nav.Item>
            <Nav.Item className="px-2">
              <NavLink to="/client" className={({ isActive }) => 'nav-link ' + (isActive && 'active')}>Client</NavLink>
            </Nav.Item>
            <Nav.Item className="px-2">
              <NavLink to="/employee" className={({ isActive }) => 'nav-link ' + (isActive && 'active')}>Employee</NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
        <NavLink to="/login" className="btn btn-success">Login</NavLink>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;