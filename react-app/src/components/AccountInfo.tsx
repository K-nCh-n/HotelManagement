import React, { useState } from 'react';
import { Form, Row, Col, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { IEmployeeInfo, IUserInfo } from '../interfaces';
import { BiArrowBack } from 'react-icons/bi';

const AccountInfo = (props: { user?: IUserInfo|IEmployeeInfo, setShowEditInfo?: React.Dispatch<React.SetStateAction<boolean>>, setUserInfo?: (user: IUserInfo|IEmployeeInfo) => void, isEmployee: boolean  }) => {
  const [formData, setFormData] = useState<IUserInfo|IEmployeeInfo>(props.user ?? {} as IUserInfo);
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const signupUrl = "http://csi2532.ddns.net:5000/signup";
  const editInfoUrl = "http://csi2532.ddns.net:5000/editaccountinfo";
  const employeeSignUpUrl = "http://csi2532.ddns.net:5000/employeeSignUp";
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

    let body: any;

    if (props.isEmployee && "hotelId" in formData) {
      body = {
        "employeeInfo": formData,
      };
    } else {
      body = {
        "clientInfo": formData,
      };
    }
    
    if (props.user) {
      body = {
        "employeeInfo": formData,
        "isEmployee": props.isEmployee,
      }
      axios.post(editInfoUrl, body).then(response => {
        console.log(response.data);
        if (props.setShowEditInfo) props.setShowEditInfo(false);
        if (props.setUserInfo) props.setUserInfo(formData);
      });
    } else if (props.isEmployee) {
      axios.post(employeeSignUpUrl, body).then(response => {
        console.log(response.data);
      });
    } else {
      axios.post(signupUrl, body).then(response => {
        console.log(response.data);
        navigate('/login');
      }).catch(error => {
        console.log(error);
        setErrorMessage(error.response.data);
      });
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value.trim() })
  };

  return (
    <Container>
      {props.user && <Button className="btn btn-secondary" onClick={() => props.setShowEditInfo && props.setShowEditInfo(false)}><BiArrowBack size={30} /></Button>}
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
              <Form.Control name="NAS" type="text" placeholder="Enter your SIN" defaultValue={props.user?.NAS} onChange={handleChange} required />
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
        {
          props.isEmployee && (
            <Row className="py-2">
              <Col md="6">
                <Form.Group>
                  <Form.Label>Hotel ID</Form.Label>
                  <Form.Control name="hotelId" type="number" placeholder="Enter your hotel ID" defaultValue={(props.user && "hotelId" in props.user) ? props.user.hotelId : undefined} onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please enter your hotel ID.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              {!props.user && <Col md="6">
                <Form.Group>
                  <Form.Label>Yearly Salary</Form.Label>
                  <Form.Control name="yearlySalary" type="number" placeholder="Enter your yearly salary" onChange={handleChange} required />
                  <Form.Control.Feedback type="invalid">
                    Please enter your yearly salary.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>}
            </Row>)
        }
        <Form.Group>
          <Button variant="primary rounded-pill px-3 py-2 my-2" type="submit">{props.isEmployee ? (props.user ? "Edit Account" : "Add New Employee") : (props.user ? "Save" : "Sign Up")}</Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default AccountInfo;