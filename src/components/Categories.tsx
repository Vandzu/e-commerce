import React, { useEffect, useState } from "react";
import { faFloppyDisk, faFolderPlus, faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Button, Row, Form, Col, ToastContainer, Toast, ToastBody } from "react-bootstrap";
import NavUp from "./NavUp";
import axios from "axios";

type Category = {
    id: number;
    descricao: string;
  };
  

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [textToast, setTextToast] = useState("");
  const [typeToast, setTypeToast] = useState(false);
  const [editingCategory, setEditingCategory] = useState<null | Category>(null);
  const [formData, setFormData] = useState({
    descricao: "",
  });

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api.php?route=categorias",
        { withCredentials: true }
      );
      setCategories(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const resetForm = () => {
    setFormData({ descricao: "" });
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setFormData({
        descricao: category.descricao
    });
  };

  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await axios.delete(
        `http://localhost:8000/api.php?route=categorias/${categoryId}`,
        { withCredentials: true }
      );
      setTextToast("Categoria excluída com sucesso");
      setTypeToast(false);
      setShowToast(true);
      fetchCategories();
    } catch (err) {
      console.log(err);
      setTextToast("Houve um erro ao excluir a categoria");
      setTypeToast(true);
      setShowToast(true);
    }
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
    resetForm();
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const { descricao } = formData;

    if (editingCategory) {
      try {
        await axios.put(
          `http://localhost:8000/api.php?route=categorias/${editingCategory.id}`,
          {  descricao },
          { withCredentials: true }
        );
        setTextToast("Categoria atualizada com sucesso");
        setTypeToast(false);
        setShowToast(true);
        setEditingCategory(null);
        resetForm();
        fetchCategories();
      } catch (err) {
        console.log(err);
        setTextToast("Houve um erro ao atualizar a categoria");
        setTypeToast(true);
        setShowToast(true);
      }
    } else {
      try {
        await axios.post(
          "http://localhost:8000/api.php?route=categorias",
          {  descricao },
          { withCredentials: true }
        );
        setTextToast("Categoria cadastrada com sucesso");
        setTypeToast(false);
        setShowToast(true);
        resetForm();
        fetchCategories();
      } catch (err) {
        console.log(err);
        setTextToast("Houve um erro ao cadastrar a categoria");
        setTypeToast(true);
        setShowToast(true);
      }
    }
  };

  return (
    <>
      <NavUp />
      <Row className="justify-content-center align-items-center w-100 h-100 m-auto">
        <Card className="card-categories w-75 h-auto">
          <Card.Header className="bg-white d-flex align-items-center">
            <FontAwesomeIcon icon={faFolderPlus} className="me-2" />
            {editingCategory ? "Editar Categoria" : "Cadastrar Categoria"}
          </Card.Header>
          <Form onSubmit={handleSubmit}>
            <Card.Body>
              <Row className="mb-2">
                <Col>
                  <Form.Group className="d-flex align-items-start flex-column">
                    <Form.Label>Descrição da categoria</Form.Label>
                    <Form.Control
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleInputChange}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-end">
                <Button type="submit">
                  <FontAwesomeIcon icon={faFloppyDisk} className="me-2" />
                  {editingCategory ? "Atualizar" : "Salvar"}
                </Button>
                {editingCategory && (
                  <Button
                    variant="secondary"
                    onClick={handleCancelEdit}
                    className="ms-2"
                  >
                    Cancelar
                  </Button>
                )}
              </Row>
            </Card.Body>
          </Form>
          <Card.Body>
            <ul className="list-group">
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {category.descricao}
                  <div>
                    <Button
                      variant="link"
                      onClick={() => handleEditCategory(category)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </Card.Body>
        </Card>
      </Row>
      <ToastContainer position="top-end" className="mt-2">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={5000}
          autohide
          className={`bg-${typeToast ? "danger text-white" : "success"}`}
        >
          <ToastBody>{textToast}</ToastBody>
        </Toast>
      </ToastContainer>
    </>
  );
}
