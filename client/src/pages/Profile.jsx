import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/esm/Container";
import {  Card, Image, Form } from "react-bootstrap";
import jwt from "jwt-decode";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import imgp1 from "../assets/img/imgp1.png";
import imgp2 from "../assets/img/imgp2.png";
import imgp3 from "../assets/img/imgp3.png";
import imgp4 from "../assets/img/imgp4.png";
import imgp5 from "../assets/img/imgp5.png";
import imgp6 from "../assets/img/imgp6.png";
import imgp7 from "../assets/img/imgp7.png";
import CodeQr from "../assets/img/note.png";
import Button from "react-bootstrap/esm/Button";
import ChangePassword from "../components/ChangePassword";
import { useContext } from "react";
import { UserContext } from "../context/userContext";
import NavbarWithSearch from "../components/NavbarWithSearch";
import { useQuery, useMutation } from "react-query";
import { API } from "../config/api";

export default function Profile(props) {
  useEffect(() => {
    document.body.style.background = "rgba(196, 196, 196, 0.25)";
  });

  const [state, dispatch] = useContext(UserContext);

  const [modalShow, setModalShow] = React.useState(false);

  const getToken = localStorage.getItem("token");

  const hasilDecode = jwt(getToken);

  // console.log(hasilDecode.id);

  // Fetching data from database
  const { data: user, refetch } = useQuery("userCache", async () => {
    const response = await API.get("/user/" + hasilDecode.id);
    console.log("ini response nyaa", response);
    return response.data.data;
  });

  const [photo, setPhoto] = useState({
    image: "",
  });

  const handleChangePhoto = (e) => {
    const { name, type } = e.target;
    setPhoto({
      ...photo,
      [name]: type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      console.log("blob image", url);
    }
  };

  const handleUpdate = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();
      if (photo.image) {
        formData.set("image", photo?.image[0], photo?.image[0]?.name);
      }

      const response = await API.patch("/user/" + hasilDecode.id, formData);
      console.log("berhasil mengubah photo profile", response);

      photo.image = "";
      refetch();
    } catch (error) {
      console.log(error);
    }
  });

  useEffect(() => {
    if (photo) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photo]);

  console.log("ini data usernya", user);
  return (
    <div className="">
      <NavbarWithSearch />
      <Container className="">
        <Row className="pp justify-content-between bg-white">
          <Col className="d-flex flex-column gap-4" sm={4}>
            <h3 className="fw-bold ">Personal Info</h3>
            <div className="d-flex align-items-center gap-3">
              <div>
                <img width={40} src={imgp3} alt="" />
              </div>
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.fullname}</span>
                <span className="fs14 text-secondary">Full Name</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={40} src={imgp2} alt="" />
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.email}</span>
                <span className="fs14 text-secondary">Email</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={40} src={imgp6} alt="" />
              <div className="d-flex flex-column">
                <Button onClick={() => setModalShow(true)} className="btn btn-dark bg-white text-primary fw-bold p-0 m-0 border-0">
                  Change Password
                </Button>
                <ChangePassword show={modalShow} onHide={() => setModalShow(false)} />
                <span className="p-0 m-0">Password</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={40} src={imgp7} alt="" />
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.listAsRole}</span>
                <span className="fs14 text-secondary">Status</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={40} src={imgp5} alt="" />
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.gender}</span>
                <span className="fs14 text-secondary">Gender</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={39} src={imgp1} alt="" />
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.phone}</span>
                <span className="fs14 text-secondary">Phone</span>
              </div>
            </div>
            <div className="d-flex align-items-center gap-3">
              <img width={40} src={imgp4} alt="" />
              <div className="d-flex flex-column">
                <span className="p-0 m-0 fw-semibold">{state.user.address}</span>
                <span className="fs14 text-secondary">Address</span>
              </div>
            </div>
          </Col>
          <Col className="p-0 d-flex flex-column gap-3" sm={4}>
          <div>
              <Card style={{ width: "18rem" }}>
                {localStorage.getItem("role") === "Tenant" ? (
                  <Card.Img variant="top" src={imgp1} />
                ) : (
                  <Card.Img
                    variant="top"
                    style={{
                      maxWidth: "18rem",
                      minHeight: "18rem",
                      objectFit: "cover",
                    }}
                    src={user?.image}
                  />
                )}
              </Card>
              {/* <Button className="btn btn-primary mt-2 w-100">
                Change Photo Profile
              </Button> */}
              <Form
                onSubmit={(e) => handleUpdate.mutate(e)}
                className="mt-2 w-100"
                style={{
                  maxWidth: "18rem",
                  objectFit: "cover",
                }}
              >
                <Form.Group className="mb-5">
                  <Form.Control
                    type="file"
                    id="upload"
                    name="image"
                    onChange={handleChangePhoto}
                    required
                  />
                  <Button
                    className="btn btn-primary mt-2 w-100"
                    type="submit"
                    style={{
                      maxWidth: "18rem",
                      objectFit: "cover",
                    }}
                  >
                    Change Photo Profile
                  </Button>
                </Form.Group>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
