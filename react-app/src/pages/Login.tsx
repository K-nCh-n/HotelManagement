import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import backgroundHome from '../assets/backgroundHome.jpg';
import { IUserLogin } from "../interfaces";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = (props: { setToken: (token: string ) => void, setIsEmployee: (val: boolean) => void } ) => {
  const [validated, setValidated] = useState(false);
  const [userLogin, setUserLogin] = useState<IUserLogin>({} as IUserLogin );
  const loginUrl = "http://localhost:5000/login";
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      console.log(userLogin);
      event.preventDefault();
    }

    setValidated(true);

    const body = {
      "loginInfo": userLogin,
    };

    axios.post(loginUrl, body).then(response => {
      console.log(response.data);
      props.setToken(response.data.token);
      if (response.data.isEmployee) {
        props.setIsEmployee(true);
        navigate('/employee');
      } else {
        navigate(-1);
      }
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserLogin({ ...userLogin, [name]: value })
  };

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      <Row>
        <Col md="4">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control name="email" type="email" placeholder="Enter your email" onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Please enter a valid email.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Enter password" onChange={handleChange} required />
              <Form.Control.Feedback type="invalid">
                Please enter a password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
              <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">Sign In</Button>
            </Form.Group>
          </Form>
        </Col>
        <Col md="8">
          <Image className="card-img-top opacity-25" src={backgroundHome} alt="BackgroundImage" fluid />
        </Col>
      </Row>
    </Container>
  );
}

export default Login