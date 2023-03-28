import { Navbar, Container, Image, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.svg";
import { GoSignOut } from "react-icons/go";
import { MdManageAccounts } from "react-icons/md";

const NavigationBar = (props: {token: string}) => {
  const logOut = () => {
    localStorage.removeItem("isEmployee");
    localStorage.removeItem("token");
    window.location.reload();
  }
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
          <Nav className="ms-auto">
            {props.token ?
              <Nav.Item>
                <NavLink to="/account" className="btn btn-success" title="My Account"><MdManageAccounts size={20} /></NavLink>
                <Button className="btn" title="Log Out" onClick={logOut}><GoSignOut size={20} /></Button>
              </Nav.Item> :
              <Nav.Item>
                <NavLink to="/login" className="btn btn-success">Login</NavLink>
              </Nav.Item>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;