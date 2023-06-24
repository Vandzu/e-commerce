import { useState } from 'react';
import { Button, Card, Col, Form, InputGroup, Row, Toast, ToastBody, ToastContainer } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import {
  faKey,
  faMailBulk,
  faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import person1 from "../assets/imgs/person1.png";
import person2 from "../assets/imgs/person2.png";
import logo from "../assets/imgs/logo.png";
import { changeId, changeAdmin } from '../redux/reducers/userSlice';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux/es/exports';

export default function Login() {
  const [formType, setFormType] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [textToast, setTextToast] = useState<string>('');
  const [toastDanger, setToastDanger] = useState<boolean>(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const login = form => {
    form.preventDefault();
    if (email && password) {
      axios.post('http://localhost:8000/api.php?route=login', {
        email: email,
        senha: password,
      }, {
        withCredentials: true
      }
      )
      .then(res => {
        dispatch(changeId(res.data.id));
        dispatch(changeAdmin(res.data.admin));
        navigate(res.data.admin ? "/products" : "/store");
      })
      .catch(err => {
        console.error(err);
        setTextToast('Usuário ou senha incorreto');
        setShowToast(true);
      });
    }
  }

  const register = form => {
    form.preventDefault();
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        axios.post('http://localhost:8000/api.php?route=usuarios', {
          nome: name,
          email: email,
          senha: password,
          endereco: address,
          administrador: 0,
        }, {
          withCredentials: true
        }).then(() => {
          setTextToast('Usuário cadastrado com sucesso');
          setToastDanger(false);
          setShowToast(true);
        }).catch(err => {
          setTextToast('Erro ao cadastrar usuário');
          setToastDanger(true);
          setShowToast(true);
          console.log(err);
        })
      } else {
        setTextToast('As senhas não correspondem');
        setShowToast(true);
      }
    }
  }

  return (
    <Row className="justify-content-center login align-items-center w-100 h-100 m-auto">
      <Col className="left-person">
        <img src={person2} />
      </Col>
      <Col xl={4} lg={4} md={12} className="login-form">
        <Row className="mb-2 login-logo">
          <img src={logo} />
          <h3>
            <span>Digital</span>
            Store
          </h3>
        </Row>
        <Row className="justify-content-center card-default">
          <Card>
            <Card.Header className="bg-white">{formType ? 'Registre sua conta' : 'Faça login'}</Card.Header>
            <Card.Body>
              <Form className="mb-2" onSubmit={e => formType ? register(e) : login(e)}>
                <Form.Group className="mb-2">
                  <InputGroup className="flex-row-reverse">
                    <Form.Control
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      name="email"
                      type="email"
                      placeholder="E-mail"
                      required
                    />
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faMailBulk} />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-2">
                  <InputGroup className="flex-row-reverse">
                    <Form.Control
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      name="password"
                      type="password"
                      placeholder="Senha"
                      required
                    />
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faKey} />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
                {formType && (
                  <>
                    <Form.Group className="mb-2">
                      <InputGroup className="flex-row-reverse">
                        <Form.Control
                          value={confirmPassword}
                          onChange={e => setConfirmPassword(e.target.value)}
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirmação de senha"
                          required
                        />
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faKey} />
                        </InputGroup.Text>
                      </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        name="address"
                        placeholder="Endereço"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-2">
                      <Form.Control
                        value={name}
                        onChange={e => setName(e.target.value)}
                        name="name"
                        placeholder="Nome"
                        required
                      />
                    </Form.Group>
                  </>
                )}
                <Button
                  type="submit"
                  className="w-100"
                >
                  <FontAwesomeIcon className="me-1" icon={faRightToBracket} />
                  {formType ? 'Registrar' : 'Login'}
                </Button>
              </Form>
              <Row
                hidden={formType}
                className="justify-content-center forgot-password"
              >
                <a>Esqueci a senha</a>
              </Row>
              <Row className="justify-content-center">
                <Button
                  hidden={formType}
                  onClick={() => setFormType(true)}
                  variant="outline-info"
                >
                  Criar usuário
                </Button>
              </Row>
              <Row
                hidden={!formType}
                className='justify-content-center'
              >
                <Button
                  onClick={() => setFormType(false)}
                  variant='outline-secondary'
                >
                  Voltar para login
                </Button>
              </Row>
            </Card.Body>
          </Card>
        </Row>
      </Col>
      <Col className="right-person">
        <img src={person1} />
      </Col>
      <ToastContainer position='top-end' className='mt-2'>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          className={`bg-${toastDanger ? 'danger text-white' : 'success'}`}
        >
          <ToastBody>
            {textToast}
          </ToastBody>
        </Toast>
      </ToastContainer>
    </Row>
  );
}
