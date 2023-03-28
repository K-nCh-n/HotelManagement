import { Container, Row, Col, Button } from "react-bootstrap";
import { IReservation, IReservationAugmented } from "../interfaces";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";

const ReservationList = (props: {reservations: (IReservation|IReservationAugmented)[]}) => {
  const cancelReservation = (reservationID: string) => {
    const cancelReservationUrl = `http://localhost:5000/cancelReservation/${reservationID}`;
    axios.delete(cancelReservationUrl,).then(response => {
      console.log(response);
    });
  }
  return(
    <Container>
      {props.reservations.map((reservation) => {
        return(
          <Container>
            <Row>
              <Col>
                <p>Reservation ID: {reservation.reservationId}</p>
                <p>Room ID: {reservation.roomId}</p>
                <p>Start Date: {reservation.reservationStartDate}</p>
                {"chainName" in reservation ?
                 <p>Chain Name: {reservation.chainName}</p>
                  : <Button className="btn-danger p-2" onClick={() => cancelReservation(reservation.reservationId)}><MdOutlineCancel size={20}/> Cancel Reservation</Button>
                }
              </Col>
              <Col>
                <p>End Date: {reservation.reservationEndDate}</p>
                <p>Number of Guests: {reservation.guests}</p>
                <p>Reservation Date: {reservation.reservationDate}</p>
                {"clientName" in reservation && <p>Client Name: {reservation.clientName}</p>}
                {"chainName" in reservation && <button className="btn btn-primary">Confirm</button>}
              </Col>
            </Row>
            <hr />
          </Container>
        )
      })}
    </Container>  
  );
}

export default ReservationList;