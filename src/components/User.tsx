import { useState, useEffect } from 'react';
import { Card, Row, Form, Button, Toast, ToastContainer, ToastBody } from "react-bootstrap";
import NavUp from "./NavUp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useSelector } from 'react-redux/es/hooks/useSelector';
import { changeId } from '../redux/reducers/userSlice';
import { useDispatch } from 'react-redux';

export default function User() {
    const user = useSelector(state => state.user);
    const dispatch = useDispatch();
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [userData, setUserData] = useState<object>({});
    const [showToast, setShowToast] = useState<boolean>(false);
    const [textToast, setTextToast] = useState<string>('');
    const [typeToast, setTypeToast] = useState<boolean>(false);

    useEffect(() => {
        if (user.id) {
            axios.get(`http://localhost:8000/api.php?route=usuarios/${user.id}`,
                {
                    withCredentials: true
                })
                .then(res => {
                    setName(res.data.nome);
                    setEmail(res.data.email);
                    setAddress(res.data.endereco);
                    setUserData(res.data);
                })
                .catch(err => console.log(err));
        }
    }, [user.id]);

    const update = form => {
        form.preventDefault();
        axios.put(`http://localhost:8000/api.php?route=usuarios/${user.id}`, {
            ...userData,
            nome: name,
            email: email,
            endereco: address
        }, {
            withCredentials: true
        })
            .then(() => {
                setTypeToast(false);
                setTextToast('Atualização realizada com êxito');
                setShowToast(true);
            })
            .catch(err => {
                setTypeToast(true);
                setTextToast('Erro ao atualizar');
                setShowToast(true);
                console.log(err);
            })
    }

    return (
        <>
            <NavUp />
            <Row className="justify-content-center align-items-center w-100 h-100">
                <Card className="card-default w-25 h-auto">
                    <Card.Header className="bg-white">Alterar dados</Card.Header>
                    <Form onSubmit={update}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Form.Group>
                                    <Form.Control
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        name="name"
                                        placeholder="Nome"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <Form.Group>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        name="email"
                                        placeholder="E-mail"
                                        type="email"
                                    />
                                </Form.Group>
                            </Row>
                            <Row className="mb-2">
                                <Form.Group>
                                    <Form.Control
                                        value={address}
                                        onChange={e => setAddress(e.target.value)}
                                        name="endereco"
                                        placeholder="Endereço"
                                    />
                                </Form.Group>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="bg-white">
                            <Button
                                type="submit"
                            >
                                <FontAwesomeIcon
                                    icon={faFloppyDisk}
                                    className="me-1"
                                />
                                Atualizar
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </Row>
            <ToastContainer position='top-end' className='mt-2'>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={5000}
                    autohide
                    className={`bg-${typeToast ? 'danger text-white' : 'success'}`}
                >
                    <ToastBody>
                        {textToast}
                    </ToastBody>
                </Toast>
            </ToastContainer>
        </>
    )
}