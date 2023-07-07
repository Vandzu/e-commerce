import { Container, Nav, Navbar, Form, InputGroup, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCartShopping, faArrowAltCircleRight, faLayerGroup, faListUl, faUser, faRectangleList } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/imgs/logo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

export default function NavUp() {
  const navigate = useNavigate();
  const user = useSelector(state => state.user);

  const logout = () => {
    axios.delete('http://localhost:8000/api.php?route=login', {
      withCredentials: true,
    })
      .then(() => {
        navigate('/');
      })
      .catch(err => console.log(err));
  }

  return (
    <Navbar bg="light" expand="lg" className="position-fixed w-100">
      <Container className='d-flex justify-content-between nav-items'>
        <Navbar.Brand className="logo" href="/store">
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
          {user.admin ? (
            <>
              <Button
                className='w-auto me-2 text-white'
                title='Gerenciar produtos'
                variant="danger"
                onClick={() => navigate('/products')}
              >
                <FontAwesomeIcon icon={faLayerGroup} />
              </Button><Button
                className='w-auto me-2'
                title='Gerenciar Categorias'
                variant="info text-white"
                onClick={() => navigate('/categories')}
              >
                <FontAwesomeIcon icon={faListUl} />
              </Button></>
          ) : ''}
          {!user.admin ? (
            <Button
            className='w-auto me-2'
            title="Loja"
            onClick={() => navigate('/store')}
          >
            <FontAwesomeIcon icon={faCartShopping} />
          </Button>
          ) : ''}
          <Button
            variant="success"
            className='w-auto me-1'
            title='Dados pessoais'
            onClick={() => navigate('/user')}
          >
            <FontAwesomeIcon icon={faUser} />
          </Button>
          <Button
            variant='warning'
            className='w-auto me-1'
            title={`Histórico de ${user.admin ? 'vendas' : 'compras'}`}
            onClick={() => navigate('/sales')}
          >
            <FontAwesomeIcon icon={faRectangleList} />
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