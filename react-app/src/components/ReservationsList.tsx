import { Container } from "react-bootstrap";
import { IReservation } from "../interfaces";

const ReservationList = (props: {reservations: IReservation[]}) => {
  return(
    <Container>
      {props.reservations.map((reservation) => {
        return(
          <Container>
            <p>Reservation ID: {reservation.reservationId}</p>
            <p>Room ID: {reservation.roomId}</p>
            <p>Start Date: {reservation.reservationStartDate}</p>
            <p>End Date: {reservation.reservationEndDate}</p>
            <p>Number of Guests: {reservation.guests}</p>
            <p>Reservation Date: {reservation.reservationDate}</p>
            <hr />
          </Container>
        )
      })}
    </Container>  
  );
}

export default ReservationList;