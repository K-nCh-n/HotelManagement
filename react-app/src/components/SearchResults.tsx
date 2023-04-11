import React from 'react';
import { IRoomAugmented } from '../interfaces';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Row, Col, Image } from 'react-bootstrap';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const SearchResults = (props: {searchResults: IRoomAugmented[]}) => {
  const stars = (rating: number) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<AiFillStar />);
    }
    for (let i = 0; i < 5 - rating; i++) {
      stars.push(<AiOutlineStar />);
    }
    return stars;
  }
  return (
    <Container>
      {props.searchResults.map((room) => {
        return (
          <Container>
            <Row className='py-2'>
              <Col md="4">
                <Image src={room.roomImage} fluid />
              </Col>
              <Col md="4">
                <p>Hotel Name: {room.hotelName}</p>
                <p>Price: ${room.price}/night</p>
                <p>Maximum Number of Guests: {room.capacity} {room.extendable && ("(Can be extended if required)")}</p>
              </Col>
              <Col md="4">
                <p>Hotel Address: {room.hotelAddress}</p>
                <p>Hotel Chain: {room.hotelChain}</p>
                <p>Hotel Rating: {stars(room.hotelRating)}</p>
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