import React from 'react';
import { IRoomAugmented } from '../interfaces';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col } from 'react-bootstrap';

const SearchResults = (props: {searchResults: IRoomAugmented[]}) => {
  return (
    <Container>
      {props.searchResults.map((room) => {
        return (
          <Container>
            <Row className='py-2'>
              <Col md="6">
                <p>Hotel Name: {room.hotelName}</p>
                <p>Price: {room.price}</p>
                <p>Maximum Number of Guests: {room.capacity} {room.extendable && ("Can be extended if required")}</p>
              </Col>
              <Col md="6">
                <p>Hotel Address: {room.hotelAddress}</p>
                <p>Hotel Chain: {room.hotelChain}</p>
                <p>Hotel Rating: {room.hotelRating}</p>
              </Col>
            </Row>
            <Link to={`/room/${room.roomId}`} className="btn btn-primary rounded-pill px-3 py-2 mx-3">More Details</Link>
            <hr />
          </Container>
        )
      })}
    </Container>
  );
};

export default SearchResults;