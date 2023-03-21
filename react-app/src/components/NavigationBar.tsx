import { Navbar, Container, Image, Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";

const NavigationBar = (props: {token: string}) => {
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
              <NavLink to="/search" className={({ isActive }) => 'nav-link ' + (isActive && 'active')}>Search</NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
        {props.token ?
          <NavLink to="/account" className="btn btn-success">MyAccount</NavLink> :
          <NavLink to="/login" className="btn btn-success">Login</NavLink>}
      </Container>
    </Navbar>
  );
}

export default NavigationBar;