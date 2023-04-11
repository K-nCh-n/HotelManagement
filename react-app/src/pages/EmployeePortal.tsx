import React from 'react';
import { Card, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundHome from '../assets/backgroundHome.jpg';

const EmployeePortal = (props: {isEmployee: boolean}) => {
  return (
    <Container fluid="xxl">
      {props.isEmployee ?
        <Card className="position-relative">
          <Image className="card-img-top opacity-25" src={backgroundHome} alt="BackgroundImage" fluid />
          <Card.ImgOverlay className="card-img-overlay text-center">
            <Card.Title className="display-5 text-center fw-bold p-1 d-inline">Employee Portal</Card.Title>
            <Card.Footer className="bg-transparent border-0">
              <div className="position-absolute bottom-0 mb-3 w-100 start-0">
                <div className="mb-2">
                  <Link to="/employeeReservations" className="btn btn-success rounded-pill px-3 py-2 mx-3">View Customer Reservations</Link>
                </div>
                <div>
                  <Link to="/editHotelInfo" className="btn btn-primary rounded-pill px-3 py-2 mx-3">Edit Hotel Information</Link>
                  <Link to="/employeeSignUp" className="btn btn-info rounded-pill px-3 py-2 mx-3">Add New Employee</Link>
                </div>
              </div>
            </Card.Footer>
          </Card.ImgOverlay>
        </Card> :
        <h1>Access Denied. Please Log In</h1>}
    </Container>
  );
}

export default EmployeePortal