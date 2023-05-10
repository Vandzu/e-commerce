import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faKey,
  faMailBulk,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import person1 from "../assets/imgs/person1.png";
import person2 from "../assets/imgs/person2.png";
import logo from "../assets/imgs/logo.png";

export default function Login() {
  return (
    <Row className="justify-content-center login align-items-center w-100 h-100">
      <Col className="left-person">
        <img src={person2} />
      </Col>
      <Col className="login-form">
        <Row className="mb-2 login-logo">
          <img src={logo} />
          <h3>
            <span>Digital</span>
            Store
            </h3>
        </Row>
        <Row className="justify-content-center">
          <Card className="w-75">
            <Card.Header className="bg-white">Faça login</Card.Header>
            <Card.Body>
              <Form className="mb-2">
                <Form.Group className="mb-2">
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faMailBulk} />
                    </InputGroup.Text>
                    <Form.Control type="email" placeholder="E-mail" />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-2">
                  <InputGroup>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                    <Form.Control type="password" placeholder="Senha" />
                  </InputGroup>
                </Form.Group>
                <Button className="w-100">
                  <FontAwesomeIcon className="me-1" icon={faRightToBracket} />
                  Login
                </Button>
              </Form>
              <Row className="justify-content-center forgot-password">
                <a>Esqueci a senha</a>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Col>
      <Col className="right-person">
        <img src={person1} />
      </Col>
    </Row>
  );
}
