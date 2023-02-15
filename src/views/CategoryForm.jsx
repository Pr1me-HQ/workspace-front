import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import loading_icon from "../assets/icons/loading.svg";
import React from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";

export const CategoryForm = ({ show, handleClose, selectedCategory, categories }) => {
  console.log("selectedCategory", selectedCategory);

  const [category, setCategory] = useState({
    id: selectedCategory ? selectedCategory.id : null,
    title: selectedCategory ? selectedCategory.title : "",
    description: selectedCategory ? selectedCategory.description : "",
    parent_id: 0,
  });

  const [notification, setNotification] = useState(null);
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();


  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/categories/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setCategory(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }
  
  useEffect(() => {
    setCategory(selectedCategory);

  }, [selectedCategory]);

  const isCategory = () => {
    if (selectedCategory.id) {
      return "Edit Category";
    } else {
      return "Create Category";
    }
  };
  
  const renderCategories = (categories, depth = 0) => {
    return categories.map((category) => {
      const indentation = " ".repeat(depth * 2);
      if (category.childrens && category.childrens.length > 0) {
        return [
          <option key={category.id} value={category.id}>
            {indentation + category.title}
          </option>,
          renderCategories(category.childrens, depth + 1),
        ];
      } else {
        return (
          <option key={category.id} value={category.id}>
            {indentation + category.title}
          </option>
        );
      }
    });
  };
  
  
  const getAllChildren = (category, allChildren = []) => {
    category.childrens.forEach((child) => {
      allChildren.push(child);
      getAllChildren(child, allChildren);
    });
    return allChildren;
  };


  const onSubmit = (ev) => {
    ev.preventDefault();
    if (category.id) {
      axiosClient
        .put(`/categories/${category.id}`, category)
        .then(() => {
          setNotification("Category was successfully updated");
          handleClose();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/categories", category)
        .then(() => {
          setNotification("Category was successfully created");
          handleClose();
        })
        .catch((err) => {
          console.log(category);
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isCategory()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && (
            <div className="text-center">
              <img src={loading_icon} alt="loading" className="loading-icon" />
            </div>
          )}
          <Form onSubmit={onSubmit}>
            <Form.Group>
              <Form.Label htmlFor="name">Name</Form.Label>
              <Form.Control
                type="text"
                id="name"
                value={category.title}
                placeholder= {selectedCategory ? selectedCategory.title : "Enter category name"}
                onChange={(ev) =>
                  setCategory({ ...category, title: ev.target.value })
                }
              />
              {errors && errors.title && (
                <Alert variant="danger">{errors.title}</Alert>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="description">Description</Form.Label>
              {/* make description textarea */}
              <Form.Control
                as="textarea"
                rows={5}                
                id="description"
                value={category.description}
                placeholder= {selectedCategory ? selectedCategory.description : "Enter category description"}
                onChange={(ev) =>
                  setCategory({ ...category, description: ev.target.value })
                }
              />
              {errors && errors.description && (
                <Alert variant="danger">{errors.description}</Alert>
              )}
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="parent_id">Parent Category</Form.Label>
              <Form.Control as="select"
                onChange={(ev) =>
                  setCategory({ ...category, parent_id: ev.target.value })
                }
              >
                <option value='0'>No parent category</option>
                {renderCategories(categories)}
              </Form.Control>
              {errors && errors.parent_id && (
                <Alert variant="danger">{errors.parent_id}</Alert>
              )}
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-5">
              {selectedCategory.id ? "Update" : "Create"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    );
  };
  
  export default CategoryForm;  