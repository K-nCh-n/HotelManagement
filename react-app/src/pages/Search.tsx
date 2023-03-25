import { Container, Row, Col, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from "axios";
import { IRoomAugmented, ISearchParams } from "../interfaces";
import SearchResults from "../components/SearchResults";

const Search = () => {
  const searchUrl = "http://localhost:5000/search";
  const [searchParams, setSearchParams] = useState<ISearchParams>();
  const [validated, setValidated] = useState(false);
  const [searchResults, setSearchResults] = useState<IRoomAugmented[]>([]);
  const [showSearchFields, setShowSearchFields] = useState(true);
  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setSearchParams({ ...searchParams, [name]: value })
  }
  const handleSubmit = (event: any) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log(searchParams);
      event.preventDefault();
    }

    setValidated(true);

    const body = {
      "searchParams": searchParams,
    };

    axios.post(searchUrl, body).then(response => {
      console.log(response);
      setSearchResults(response.data);
      setShowSearchFields(false);
    });
  };
  return (
    <Container fluid="xxl" className="my-2 py-2 bg-light">
      <Row>
        <Col className="btn" title="Show Search Fields" onClick={() => setShowSearchFields(!showSearchFields)} xs="1">
          <RiArrowDropDownLine size={40} />
        </Col>
        <Col>
          <h2 className="fw-bold pt-2">Room Search</h2>
        </Col>
      </Row>
      {showSearchFields && (
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <h4>Hotel Information</h4>
          <Row className="my-3 px-2 justify-content-around">
            <Col md='5'>
              <Row>
                <Col md='6'>
                  <Form.Group>
                    <Form.Label>Hotel Chain</Form.Label>
                    <Form.Control name="chain" type="text" placeholder="Enter Hotel Chain Name" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md='6'>
                  <Form.Group>
                    <Form.Label>Hotel Rating</Form.Label>
                    <Form.Select name="capacity" defaultValue={""} onChange={handleChange}>
                      <option disabled></option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md='5'>
              <Row>
                <h5 className="px-1">Number of Rooms</h5>
                <Col>
                  <Form.Group>
                    <Form.Control name="numberOfRoomsLower" type="number" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="numberOfRoomsUpper" type="number" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <h4>Room Information</h4>
          <Row className="my-3 px-2 justify-content-around">
            <Col md='5'>
              <Row>
                <h5 className="px-1">Price</h5>
                <Col>
                  <Form.Group>
                    <Form.Control name="priceLower" type="text" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="priceUpper" type="text" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md='5'>
              <Row>
                <h5 className="px-1">Area</h5>
                <Col>
                  <Form.Group>
                    <Form.Control name="areaLower" type="number" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="areaUpper" type="number" placeholder="" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="my-3 px-2 justify-content-around">
            <Col md='5'>
              <Form.Group>
                <Form.Label>Capacity</Form.Label>
                <Form.Select name="capacity" defaultValue={""} onChange={handleChange}>
                  <option disabled></option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md='5'>
            </Col>
          </Row>

          <h4>Reservation/Booking Information</h4>
          <Row className="my-3 px-2 justify-content-around">
            <Col md='5'>
              <h5 className="px-1">Reservation</h5>
              <Row>
                <Col xs='6'>
                  <Form.Group className="my-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control name="reservationStartDate" type="date" placeholder="Date" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col xs='6'>
                  <Form.Group className="my-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control name="reservationEndDate" type="date" placeholder="Date" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md='5'>
              <h5 className="px-1">Booking</h5>
              <Row>
                <Col xs='6'>
                  <Form.Group className="my-3">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control name="bookingStartDate" type="date" placeholder="Date" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col xs='6'>
                  <Form.Group className="my-3">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control name="bookingEndDate" type="date" placeholder="Date" onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <Form.Group>
            <Button variant="primary" type="submit">
              Search
              <AiOutlineSearch className="mx-1" />
            </Button>
          </Form.Group>
        </Form>
      )}
      <SearchResults searchResults={searchResults} />
    </Container>
  );
}

export default Search