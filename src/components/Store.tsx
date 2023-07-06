import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Row, Col, Alert, Button, Badge, Modal, ListGroup, ListGroupItem, ToastContainer, Toast, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileText, faMoneyBill, faList, faPlusCircle, faShoppingCart, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import NavUp from "./NavUp";

export default function Store() {
    const [products, setProducts] = useState<{ foto: string, descricao: string, preco: number, quantidade: number, id: number }[]>([]);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [toastDanger, setToastDanger] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [textToast, setTextToast] = useState<string>('Produto adicionado ao carrinho');
    const [shoppingCartList, setShoppingCartList] = useState<{ foto: string, descricao: string, preco: number, quantidade: number, id: number }[]>([]);

    const getProducts = async () => {
        const products = await axios.get(`http://localhost:8000/api.php?route=produtos`);
        const promises = products.data.map(async (item: { foto: string, descricao: string, preco: number, quantidade: number, id: number }) => {
            const img = await axios.get(`http://localhost:8000/api.php?route=foto&path=${item.foto}`, {
                responseType: 'blob'
            });

            item.foto = URL.createObjectURL(img.data);
        });

        await Promise.all(promises);
        setProducts(products.data);
    }

    useEffect(() => {
        getProducts();
        axios.get(`http://localhost:8000/api.php?route=venda`, {
            withCredentials: true
        });
    }, [])

    const confirmBuy = () => {
        if (shoppingCartList.length) {
            axios.post(`http://localhost:8000/api.php?route=venda`, {
                produtos: shoppingCartList
            }, {
                withCredentials: true
            })
            .then(() => {
                setToastDanger(false);
                setTextToast('Compra realizada com sucesso');
                setShowToast(true);
                setShowModal(false);
                setShoppingCartList([]);
            })
            .catch(err => {
                console.log(err);
                setToastDanger(true);
                setTextToast('Houve um erro ao efetuar a compra');
                setShowToast(true);
            })
        }
    }

    const addItemToCart = (item: { foto: string, descricao: string, preco: number, quantidade: number, id: number }) => {
        const auxItem = JSON.parse(JSON.stringify(item));
        const auxList = [...shoppingCartList];
        const itemExists = shoppingCartList.findIndex(product => product.id == item.id);
        if (itemExists !== -1) {
            auxList[itemExists].quantidade += 1;
        } else {
            auxItem.quantidade = 1;
            auxList.push(auxItem);
        }
        setShowToast(true);
        setShoppingCartList(auxList);
    }

    const renderProducts = () => {
        return products.map(item => (
            <Col md={4} key={item.id}>
                <Card>
                    <Card.Header className="img-product">
                        <img src={item.foto}></img>
                    </Card.Header>
                    <Card.Body className="d-flex">
                        <Col>
                            <Row className="align-items-center m-auto">
                                <Alert className="p-1 w-auto">
                                    <FontAwesomeIcon icon={faFileText} className="me-2 w-auto" />
                                    {item.descricao}
                                </Alert>
                            </Row>
                            <Row className="align-items-center m-auto">
                                <Alert variant="success" className="w-auto p-1">
                                    <FontAwesomeIcon icon={faMoneyBill} className="me-2 w-auto" />
                                    R$ {item.preco}
                                </Alert>
                            </Row>
                            <Row className="align-items-center m-auto">
                                <Alert variant="warning" className="w-auto p-1">
                                    <FontAwesomeIcon icon={faList} className="me-2 w-auto" />
                                    Quantidade: {item.quantidade}
                                </Alert>
                            </Row>
                        </Col>
                        <Col className="d-flex align-items-end justify-content-end">
                            <Button onClick={() => addItemToCart(item)}>
                                <FontAwesomeIcon icon={faPlusCircle} className="me-2" />
                                Carrinho
                            </Button>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        ))
    }

    const renderCartItens = () => {
        return shoppingCartList.map(item => (
            <ListGroupItem key={item.id} id="list-cart">
                <Row>
                    <Col className="d-flex align-items-center">
                        <img src={item.foto} className="me-2"></img>
                        {item.descricao} -
                        {' R$ '}
                        {item.preco}
                    </Col>
                    <Col md={5} className="d-flex align-items-center">
                        <span className="me-2">
                            Qtde:
                        </span>
                        <Form.Control
                            type="number"
                            min={1}
                            max={products[products.findIndex(product => product.id == item.id)].quantidade}
                            className="me-1"
                            defaultValue={item.quantidade}
                        />
                        <Button variant="danger" className="text-white">
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </Col>
                </Row>
            </ListGroupItem>
        ))
    }

    return (
        <>
            <NavUp />
            {products.length ? (
                <Row className="list-products">
                    {renderProducts()}
                </Row>
            ) : <Row className="w-100 h-100 justify-content-center align-items-center">
                <h3>Não há produtos cadastrados</h3>
            </Row>}
            <Button
                id="shopping-cart"
                onClick={() => setShowModal(true)}
            >
                <FontAwesomeIcon icon={faShoppingCart} className="fa-lg me-1" />
                <Badge bg="danger" className="text-white">
                    {shoppingCartList.length}
                </Badge>
            </Button>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    Carrinho de compras
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                        {renderCartItens()}
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => confirmBuy()}
                        className="me-2"
                    >
                        <FontAwesomeIcon icon={faCheck} className="me-2" />
                        Confirmar pedido
                    </Button>
                    <Button variant="outline-secondary">
                        Cancelar
                    </Button>
                </Modal.Footer>
            </Modal>
            <ToastContainer position='bottom-start' className='mx-2 mb-2'>
                <Toast
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={5000}
                    autohide
                    className={`bg-${toastDanger ? 'danger text-white' : 'success'} p-2`}
                >
                    {textToast}
                </Toast>
            </ToastContainer>
        </>
    )
}