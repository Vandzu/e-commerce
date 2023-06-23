import React, { useState } from "react";
import { faFloppyDisk, faFolderPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button, Row, Form, Col, ToastContainer, Toast, ToastBody } from "react-bootstrap";
import NavUp from "./NavUp";
import axios from "axios";

export default function Products() {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [textToast, setTextToast] = useState<string>('');
    const [typeToast, setTypeToast] = useState<boolean>(false);

    const cadastrar = async (form: React.FormEvent<HTMLFormElement>) => {
        form.preventDefault();

        try {
            const formData = new FormData(form.target);
            const fotoId = await axios.post(`http://localhost:8000/api.php?route=foto`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": 'multipart/form-data'
                }
            });
            const produto = Object.fromEntries(formData);
            console.log('produto: ', produto);
            produto.foto = fotoId.data;
            await axios.post(`http://localhost:8000/api.php?route=produtos`, produto, {
                withCredentials: true
            })
            setTypeToast(false);
            setTextToast('Produto cadastrado com sucesso');
            setShowToast(true);

        } catch (err) {
            console.log(err);
            setTypeToast(true)
            setTextToast('Houve um erro ao cadastrar o produto');
            setShowToast(true);
        }
    }

    return (
        <>
            <NavUp />
            <Row className="justify-content-center align-items-center w-100 h-100 m-auto">
                <Card className="card-products w-75 h-auto">
                    <Card.Header className="bg-white d-flex align-items-center">
                        <FontAwesomeIcon icon={faFolderPlus} className="me-2" />
                        Cadastrar produto
                    </Card.Header>
                    <Form onSubmit={cadastrar}>
                        <Card.Body>
                            <Row className="mb-2">
                                <Col>
                                    <Form.Group className="d-flex align-items-start flex-column">
                                        <Form.Label>Descrição do produto</Form.Label>
                                        <Form.Control
                                            name="descricao"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="d-flex align-items-start flex-column">
                                        <Form.Label>Preço do produto</Form.Label>
                                        <Form.Control
                                            name="preco"
                                            type="number"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="d-flex align-items-start flex-column">
                                        <Form.Label>Quantidade do produto</Form.Label>
                                        <Form.Control
                                            name="quantidade"
                                            type="number"
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group className="d-flex align-items-start flex-column">
                                        <Form.Label>Foto do produto</Form.Label>
                                        <Form.Control
                                            name="foto"
                                            type="file"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="bg-white d-flex justify-content-end">
                            <Button type="submit">
                                <FontAwesomeIcon icon={faFloppyDisk} className="me-2" />
                                Salvar
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