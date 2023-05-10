import { Container, Nav, Navbar, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png'

export default function NavUp() {
  return (
    <Navbar bg="light" expand="lg">
      <Container className='d-flex justify-content-between nav-items'>
        <Navbar.Brand className="logo" href="#home">
          <img src={logo} />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Nav>
            <Form.Group>
              <InputGroup>
                <InputGroup.Text className='bg-primary'>
                  <FontAwesomeIcon icon={faSearch}/>
                </InputGroup.Text>
                <Form.Control
                  placeholder='Pesquisar produtos'
                />
              </InputGroup>
            </Form.Group>
          </Nav>
          <Button>
            <FontAwesomeIcon icon={faCartShopping} />
          </Button>
      </Container>
    </Navbar>
  );
}