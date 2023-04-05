import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IUserInfo } from '../interfaces';

const ClientInfo = (props: { user?: IUserInfo, setShowEditInfo?: React.Dispatch<React.SetStateAction<boolean>>, setUserInfo?: (user: IUserInfo) => void }) => {
  const [formData, setFormData] = useState<IUserInfo>(props.user ?? {} as IUserInfo);
  const [validated, setValidated] = useState(false);
  const signupUrl = "http://localhost:5000/signup";
  const editInfoUrl = "http://localhost:5000/editaccountinfo";
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log(formData)
      event.preventDefault();
    }

    setValidated(true);

    const body = {
      "clientInfo": formData,
    };
    
    if (props.user) {
      axios.post(editInfoUrl, body).then(response => {
        console.log(response.data);
        if (props.setShowEditInfo) props.setShowEditInfo(false);
        if (props.setUserInfo) props.setUserInfo(formData);
      });
    } else {
      axios.post(signupUrl, body).then(response => {
        console.log(response.data);
        navigate('/login');
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value })
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="py-2">
        <Col md="6">
          <Form.Group>
            <Form.Label>Email</Form.Label>
            <Form.Control name="email" type="text" placeholder="Enter your Email" defaultValue={props.user?.email} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter your Email.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md="6">
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control name="password" type="password" onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter a valid password.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="py-2">
        <Col md="6">
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control name="firstName" type="text" placeholder="Enter your first name" defaultValue={props.user?.firstName} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter your first name.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md="6">
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control name="lastName" type="text" placeholder="Enter your last name" defaultValue={props.user?.lastName} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter your last name.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="py-2">
        <Col md="6">
          <Form.Group>
            <Form.Label>Social Insurance Number (SIN/NAS)</Form.Label>
            <Form.Control name="customerNas" type="text" placeholder="Enter your SIN" defaultValue={props.user?.customerNas} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter a valid NAS.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md="6">
          <Form.Group>
            <Form.Label>Address</Form.Label>
            <Form.Control name="address" type="text" placeholder="Enter your address" defaultValue={props.user?.address} onChange={handleChange} required />
            <Form.Control.Feedback type="invalid">
              Please enter your address.
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group>
        <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">{props.user ? "Save" : "Sign Up"}</Button>
      </Form.Group>
    </Form>
  );
};

export default ClientInfo;