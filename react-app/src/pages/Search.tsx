import { Container, Row, Col, Form, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import axios from "axios";
import { IRoomAugmented, ISearchParams } from "../interfaces";
import SearchResults from "../components/SearchResults";

const Search = () => {
  const searchUrl = `http://csi2532.ddns.net:5000/search`;
  const [searchParams, setSearchParams] = useState<ISearchParams>();
  const [validated, setValidated] = useState(false);
  const [searchResults, setSearchResults] = useState<IRoomAugmented[]>([]);
  const [showSearchFields, setShowSearchFields] = useState(true);

  useEffect(() => {
    const getDBInfo = () => {
      let ignore = false;
      try {
        axios.get(searchUrl).then(response => {
          if (!ignore) {
            console.log(response);
            setSearchResults(response.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
      return () => { ignore = true; };
    }
    getDBInfo();
  }, []);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setSearchParams({ ...searchParams, [name]: value.trim() })
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

    axios.get(searchUrl, { params: {...searchParams} }).then(response => {
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
          <h5>Hotel Information</h5>
          <Row className="my-1 px-2 justify-content-around">
            <Col md='5'>
              <Row>
                <Col md='6'>
                  <Form.Group>
                    <Form.Label className="my-0">Hotel Chain</Form.Label>
                    <Form.Control name="chain" type="text" defaultValue={searchParams?.chain} placeholder="Enter Hotel Chain Name" onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col md='6'>
                  <Form.Group>
                    <Form.Label className="my-0">Hotel Rating</Form.Label>
                    <Form.Select name="capacity" defaultValue={searchParams?.category ?? ""} onChange={handleChange}>
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
              <Row className="text-center">
                <h6 className="px-1">Number of Rooms</h6>
                <Col>
                  <Form.Group>
                    <Form.Control name="numberOfRoomsLower" type="number" placeholder="" defaultValue={searchParams?.numberOfRoomsLower} onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="numberOfRoomsUpper" type="number" placeholder="" defaultValue={searchParams?.numberOfRoomsUpper} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>

          <h5>Room Information</h5>
          <Row className="my-1 px-2 justify-content-around">
            <Col md='5'>
              <Row className="text-center">
                <h6 className="px-1">Room Price</h6>
                <Col>
                  <Form.Group>
                    <Form.Control name="priceLower" type="text" placeholder="" defaultValue={searchParams?.priceLower} onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="priceUpper" type="text" placeholder="" defaultValue={searchParams?.priceUpper} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md='5'>
              <Row className="text-center">
                <h6 className="px-1">Capacity</h6>
                <Col>
                  <Form.Group>
                    <Form.Control name="areaLower" type="number" placeholder="" defaultValue={searchParams?.areaLower} onChange={handleChange} />
                  </Form.Group>
                </Col>
                -
                <Col>
                  <Form.Group>
                    <Form.Control name="areaUpper" type="number" placeholder="" defaultValue={searchParams?.areaUpper} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row className="my-1 px-2 justify-content-around">
            <Col md='5'>
              <Form.Group>
                <Form.Label className="my-0">Capacity</Form.Label>
                <Form.Select name="capacity" defaultValue={searchParams?.capacity ?? ""} onChange={handleChange}>
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

          <Row className="my-1 px-2 justify-content-around">
            <Col md='5' className="text-center">
              <h6 className="px-1">Stay Date</h6>
              <Row>
                <Col xs='6'>
                  <Form.Group className="my-1">
                    <Form.Control name="stayStartDate" type="date" placeholder="Date" defaultValue={searchParams?.stayStartDate?.getDate()} onChange={handleChange} />
                  </Form.Group>
                </Col>
                <Col xs='6'>
                  <Form.Group className="my-1">
                    <Form.Control name="stayEndDate" type="date" placeholder="Date" defaultValue={searchParams?.stayEndDate?.getDate()} onChange={handleChange} />
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col md='5'>
              <h6>Location</h6>
              <Form.Group>
                <Form.Control name="location" type="text" placeholder="Enter Location" defaultValue={searchParams?.location} onChange={handleChange} />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group>
            <Button variant="primary" type="submit" className="mx-2">
              Search
              <AiOutlineSearch className="mx-1" />
            </Button>
          </Form.Group>
          <hr />
        </Form>
      )}
      <SearchResults searchResults={searchResults} />
    </Container>
  );
}

export default Search