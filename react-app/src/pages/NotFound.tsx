import { Container, Card, Image } from "react-bootstrap";
import { Link } from "react-router-dom"
import backgroundHome from "../assets/backgroundHome.jpg";

const NotFound = () => {
  return (
    <Container fluid="xxl" className="my-4 py-4 bg-light">
      <Card className="position-relative">
        <Image className="card-img-top opacity-25" src={backgroundHome} alt="BackgroundImage" fluid />
        <Card.ImgOverlay className="card-img-overlay text-center">
          <Card.Title className="display-5 text-center fw-bold p-1 d-inline">Error 404: This Page could not be found
          </Card.Title>
          <Card.Footer className="bg-transparent border-0">
            <div className="position-absolute bottom-0 mb-5 w-100 start-0">
              <Link to="/" className="btn btn-primary rounded-pill px-3 py-3 mx-3 fs-3">Return to Home</Link>
            </div>
          </Card.Footer>
        </Card.ImgOverlay>
      </Card>
    </Container>
  );
}

export default NotFound;