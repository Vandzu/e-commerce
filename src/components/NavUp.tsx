import { Container, Nav, Navbar, Form, InputGroup, Button, Col, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/imgs/logo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function NavUp() {
  const navigate = useNavigate();

  const logout = () => {
    axios.delete('http://localhost:8000/api.php?route=login', {
      withCredentials: true,
    })
    .then(() => {
      navigate('/')
    })
    .catch(err => console.log(err));
  }

  return (
    <Navbar bg="light" expand="lg" className="position-fixed w-100">
      <Container className='d-flex justify-content-between nav-items'>
        <Navbar.Brand className="logo" href="#home">
          <img src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav>
          <Form.Group>
            <InputGroup>
              <InputGroup.Text className='bg-primary'>
                <FontAwesomeIcon icon={faSearch} />
              </InputGroup.Text>
              <Form.Control
                placeholder='Pesquisar produtos'
              />
            </InputGroup>
          </Form.Group>
        </Nav>
        <Row className='justify-content-end'>
          <Button className='w-auto me-2'>
            <FontAwesomeIcon icon={faCartShopping} />
          </Button>
          <Button
            onClick={logout}
            className='text-white w-auto me-2'
            variant='secondary'
          >
            <FontAwesomeIcon icon={faArrowAltCircleRight} className='me-1' />
            Logout
          </Button>
        </Row>
      </Container>
    </Navbar>
  );
}