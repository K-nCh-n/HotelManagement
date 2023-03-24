import { Container } from "react-bootstrap";
import { IReservation, IReservationAugmented } from "../interfaces";

const ReservationList = (props: {reservations: (IReservation|IReservationAugmented)[]}) => {
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
            {"chainName" in reservation && <p>Chain Name: {reservation.chainName}</p>}
            {"clientName" in reservation && <p>Client Name: {reservation.clientName}</p>}
            {"chainName" in reservation && <button className="btn btn-primary">Confirm</button>}
            <hr />
          </Container>
        )
      })}
    </Container>  
  );
}

export default ReservationList;