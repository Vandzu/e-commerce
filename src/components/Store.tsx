import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileText, faMoneyBill, faList, faPlus, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import NavUp from "./NavUp";

export default function Store() {
    const [products, setProducts] = useState<{ foto: string, descricao: string, preco: number, quantidade: number, id: number }[]>([]);

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

    useEffect(() => {
        getProducts();
    }, [])

    const renderProducts = () => {
        return products.map(item => (
            <Col md={4}>
                <Card key={item.id}>
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
                            <Button>
                                <FontAwesomeIcon icon={faPlusCircle} className="me-2"/>
                                Carrinho
                            </Button>
                        </Col>
                    </Card.Body>
                </Card>
            </Col>
        ))
    }

    return (
        <>
            <NavUp />
            {products.length ? (
                <Row className="list-products">
                    {renderProducts()}
                </Row>
            ) : ''}
        </>
    )
}