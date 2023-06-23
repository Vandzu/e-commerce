import React, { useState, useEffect } from "react";
import { faFloppyDisk, faFolderPlus, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button, Row, Form, Col, ToastContainer, Toast, ToastBody, Modal } from "react-bootstrap";
import NavUp from "./NavUp";
import axios from "axios";

export default function Products() {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [textToast, setTextToast] = useState<string>('');
    const [typeToast, setTypeToast] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showModalDelete, setShowModalDelete] = useState<boolean>(false);
    const [products, setProducts] = useState<{ foto: string, descricao: string, preco: number, quantidade: number, id: number }[]>([]);
    const [product, setProduct] = useState<Object>({});

    const getProducts = async () => {
        const products = await axios.get(`http://localhost:8000/api.php?route=produtos`);
        const promises = products.data.map(async (item) => {
            const img = await axios.get(`http://localhost:8000/api.php?route=foto&path=${item.foto}`, {
                responseType: 'blob'
            });

            item.foto = URL.createObjectURL(img.data);
        });

        await Promise.all(promises);

        setProducts(products.data);
    }

    const submitForm = async (form: React.FormEvent<HTMLFormElement>) => {
        form.preventDefault();

        try {
            const formData = new FormData(form.target);
            let fotoId = '';

            if (Object.fromEntries(formData).foto.size) {
                console.log('foto: ', Object.fromEntries(formData).foto);
                fotoId = await axios.post(`http://localhost:8000/api.php?route=foto`, formData, {
                    withCredentials: true,
                    headers: {
                        "Content-Type": 'multipart/form-data'
                    }
                });
            }
            const produto = Object.fromEntries(formData);
            produto.foto = fotoId.data;

            const isUpdate = Object.values(product).length > 0;

            await axios[isUpdate ? 'put' : 'post'](`http://localhost:8000/api.php?route=produtos${isUpdate ? `/${product.id}` : ''}`, produto, {
                withCredentials: true
            })
            setTypeToast(false);
            setTextToast(`Produto ${isUpdate ? 'atualizado' : 'cadastrado'} com sucesso`);
            setShowToast(true);
            setShowModal(false);
            setProduct({});
            getProducts();
        } catch (err) {
            console.log(err);
            setTypeToast(true)
            setTextToast('Houve um erro ao cadastrar o produto');
            setShowToast(true);
        }
    }

    const editProduct = (item: Object) => {
        setProduct(item);
        setShowModal(true);
    }

    const closeModal = () => {
        setProduct({});
        setShowModal(false);
    }

    const closeModalDelete = () => {
        setProduct({});
        setShowModalDelete(false);
    }

    const deleteProductShow = item => {
        setProduct(item);
        setShowModalDelete(true);
    }

    const renderProducts = () => {
        return products.map(item => (
            <Col md={4}>
                <Card key={item.id}>
                    <Card.Header className="img-product">
                        <img src={item.foto}></img>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            {item.descricao}
                        </Row>
                        <Row>
                            R$ {item.preco}
                        </Row>
                        <Row>
                            Quantidade: {item.quantidade}
                        </Row>
                    </Card.Body>
                    <Card.Footer className="d-flex justify-content-end">
                        <Button onClick={() => editProduct(item)} className="me-2">
                            <FontAwesomeIcon icon={faPencil} className="me-2" />
                            Editar
                        </Button>
                        <Button onClick={() => deleteProductShow(item)} variant="outline-danger">
                            <FontAwesomeIcon icon={faTrash} className="me-2" />
                            Excluir
                        </Button>
                    </Card.Footer>
                </Card>
            </Col>
        ))
    }

    const deleteProduct = () => {
        axios.delete(`http://localhost:8000/api.php?route=produtos/${product.id}`, {
            withCredentials: true
        })
            .then(() => {
                setTextToast('Produto excluído com sucesso');
                setTypeToast(false);
                setShowToast(true);
                closeModalDelete();
                getProducts();
            })
            .catch(err => {
                setTextToast('Houve um erro ao excluir o produto');
                setTypeToast(true);
                setShowToast(true);
                console.log(err);
            })
    }

    useEffect(() => {
        getProducts();
    }, [])

    return (
        <>
            <NavUp />
            <Row className="justify-content-end w-100" style={{ marginTop: '100px' }}>
                <Button
                    className="w-auto me-2"
                    onClick={() => setShowModal(true)}
                >
                    Cadastrar produto
                </Button>
            </Row>
            <Row className="p-2">
                {renderProducts()}
            </Row>
            <Modal show={showModal} size="xl" onHide={() => closeModal()}>
                <Modal.Header className="d-flex justify-content-start" closeButton>
                    <FontAwesomeIcon icon={faFolderPlus} className="me-2" />
                    Cadastrar produto
                </Modal.Header>
                <Form onSubmit={submitForm}>
                    <Modal.Body>
                        <Row className="mb-2">
                            <Col>
                                <Form.Group className="d-flex align-items-start flex-column">
                                    <Form.Label>Descrição do produto</Form.Label>
                                    <Form.Control
                                        name="descricao"
                                        required
                                        defaultValue={product.descricao || ''}
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
                                        defaultValue={product.preco || ''}
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
                                        defaultValue={product.quantidade || ''}
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button type="submit">
                            <FontAwesomeIcon icon={faFloppyDisk} className="me-2" />
                            Salvar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal >
            <Modal show={showModalDelete}>
                <Modal.Header>
                    Tem certeza que deseja excluir o produto {product.descricao} ?
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Button className="w-100" onClick={deleteProduct}>
                                Sim
                            </Button>
                        </Col>
                        <Col>
                            <Button onClick={closeModalDelete} className="w-100" variant="outline-secondary">
                                Cancelar
                            </Button>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
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