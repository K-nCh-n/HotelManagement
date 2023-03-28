import React from 'react';
import { Card, Container, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import backgroundHome from '../assets/backgroundHome.jpg';

const Home = (props: {isEmployee: boolean}) => {
  return (
    <Container fluid="xxl">
      <Card className="position-relative">
        <Image className="card-img-top opacity-25" src={backgroundHome} alt="BackgroundImage" fluid />
        <Card.ImgOverlay className="card-img-overlay text-center">
          <Card.Title className="display-5 text-center fw-bold p-1 d-inline">Hotel Mangement</Card.Title>
          <Card.Footer className="bg-transparent border-0">
            <div className="position-absolute bottom-0 mb-5 w-100 start-0">
              <Link to="/search" className="btn btn-primary rounded-pill px-3 py-2 mx-3">Search for a Room</Link>
              {props.isEmployee && <Link to="/employee" className="btn btn-success rounded-pill px-3 py-2 mx-3">Employee Portal</Link>}
            </div>
          </Card.Footer>
        </Card.ImgOverlay>
      </Card>
    </Container>
  );
}

export default Home