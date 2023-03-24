import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReservationList from '../components/ReservationsList';
import { IReservation, IReservationAugmented } from '../interfaces';
import axios from 'axios';

const Employee = () => {
  const [reservations, setReservations] = useState<IReservationAugmented[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<IReservationAugmented[]>([]);
  const [validated, setValidated] = useState(false);
  const [filters, setFilters] = useState({
    chainName: "",
    clientName: "",
    roomId: "",
    reservationStartDate: "",
  });

  useEffect(() => {
    const getDBInfo = () => {
      let ignore = false;
      const reservationUrl = "http://localhost:5000/reservationsAugmented";
      try {
        axios.get(reservationUrl).then(response => {
          if (!ignore) {
            setReservations(response.data);
            console.log(reservations)
          }
        });
      } catch (error) {
        console.log(error);
      }
      return () => { ignore = true; };
    }
    getDBInfo();
  }, [reservations]);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
    setFilteredReservations(reservations.filter(reservation => {
      return (
        reservation.chainName.toLowerCase().includes(filters.chainName.toLowerCase()) &&
        reservation.clientName.toLowerCase().includes(filters.clientName.toLowerCase()) &&
        reservation.roomId.toLowerCase().includes(filters.roomId.toLowerCase()) &&
        reservation.reservationStartDate.toLowerCase().includes(filters.reservationStartDate.toLowerCase())
      )}));
  };

  const [newReservation, setNewReservation] = useState<IReservation>({} as IReservation);
  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    setNewReservation({ ...newReservation, [name]: value });
  };
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log(newReservation);
      event.preventDefault();
    }

    setValidated(true);

    const body = {
      "newReservation": newReservation,
    };

    const reservationUrl = "http://localhost:5000/newReservation";
    axios.post(reservationUrl, body).then(response => {
      console.log(response);
    });
  };

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      <Row>
        <Col md="6">
          <Container>
            <h3>
              Reservations
            </h3>
            <Form noValidate>
              <Row className='py-2'>
                <Col md="6">
                  <Form.Group>
                    <Form.Control name="chainName" type="text" placeholder="Chain Name" onChange={handleFilterChange} required />
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Control name="clientName" type="text" placeholder="Client Name" onChange={handleFilterChange} required />
                  </Form.Group>
                </Col>
              </Row>
              <Row className='py-2'>
                <Col md="6">
                    <Form.Group>
                      <Form.Control name="roomId" type="text" placeholder="Room ID" onChange={handleFilterChange} required />
                    </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Control name="reservationStartDate" type="date" placeholder="Reservation Date" onChange={handleFilterChange} required />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <ReservationList reservations={filteredReservations} />
          </Container>
        </Col>
        <Col md="6">
          <h3>
            Manually add a reservation
          </h3>
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="my-3 px-2 justify-content-around">
              <Col md="6">
                <Form.Group>
                  <Form.Label>Customer NAS</Form.Label>
                  <Form.Control name="customerNas" type="text" placeholder="Customer NAS" onChange={handleInputChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a Customer NAS.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group>
                  <Form.Label>Room ID</Form.Label>
                  <Form.Control name="RoomID" type="text" placeholder="Room ID" onChange={handleInputChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a Room ID.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-3 px-2 justify-content-around">
              <Col md="6">
                <Form.Group>
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control name="startDate" type="date" placeholder="Start Date" onChange={handleInputChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a Start Date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md="6">
                <Form.Group>
                  <Form.Label>End Date</Form.Label>
                  <Form.Control name="endDate" type="date" placeholder="End Date" onChange={handleInputChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please provide an End Date.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="my-3 px-2 justify-content-around">
              <Col md="6">
                <Form.Group>
                  <Form.Label>Number of Guests</Form.Label>
                  <Form.Control name="numberOfGuests" type="number" placeholder="Number of Guests" onChange={handleInputChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please provide a Number of Guests.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group>
              <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">Add Rental</Button>
            </Form.Group>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Employee