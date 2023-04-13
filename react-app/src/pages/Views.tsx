import { Container, Button, Row, Col, Form } from "react-bootstrap";
import axios from "axios";
import { useEffect, useState } from "react";

const Views = () => {
  const roomCountByZoneUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/roomCountByZone`;
  const roomCapacityInHotelUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/roomCapacityInHotel`;

  const [roomCountByZone, setRoomCountByZone] = useState([]);
  const [roomCapacityInHotel, setRoomCapacityInHotel] = useState([]);
  const [viewNumberToDisplay, setViewNumberToDisplay] = useState(0);

  const getRoomCountByZone = () => {
    axios.get(roomCountByZoneUrl).then(response => {
      console.log(response.data)
      setRoomCountByZone(response.data);
      setViewNumberToDisplay(1);
    })
    .catch(err => {
      console.log(err);
    });
  }

  const getRoomCapacityInHotel = () => {
    axios.get(roomCapacityInHotelUrl).then(response => {
      console.log(response.data)
      setRoomCapacityInHotel(response.data);
      setViewNumberToDisplay(2);
    })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <Container fluid="xxl" className="my-4 py-4 bg-light">
      <h1>Views</h1>
      <hr />
      <Button className='mx-3' onClick={getRoomCountByZone}>Get Room Count By Zone</Button>
      <Button className='mx-3' onClick={getRoomCapacityInHotel}>Get Room Capacity In Hotel</Button>
      <hr />
      <Container fluid="xxl" className="my-4 py-4 bg-light">
        {viewNumberToDisplay === 1 && (
          <div>
            <h2>Room Count By Zone View</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Zone</th>
                  <th>Room Count</th>
                </tr>
              </thead>
              <tbody>
                {roomCountByZone.map((row: any) => (
                  <tr key={row.zone}>
                    <td>{row.zone}</td>
                    <td>{row.room_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {viewNumberToDisplay === 2 && (
          <div>
            <h2>Room Capacity In Hotel View</h2>
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Room ID</th>
                  <th>Room Capacity</th>
                </tr>
              </thead>
              <tbody>
                {roomCapacityInHotel.map((row: any) => (
                  <tr key={row.room_type}>
                    <td>{row.room_id}</td>
                    <td>{row.capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </Container>
  );
}

export default Views;