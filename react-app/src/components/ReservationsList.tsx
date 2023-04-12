import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { IReservation, IReservationEmployee } from "../interfaces";
import { MdDeleteForever, MdOutlineCancel, MdOutlineCheckCircleOutline } from "react-icons/md";
import axios from "axios";
import { useState } from "react";

const ReservationList = (props: {reservations: (IReservation|IReservationEmployee)[], setReservations: (reservations: any[]) => void, employeeNas?: string}) => {
  const cancelReservation = (reservation: IReservation|IReservationEmployee) => {
    const cancelReservationUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/cancelReservation/${reservation.reservationId}`;
    axios.delete(cancelReservationUrl,).then(response => {
      console.log(response);
      props.setReservations(props.reservations.filter(res => res.reservationId !== reservation.reservationId));
      handleClose();
    });
  }
  const confirmReservation = (reservation: IReservation|IReservationEmployee) => {
    const confirmReservationUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/confirmReservation/${reservation.reservationId}/${props.employeeNas}`;
    axios.put(confirmReservationUrl,).then(response => {
      console.log(response);
      props.setReservations(props.reservations.filter(res => res.reservationId !== reservation.reservationId));
      handleShow(reservation);
    });
  }

  const contactInfo = (reservation: IReservation | IReservationEmployee) => {
    if ("clientName" in reservation) {
      return <span><a href={`mailto:${reservation.clientEmail}`}>{reservation.clientEmail}</a> | <a href={`tel:${reservation.clientPhoneNumber}`}>{reservation.clientPhoneNumber}</a></span>
    } else {
      return <span><a href={`mailto:${reservation.hotelEmail}`}>{reservation.hotelEmail}</a> | <a href={`tel:${reservation.hotelPhoneNumber}`}>{reservation.hotelPhoneNumber}</a></span>
    }
  }

  const getDate = (date: Date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString();
  }

  const [showModal, setShowModal] = useState(false);
  const [modalReservation, setModalReservation] = useState<IReservation|IReservationEmployee>({} as IReservation|IReservationEmployee);
  const handleClose = () => {
    setShowModal(false);
    setModalReservation({} as IReservation|IReservationEmployee);
  };
  const handleShow = (reservation: IReservation | IReservationEmployee) => {
    setShowModal(true);
    setModalReservation(reservation);
  }
  
  const reservationModal = () => {
    const reservation = modalReservation;
    const isEmployee = reservation && "clientName" in reservation
    return (
      <Modal show={showModal} onHide={() => handleClose()}>
        <Modal.Header closeButton>
          <Modal.Title>{isEmployee ? "Reservation Confirmed" : "Cancel Reservation?"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{isEmployee ? `Reservation ${reservation?.reservationId} for client ${reservation.clientName}` : "Are you sure you want to cancel your reservation?"}</Modal.Body>
        <Modal.Footer>
          {!isEmployee && <Button className="btn btn-primary" onClick={() => handleClose()}>Abort</Button>}
          <Button className="btn btn-danger" onClick={isEmployee ? () => handleClose() : () => cancelReservation(reservation)}>
            {isEmployee ? <MdOutlineCancel /> : <MdDeleteForever />}{isEmployee ? "Close" : `Cancel Reservation`}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  return(
    <Container>
      {reservationModal()}
      {props.reservations.map((reservation) => {
        return(
          <Container>
            {"clientName" in reservation && <h4 className="fw-bold">{reservation.clientName}</h4>}
            <Row>
              <Col>
                <p>Hotel: {reservation.chainName} {reservation.hotelZone}, {reservation.hotelAddress}</p>
              </Col>
              <Col>
                <p>Room ID: {reservation.roomId}</p>
              </Col>
            </Row>
            <Row>
              <Col> 
                <p>Start Date: {getDate(reservation.reservationStartDate)}</p>
              </Col>
              <Col>
                <p>End Date: {getDate(reservation.reservationEndDate)}</p>
              </Col>
            </Row> 
            <Row>
              <Col>
                <p>Reservation ID: {reservation.reservationId}</p>
              </Col>
              <Col>
                <p>Reservation Date: {getDate(reservation.reservationDate)}</p>
              </Col>
            </Row>
            <Row>
              <Col>
                <p>Number of Guests: {reservation.guests}</p>
              </Col>
              <Col>
                <p>Contact: {contactInfo(reservation)}</p>
              </Col>
            </Row>
              {"clientName" in reservation ?
                <Button className="btn btn-primary" onClick={() => confirmReservation(reservation)}> Confirm</Button> :
                reservation.status === "Pending" ?
                  <Button className="btn-danger p-2" onClick={() => handleShow(reservation)}><MdOutlineCancel size={20} /> Cancel Reservation</Button> :
                <Button className="btn btn-success"><MdOutlineCheckCircleOutline size={20} /> Confirmed</Button>}
            <hr />
          </Container>
        )
      })}
    </Container>  
  );
}

export default ReservationList;