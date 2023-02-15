import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import { useNavigate, useParams } from "react-router-dom";
import loading_icon from "../assets/icons/loading.svg";
import CategoryForm from "./CategoryForm";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {FiEdit2} from 'react-icons/fi';
import {BiShow} from 'react-icons/bi';
import {CgRemoveR} from 'react-icons/cg';
import {GoDiffAdded} from 'react-icons/go'

export default function Categories() {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);  
  const { setNotification } = useStateContext();
  const navigate = useNavigate();
  const handleClose = () => setShow(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getCategories();
    setCategories(categories);
  }, []);

  const onDeleteClick = (category) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    axiosClient.delete(`/categories/${category.id}`).then(() => {
      setNotification("Category was successfully deleted");
      getCategories();
    });
  };

  const onEditClick = (category) => {
    setShowModal(false);
    setShow(true);
    setSelectedCategory(category);
    <CategoryForm
      show={show}
      category={selectedCategory}
      categories={categories}
      handleClose={handleClose}      
      />
  };


  const getParentCategory = (id, categories) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      return category.title;
    }
    return "None";
  };
  
  const getCategories = () => {
    setLoading(true);
    axiosClient
      .get("/categories")
      .then(({ data }) => {
        setLoading(false);
        setCategories(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onShowChildrenClick = (c) => {
    setSelectedCategory(c);
    setShowModal(true);
    setLoading(false);
  };  

  return (
    <div className="content">
      <div
        style={{
          width: "90%",
          display: "flex",
          justifyContent: "space-around",
          alignItems: "flex-end",
        }}
      >
        <h1>Categories</h1>
      </div>
      <Button className="w-25" variant="primary" onClick={() => setShow(true)}>
        <GoDiffAdded/>
      </Button>

      <CategoryForm 
        show={show}
        selectedCategory={selectedCategory}
        categories={categories}
        handleClose={handleClose}
      />

      <div className="card animated fadeInDown">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
              {/* <th>Parent Category</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="10" className="text-center">
                  <img src={loading_icon} width="40px" alt="Loading" />
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} >
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.description}</td>
                  {/* <td>
                    {c.parent_id ? getParentCategory(c.parent_id, categories) : "No parent"}
                  </td> */}
                  <td>
                  <td className="d-flex justify-between m-2">
                <button onClick={() => onEditClick(c)} className="btn-edit">
                <FiEdit2/>
                </button>
                <Button  variant="primary" onClick={() => onShowChildrenClick(c)}>
                  <BiShow/>
                </Button>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Children categories of {selectedCategory.title}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                          {selectedCategory.childrens && selectedCategory.childrens.length > 0 ? (
                            selectedCategory.childrens.map((c) => (
                              <div key={c.id}>
                                <div className="category">
                                  <div className="category-title">{c.title}</div>
                                  <div className="category-parent">
                                    Parent: {getParentCategory(c.parent_id, categories)}
                                  </div>
                                  <div className="category-actions">
                                    <Button
                                      variant="primary"
                                      onClick={() => onEditClick(c)}
                                    >
                                      <FiEdit2/>
                                    </Button>
                                    <Button
                                      variant="danger"
                                      onClick={() => onDeleteClick(c)}
                                    >
                                      <CgRemoveR/>
                                    </Button>
                                    <Button
                                      variant="primary"
                                      onClick={() => onShowChildrenClick(c)}
                                    >
                                      <BiShow/>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div>No children categories</div>
                          )}
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                      Close
                    </Button>
                  </Modal.Footer>
                </Modal>
                <button onClick={() => onDeleteClick(c)} className="btn-delete">
                  <CgRemoveR/>
                </button>
                  </td>   
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}