import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import { MdAccountCircle, MdDeleteForever } from "react-icons/md";
import { AiOutlineEdit } from "react-icons/ai";
import axios from "axios";
import { IReservation, IUserInfo } from "../interfaces";
import ReservationList from "../components/ReservationsList";
import { useNavigate } from "react-router-dom";
import AccountInfo from "../components/AccountInfo";

const Account = (props: {token: string, isEmployee: boolean}) => {
  const [userInfo, setUserInfo] = useState<IUserInfo>({} as IUserInfo);
  const [reservations, setReservations] = useState<IReservation[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getDBInfo = () => {
      let ignore = false;
      const userInfoUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/account/${props.token}`;
      const reservationUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/userReservations/${props.token}`;
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

  const [showEditInfo, setShowEditInfo] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const deleteUser = () => {
    const deleteUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/deleteUser/`;
    const body = {
      data : {
        "token": props.token,
        "isEmployee": props.isEmployee
      }
    }
    console.log(body);
    axios.delete(deleteUrl, body).then(response => {
      localStorage.removeItem("isEmployee");
      localStorage.removeItem("token");
      console.log(response.data);
      alert("Your account has been deleted.");
      navigate('/');
    });
  }

  const fillInUserInfo = () => {
    if (userInfo.firstName !== undefined) {
      return (
        <div>
          <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
          <p>Email: {userInfo.email}</p>
          <p>Password: {"*".repeat(userInfo.password.length)}</p>
          <Button className="btn btn-secondary" onClick={() => setShowEditInfo(true)}><AiOutlineEdit /></Button>
          <Button className="btn btn-danger" onClick={handleShow}>DELETE USER</Button>
        </div>
      );
    }
  }

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      {showEditInfo ?
        <AccountInfo user={userInfo} setUserInfo={setUserInfo} setShowEditInfo={setShowEditInfo} isEmployee={props.isEmployee} />
        : 
        <Container>
            <Modal show={showModal} onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>Confirm Account Deletion</Modal.Title>
              </Modal.Header>
              <Modal.Body>Are you sure you want to delete your account?</Modal.Body>
              <Modal.Footer>
                <Button className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </Button>
                <Button className="btn btn-danger" onClick={deleteUser}>
                  DELETE ACCOUNT <MdDeleteForever />
                </Button>
              </Modal.Footer>
            </Modal>
            <Row>
              <Col md="4">
                <Card className="my-2">
                  <MdAccountCircle className="card-img-top" size={150} />
                  <Card.Body className="text-center">
                    <Card.Title>Account Information</Card.Title>
                    {fillInUserInfo()}
                  </Card.Body>
                </Card>
              </Col>
              <Col md="8">
                {props.isEmployee ?
                <Container>
                  <h3>Add New Employee</h3>
                  <AccountInfo isEmployee={true} />
                </Container>
                :
                <Container>
                  <h3>
                    My Reservations
                  </h3>
                  <ReservationList reservations={reservations} setReservations={setReservations} />
                </Container>
                }
              </Col>
            </Row>
        </Container>
      }
    </Container>
  );
}

export default Account