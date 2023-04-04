import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import ReservationList from '../components/ReservationsList';
import { IReservation, IReservationEmployee } from '../interfaces';
import { AiOutlineSearch } from "react-icons/ai";
import axios from 'axios';

const Employee = (props: {isEmployee: boolean, employeeNas: string}) => {
  const [reservations, setReservations] = useState<IReservationEmployee[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<IReservationEmployee[]>([]);
  const [validated, setValidated] = useState(false);
  const [filters, setFilters] = useState({
    chainName: "",
    clientName: "",
    roomId: "",
    reservationDate: "",
  });

  useEffect(() => {
    const getDBInfo = () => {
      let ignore = false;
      const reservationUrl = "http://localhost:5000/employeeReservations";
      try {
        axios.get(reservationUrl).then(response => {
          if (!ignore) {
            setReservations(response.data);
            setFilteredReservations(response.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
      return () => { ignore = true; };
    }
    getDBInfo();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFilterSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilteredReservations(reservations.filter(reservation => {
      const reservationStartDate = new Date(reservation.reservationStartDate);
      const reservationEndDate = new Date(reservation.reservationEndDate);

      const filterDate = new Date(filters.reservationDate);
      filterDate.setDate(filterDate.getDate() + 1);
      filterDate.setHours(0, 0, 0, 0);
      return (
        reservation.chainName.toLowerCase().includes(filters.chainName.toLowerCase()) &&
        reservation.clientName.toLowerCase().includes(filters.clientName.toLowerCase()) &&
        reservation.roomId.toLowerCase().includes(filters.roomId.toLowerCase()) &&
        filterDate >= reservationStartDate &&
        filterDate <= reservationEndDate
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

    const reservationUrl = "http://localhost:5000/employeeCreateRental";
    axios.post(reservationUrl, body).then(response => {
      console.log(response);
    });
  };

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light" >
      {props.isEmployee ?
        <Row>
          <Col md="6">
            <Container>
              <h3>
                Reservations
              </h3>
              <Form noValidate onSubmit={handleFilterSubmit}>
                <Row className='py-2'>
                  <Col md="5">
                    <Form.Group>
                      <Form.Control name="chainName" type="text" placeholder="Chain Name" onChange={handleFilterChange} required />
                    </Form.Group>
                  </Col>
                  <Col md="5">
                    <Form.Group>
                      <Form.Control name="clientName" type="text" placeholder="Client Name" onChange={handleFilterChange} required />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className='py-2'>
                  <Col md="5">
                    <Form.Group>
                      <Form.Control name="roomId" type="text" placeholder="Room ID" onChange={handleFilterChange} required />
                    </Form.Group>
                  </Col>
                  <Col md="5">
                    <Form.Group>
                      <Form.Control name="reservationStartDate" type="date" placeholder="Reservation Date" onChange={handleFilterChange} required />
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Button type="submit" variant="primary">Filter <AiOutlineSearch /></Button>
                  </Col>
                </Row>
              </Form>
              <hr />
              <ReservationList reservations={filteredReservations} setReservations={setFilteredReservations} employeeNas={props.employeeNas}/>
            </Container>
          </Col>
          <Col md="6">
            <h3>
              Manually add a rental
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
        </Row> :
        <h1>Access Denied. Please Log In</h1>}
    </Container >
  );
}

export default Employee