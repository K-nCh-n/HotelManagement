import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { MdAccountCircle } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { IReservation, IUserInfo } from "../interfaces";
import ReservationList from "../components/ReservationsList";

const Account = (props: {token: string}) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>({} as IUserInfo);
  const [reservations, setReservations] = useState<IReservation[]>([]);

  useEffect(() => {
    const getDBInfo = () => {
      let ignore = false;
      const userInfoUrl = `http://localhost:5000/account/${props.token}`;
      const reservationUrl = `http://localhost:5000/userReservations/${props.token}`;
      if (!ignore) {
        try {
          axios.get(userInfoUrl).then(response => {
            setUserInfo(response.data);
          });
          axios.get(reservationUrl).then(response => {
            setReservations(response.data);
          });
        } catch (error) {
          console.log(error);
        }
      }
      return () => { ignore = true; };
    }
    getDBInfo();
  }, []);

  const editUserInfo = () => {
    alert("Coming Soon: Edit user info. Please contact an administrator if you need to change your information.");
  }

  const fillInUserInfo = () => {
    if (userInfo.firstName !== undefined) {
      return (
        <div>
          <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
          <p>Email: {userInfo.email}</p>
          <p>Password: {"*".repeat(userInfo.password.length)}</p>
          <Button className="btn btn-secondary" onClick={editUserInfo}><AiOutlineEdit /></Button>
        </div>
      );
    }
  }

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      <Row>
        <Col md="4">
          <Card className="my-2">
            <MdAccountCircle className="card-img-top" size={150}/>
            <Card.Body className="text-center">
              <Card.Title>Account Information</Card.Title>
              {fillInUserInfo()}
            </Card.Body>
          </Card>
        </Col>
        <Col md="8">
          <Container>
            <h3>
              My Reservations
            </h3>
            <ReservationList reservations={reservations} />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}

export default Account