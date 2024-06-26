import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { IReservedDates, IRoomAugmented } from '../interfaces';

const RoomDetails = (props: {token: string}) => {
  const { id } = useParams<{ id: string }>();
  const [room, setRoom] = useState<IRoomAugmented>({} as IRoomAugmented);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [reservedDates, setReservedDates] = useState<IReservedDates[]>([]);

  const [validated, setValidated] = useState(false);
  const reserveUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/reserveRoom`;

  const navigate = useNavigate();

  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      if (props.token === undefined) {
        alert("Please log in to reserve a room.");
        event.preventDefault();
        navigate('/login');
      } else{
        console.log(checkIn, checkOut);
        event.preventDefault();
      }
    }

    setValidated(true);

    const body = {
      "roomId": room.roomId,
      "customerNas": props.token,
      "reservationStartDate": checkIn,
      "reservationEndDate": checkOut,
    };

    try{
      axios.post(reserveUrl, body).then(response => {
        console.log(response);
        alert("Room reserved successfully!");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    if (name === 'checkIn') {
      setCheckIn(value);
    } else if (name === 'checkOut') {
      setCheckOut(value);
    }
  };

  useEffect(() => {
    axios.get(`http://${process.env.REACT_APP_BACKEND_BASEURL}/roomInfo/${id}`).then(response => {
      setRoom(response.data);
    });
    axios.get(`http://${process.env.REACT_APP_BACKEND_BASEURL}/roomAvailability/${id}`).then(response => {
      setReservedDates(response.data);
    });
  }, []);

  const verifyAvailability = () => {
    let available = true;
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    checkInDate.setHours(0, 0, 0, 0);
    checkOutDate.setHours(0, 0, 0, 0);
    checkInDate.setDate(checkInDate.getDate() + 1);
    checkOutDate.setDate(checkOutDate.getDate() + 1);
    for(let i = 0; i < reservedDates.length; i++) {
      const date = reservedDates[i];
      const reservedStartDate = new Date(date.reservationStartDate);
      const reservedEndDate = new Date(date.reservationEndDate);

      if (checkInDate <= reservedEndDate && checkOutDate >= reservedStartDate) {
        return false;
      }
    };
    return available;
  };

  return(
    <Container fluid="lg" className="my-2 py-2 bg-light">
      <Row>
        <Col md="5">
          <Card className="my-2">
            <Card.Img variant="top" src={room.roomImage} />
            <Card.Body className="text-center">
              <Card.Title>{room.roomId}</Card.Title>
              <Container>
                <Row>
                  <Col>
                    <p>Price: ${room.price}</p>
                    <p>Commodities: {room.commodities}</p>
                    <p>Capacity: {room.capacity} {room.extendable && "(Extendable)"}</p>
                    <p>View: {room.view}</p>
                    <p>Problems: {room.problems}</p>
                  </Col>
                  <Col>
                    <p>Hotel Name: {room.hotelName}</p>
                    <p>Hotel Address: {room.hotelAddress}</p>
                    <p>Hotel Chain: {room.hotelChain}</p>
                    <p>Hotel Rating: {room.rating}</p>
                  </Col>
                </Row>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>Check In</Form.Label>
                        <Form.Control name="checkIn" type="date" onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">
                          Please choose a check in date.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>Check Out</Form.Label>
                        <Form.Control name="checkOut" type="date" onChange={handleChange} required />
                        <Form.Control.Feedback type="invalid">
                          Please choose a check out date.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  {!verifyAvailability() && <p className="text-danger">This room is not available during the selected dates.</p>}
                  <Form.Group>
                    <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">Reserve</Button>
                  </Form.Group>
                </Form>
              </Container>
            </Card.Body>
          </Card>
        </Col>
        <Col md="7">
          <Container className="py-2 my-2">
            <h3>Reviews</h3>
            <p>Coming soon...</p>
          </Container>
        </Col>
      </Row>
    </Container>
  )
}

export default RoomDetails