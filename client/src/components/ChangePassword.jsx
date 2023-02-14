import React, { useState} from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useMutation } from "react-query"
import { API } from "../config/api"
import { useNavigate } from "react-router-dom";

export default function ChangePassword(props) {
  const navigate = useNavigate();

  const [password, setPassword] = useState({
    old_password: "",
    new_password: "", 
    confirm_password: "",
  });

  const handlePassword = (e) => {
    setPassword({
      ...password,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      const response = await API.patch("/changePass", password);
      console.log("Success Password");

      if (password.new_password != password.confirm_password) {
        return alert("new password and confirm don't match!!")
      } 
      navigate(`/`);

      alert("Successs Change Password")
    } catch (error) {
      console.log(error);
    };
  });


  return (
    <Modal {...props} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Body className="m-4 mt-0">
        <h3 className="fw-bold text-center my-5">Change Password</h3>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-bold">Old Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="old_password" value={password.old_password} onChange={handlePassword}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-bold">New Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="new_password" value={password.new_password} onChange={handlePassword}/>
          </Form.Group>
          <Form.Group className="mb-3" controlId="password">
            <Form.Label className="fw-bold">Confirm Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="confirm_password" value={password.confirm_password} onChange={handlePassword}/>
          </Form.Group>
          <Button className="w-100" type="submit">Save</Button>
          </Form>
      </Modal.Body>
    </Modal>
  );
}
