import axios from "axios";
import { useEffect, useState } from "react";
import { Card, Button, Row } from "react-bootstrap";
import NavUp from "./NavUp";

export default function Store() {
    const [products, setProducts] = useState<Array<object>>([]);

    useEffect(() => {
        axios.get(`http://localhost:8000/api.php?route=produtos`)
        .then(res => setProducts(res.data))
        .catch(err => console.log(err));
    }, [])

    console.log('products: ', products);

    const renderProducts = () => {
        return products.map(item => (
            <Card key={item.id}>
                <Card.Header>
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
        ))
    }

    return (
        <>
            <NavUp />
            {products.length ? (
                renderProducts()
            ) : ''}
        </>
    )
}