import React, { useEffect, useState } from "react";
import { Container, Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { IHotel, IRoomAugmented } from "../interfaces";
import axios from "axios";

const EditHotelInfo = (props: { isEmployee: boolean } ) => {
  const addHotelChainUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/addHotelChain`;
  const addHotelUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/addHotel`;
  const addRoomUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/addRoom`;

  const editHotelChainUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/editHotelChain`;
  const editHotelUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/editHotel`;
  const editRoomUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/editRoom`;

  const deleteHotelChainUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/deleteHotelChain`;
  const deleteHotelUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/deleteHotel`;
  const deleteRoomUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/deleteRoom`;

  const getChainUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/getHotelChains`;
  const getHotelUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/getHotels`;
  const getRoomUrl = `http://${process.env.REACT_APP_BACKEND_BASEURL}/getRooms`;

  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedHotel, setSelectedHotel] = useState<IHotel>({} as IHotel);

  useEffect(() => {
    const getHotelChains = () => {
      let ignore = false;
      try {
        axios.get(getChainUrl).then(response => {
          if (!ignore) {
            setHotelChains(response.data);
            setFilteredHotelChains(response.data);
          }
        });
      } catch (error) {
        console.log(error);
      }
      return () => { ignore = true; };
    }
    getHotelChains();
  }, []);

  const [hotelChains, setHotelChains] = useState<string[]>([]);
  const [filteredHotelChains, setFilteredHotelChains] = useState<string[]>([]);

  const handleChainSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilteredHotelChains(hotelChains.filter(hotelChain => {
      return hotelChain.toLowerCase().includes(event.currentTarget.chainName.value.toLowerCase());
    }));
  };

  const displayHotelChains = () => {
    return filteredHotelChains.map((hotelChain, index) => {
      const getHotels = () => {
        setSelectedChain(hotelChain);
        axios.get(`${getHotelUrl}/${hotelChain}`).then(response => {
          setHotels(response.data);
          setFilteredHotels(response.data);
        });
      };
      const deleteChain = () => {
        axios.delete(`${deleteHotelChainUrl}/${hotelChain}`).then(response => {
          alert("Deleted");
          setHotelChains(hotelChains.filter(hotelChain => hotelChain !== response.data));
          setFilteredHotelChains(hotelChains.filter(hotelChain => hotelChain !== response.data));
        });
      };
      return (
        <Row key={index}>
          <Col><h5>{hotelChain}</h5></Col>
          <Col>
            <Button variant="primary" className="my-2" onClick={getHotels}>Select</Button>
          </Col>
          <Col>
            <Button variant="danger" className="my-2" onClick={deleteChain}>Delete</Button>
          </Col>
          <hr className="my-2" />
        </Row>
      );
    });
  };

  const [hotels, setHotels] = useState<IHotel[]>([]);
  const [filteredHotels, setFilteredHotels] = useState<IHotel[]>([]);

  const handleHotelSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFilteredHotels(hotels.filter(hotel => {
      const hotelString = hotel.address + hotel.zone 
      return hotelString.toLowerCase().includes(event.currentTarget.hotelName.value.toLowerCase());
    }));
  };

  const displayHotels = () => {
    return filteredHotels.map((hotel, index) => {
      const getRooms = () => {
        setSelectedHotel(hotel);
        axios.get(`${getRoomUrl}/${hotel.hotelId}`).then(response => {
          setRooms(response.data);
        });
      };
      const deleteHotel = () => {
        axios.delete(`${deleteHotelUrl}/${hotel.hotelId}`).then(response => {
          alert("Deleted");
          setHotels(hotels.filter(hotel => hotel.hotelId !== response.data));
          setFilteredHotels(hotels.filter(hotel => hotel.hotelId !== response.data));
        });
      };
      return (
        <Row key={index}>
          <Col>
            <h5>{hotel.chainName} {hotel.zone}</h5>
            <span>{hotel.address}</span>
          </Col>
          <Col>
            <Button variant="primary" className="my-2" onClick={getRooms}>Select</Button>
          </Col>
          <Col>
            <Button variant="danger" className="my-2" onClick={deleteHotel}>Delete</Button>
          </Col>
          <hr className="my-2" />
        </Row>
      );
    });
  };

  const [rooms, setRooms] = useState<IRoomAugmented[]>([]);

  const displayRooms = () => {
    return rooms.map((room, index) => {
      const deleteRoom = () => {
        axios.delete(`${deleteRoomUrl}/${room.roomId}`).then(response => {
          alert("Deleted");
          setRooms(rooms.filter(room => room.roomId !== response.data.roomId));
        });
      };
      return (
        <Row key={index}>
          <Col>
            <h5 className="btn fw-bold">{room.roomId}</h5>
            <p>Price: {room.price}</p>
          </Col>
          <Col>
            <Button variant="danger" className="my-2" onClick={deleteRoom}>Delete</Button>
          </Col>
          <hr className="my-2" />
        </Row>
      );
    });
  };

  const [showAddChainModal, setShowAddChainModal] = useState<boolean>(false);
  const [showAddHotelModal, setShowAddHotelModal] = useState<boolean>(false);
  const [showAddRoomModal, setShowAddRoomModal] = useState<boolean>(false);

  const handleCloseChainModal = () => setShowAddChainModal(false);
  const handleCloseHotelModal = () => setShowAddHotelModal(false);
  const handleCloseRoomModal = () => setShowAddRoomModal(false);

  const chainModal = () => {
    const addHotelChain = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      axios.post(addHotelChainUrl, { chainName: event.currentTarget.chainName.value }).then(response => {
        alert("Added");
        setHotelChains([...hotelChains, response.data]);
        setFilteredHotelChains([...filteredHotelChains, response.data]);
        handleCloseChainModal();
      });
    };
    return (
      <Modal show={showAddChainModal} onHide={() => handleCloseChainModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Chain</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={addHotelChain}>
            <Form.Group>
              <Form.Label>Chain Name</Form.Label>
              <Form.Control type="text" name="chainName" placeholder="Enter chain name" />
            </Form.Group>
            <Button className="my-2" variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const hotelModal = () => {
    const addHotel = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      axios.post(addHotelUrl, 
        {
          chainName: event.currentTarget.chainName.value,
          zone: event.currentTarget.zone.value,
          address: event.currentTarget.address.value,
          email: event.currentTarget.email.value,
          phoneNumber: event.currentTarget.phone.value
        }).then(response => {
        alert("Added");
        setHotels([...hotels, response.data]);
        setFilteredHotels([...filteredHotels, response.data]);
        handleCloseHotelModal();
      });
    };
    return (
      <Modal show={showAddHotelModal} onHide={() => handleCloseHotelModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Hotel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={addHotel}>
            <Form.Group>
              <Form.Label>Chain Name</Form.Label>
              <Form.Control type="text" name="chainName" value={selectedChain} disabled placeholder="Enter chain name" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Zone</Form.Label>
              <Form.Control type="text" name="zone" defaultValue={""} placeholder="Enter zone" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" defaultValue={""} placeholder="Enter address" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="text" name="email" defaultValue={""} placeholder="Enter email" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control type="text" name="phone" defaultValue={""} placeholder="Enter phone" />
            </Form.Group>
            <Button className="my-2" variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  const roomModal = () => {
    const addRoom = (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      axios.post(addRoomUrl,
        {
          hotelId: selectedHotel.hotelId,
          price: event.currentTarget.price.value,
          commodities: event.currentTarget.commodities.value,
          capacity: event.currentTarget.capacity.value,
          view: event.currentTarget.view.value,
          extendable: event.currentTarget.extendable.checked,
          problems: event.currentTarget.problems.value,
          image: event.currentTarget.image.value
        }).then(response => {
        alert("Added");
        setRooms([...rooms, response.data]);
        handleCloseRoomModal();
      });
    };
    return (
      <Modal show={showAddRoomModal} onHide={() => handleCloseRoomModal()}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Room</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate onSubmit={addRoom}>
            <Form.Group>
              <Form.Label>Hotel Id</Form.Label>
              <Form.Control type="text" name="hotelId" value={selectedHotel.hotelId} disabled placeholder="Enter hotel id" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" name="price" defaultValue={""} placeholder="Enter price" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Commodities</Form.Label>
              <Form.Control type="text" name="commodities" defaultValue={""} placeholder="Enter commodities" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Capacity</Form.Label>
              <Form.Control type="number" name="capacity" defaultValue={""} placeholder="Enter capacity" />
            </Form.Group>
            <Form.Group>
              <Form.Label>View</Form.Label>
              <Form.Control type="text" name="view" defaultValue={""} placeholder="Enter view" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Extendable</Form.Label>
              <Form.Check name="extendable" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Problems</Form.Label>
              <Form.Control type="text" name="problems" defaultValue={""} placeholder="Enter problems" />
            </Form.Group>
            <Form.Group>
              <Form.Label>Image URL</Form.Label>
              <Form.Control type="text" name="image" defaultValue={""} placeholder="Enter image" />
            </Form.Group>
            <Button className="my-2" variant="primary" type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      {chainModal()}
      {hotelModal()}
      {roomModal()}
      <Row>
        <Col md="4">
          <Row>
            <Col>
              <h3>Hotel Chains</h3>
            </Col>
            <Col md="3">
              <Button variant="primary" className="my-2" onClick={() => setShowAddChainModal(true)}>Add</Button>
            </Col>
          </Row>
          <Form noValidate onSubmit={handleChainSubmit} className="mb-2">
            <Row>
              <Col md="8">
                <Form.Group>
                  <Form.Control type="text" name="chainName" placeholder="Enter chain name" />
                </Form.Group>
              </Col>
              <Col md="4">
                <Form.Group>
                  <Button variant="primary" type="submit">Filter</Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <hr />
          {displayHotelChains()}
        </Col>
        {selectedChain !== "" &&
          <Col md="4">
            <Row>
              <Col>
                <h3>{selectedChain} Hotels</h3>
              </Col>
              <Col md="3">
                <Button variant="primary" className="my-2" onClick={() => setShowAddHotelModal(true)}>Add</Button>
              </Col> 
            </Row>
            <Form noValidate onSubmit={handleHotelSubmit}>
              <Row>
                <Col md="8">
                  <Form.Group>
                    <Form.Control type="text" name="hotelName" placeholder="Enter hotel name" />
                  </Form.Group>
                </Col>
                <Col md="4">
                  <Form.Group>
                    <Button variant="primary" type="submit">Filter</Button>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <hr />
            {displayHotels()}
          </Col>}
        {selectedChain !== "" && selectedHotel.hotelId &&
          <Col md="4">
            <Row>
              <Col>
                <h3>{selectedChain} {selectedHotel.zone} Rooms</h3>
              </Col>
              <Col md="3">
                <Button variant="primary" className="my-2" onClick={() => setShowAddRoomModal(true)}>Add</Button>
              </Col>
            </Row>
            {displayRooms()}
          </Col>}
      </Row>
    </Container>
  );
}

export default EditHotelInfo