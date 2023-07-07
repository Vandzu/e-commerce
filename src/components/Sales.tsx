import { useEffect, useState } from 'react';
import { Button, Card, Col, ListGroupItem, Modal, Row, Table, Toast, ToastContainer } from "react-bootstrap";
import NavUp from "./NavUp";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListDots, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useSelector } from 'react-redux/es/hooks/useSelector';

export default function Sales() {
    const [sales, setSales] = useState<{ id: number, data_hora: string, cliente: string, endereco: string, produtos: [], preco: number }[]>([]);
    const [sale, setSale] = useState<number>();
    const [showModal, setShowModal] = useState<boolean>(false);
    const [showProducts, setShowProducts] = useState<boolean>(false);
    const [toastDanger, setToastDanger] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [textToast, setTextToast] = useState<string>('Venda excluída com sucesso');
    const user = useSelector(state => state.user);

    const getSales = () => {
        axios.get(`http://localhost:8000/api.php?route=venda`, {
            withCredentials: true
        }).then(res => setSales(res.data))
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getSales();

    }, []);

    const deleteSale = () => {
        axios.delete(`http://localhost:8000/api.php?route=venda/${sale}`, {
            withCredentials: true
        })
            .then(() => {
                setShowModal(false);
                setTextToast('Venda excluída com sucesso');
                setToastDanger(false);
                setShowToast(true);
                getSales();
            })
            .catch(() => {
                setTextToast('Erro ao tentar excluir a venda');
                setToastDanger(true);
                setShowToast(true);
            })
    }

    const selectSaleToDelete = (sale: number) => {
        setSale(sale);
        setShowModal(true);
    }

    const renderProducts = () => {
        if (sale && showProducts) {
          const productsArray = sales.find(item => item.id === sale)?.produtos;
          if (productsArray) {
            return productsArray.map(item => (
              <ListGroupItem key={item.id} id="list-cart">
                <Row>
                  <Col className="d-flex align-items-center">
                    {item.descricao} - {' R$ '}
                    {item.preco}
                  </Col>
                  <Col md={5} className="d-flex align-items-center">
                    <span className="me-2">
                      Qtde: {item.quantidade}
                    </span>
                  </Col>
                </Row>
              </ListGroupItem>
            ));
          }
        }
      }
      

    const viewProducts = (idSale) => {
        setSale(idSale);
        setShowProducts(true);
    }

    const renderSales = () => {
        if (sales.length) {
            return sales.map(item => (
                <tr key={item.id}>
                    <td>
                        {item.id}
                    </td>
                    <td>
                        {item.data_hora}
                    </td>
                    <td>
                        {item.nome}
                    </td>
                    <td>
                        {item.endereco}
                    </td>
                    <td>
                        R$
                        {' '}
                        {item.produtos && item.produtos.reduce((p, c) => p + (c.quantidade * c.preco), 0)}
                    </td>
                    <td>
                   
    <Button className="me-1" title="Visualizar produtos" onClick={() => viewProducts(item.id)}>
      <FontAwesomeIcon icon={faListDots} />
    </Button>
    {user.admin && (
  <>
    <Button onClick={() => selectSaleToDelete(item.id)} variant="outline-danger">
      <FontAwesomeIcon icon={faTrash} />
    </Button>
  </>
)}

                    </td>
                </tr>
            ))
        } else {
            return (
                <tr>
                    <td colSpan={6}>
                        Não há vendas
                    </td>
                </tr>
            )
        }
    }

    return (
        <>
            <NavUp />
            <Row className='w-100 h-100 justify-content-center align-items-center'>
                <Card className='w-75'>
                    <Card.Header className='bg-white d-flex align-items-center justify-content-center'>
                        <h4 className='m-auto'>Vendas</h4>
                    </Card.Header>
                    <Card.Body>
                        <Table>
                            <thead>
                                <tr>
                                    <th>
                                        Id
                                    </th>
                                    <th>
                                        Data hora
                                    </th>
                                    <th>
                                        Cliente
                                    </th>
                                    <th>
                                        Endereço
                                    </th>
                                    <th>
                                        Total
                                    </th>
                                    <th>
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {renderSales()}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Row>
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
            <Modal show={showModal} centered>
                <Modal.Header>Tem certeza que deseja excluir a venda?</Modal.Header>
                <Modal.Body className='d-flex justify-content-center'>
                    <Button
                        onClick={() => deleteSale()}
                        className='me-2 w-25'>
                        Sim
                    </Button>
                    <Button
                        variant='outline-secondary'
                        className='w-25'
                    >
                        Cancelar
                    </Button>
                </Modal.Body>
            </Modal>
            <Modal show={showProducts} onHide={() =>setShowProducts(false)}>
                <Modal.Header closeButton>Produtos da Venda {sale}</Modal.Header>
                <Modal.Body>
                    {renderProducts()}
                </Modal.Body>
            </Modal>
        </>
    )
}