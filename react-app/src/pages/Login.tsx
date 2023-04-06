import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Image } from 'react-bootstrap';
import backgroundHome from '../assets/backgroundHome.jpg';
import { IUserLogin } from "../interfaces";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { GoSignIn } from "react-icons/go";

const Login = (props: { setToken: (token: string ) => void, setIsEmployee: (val: boolean) => void } ) => {
  const [userLogin, setUserLogin] = useState<IUserLogin>({} as IUserLogin );
  const [message, setMessage] = useState<string>("");
  const loginUrl = "http://csi2532.ddns.net:5000/login";
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation(); 
    } else {
      event.preventDefault();
    }

    const body = {
      "loginInfo": userLogin,
    };

    try {
      axios.post(loginUrl, body)
      .then(response => {
        console.log(response.data);
        props.setToken(response.data.token);
        if (response.data.isEmployee) {
          props.setIsEmployee(true);
          navigate('/employee');
        } else {
          navigate(-1);
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          setMessage("Invalid email or password");
        }
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserLogin({ ...userLogin, [name]: value })
  };

  return (
    <Container fluid="lg" className="my-2 py-2 bg-light">
      <Row>
        <Col md="4">
          <Form noValidate onSubmit={handleSubmit}>
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
            <p className="text-danger">{message}</p>
            <Link style={{fontSize: "0.8rem"}} to="/signup">Create Account</Link>
            <Form.Group>
              <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">Sign In <GoSignIn /></Button>
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