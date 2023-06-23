import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Row, Col } from "react-bootstrap";
import NavUp from "./NavUp";

export default function Store() {
    const [products, setProducts] = useState<{foto: string, descricao: string, preco: number, quantidade: number, id: number}[]>([]);

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