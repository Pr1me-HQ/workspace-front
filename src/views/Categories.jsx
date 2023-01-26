import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";
import React from "react";
import loading_icon from "../assets/loading.svg";
import Modal from "./Modal";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getCategories();
  }, []);

  const handleExpand = (id) => {
    setExpanded({
      ...expanded,
      [id]: !expanded[id],
    });
  };

  const handleModal = () => {
    setModalOpen(!modalOpen);
  };

  const onDeleteClick = (category) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }
    axiosClient
      .delete(`/categories/${category.id}`)
      .then(() => {
        setNotification("Category was successfully deleted");
        getCategories();
      })
      .catch((error) => {
        setNotification(`Error deleting category: ${error}`);
      });
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

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <h1>Categories</h1>
        <Link className="btn-add" to="/categories/new">
          Add new
        </Link>
      </div>
      <Modal open={modalOpen} onClose={handleModal}>
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Parent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4}>
                    <img
                      src={loading_icon}
                      alt="Loading"
                      width="50"
                      height="50"
                    />
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <React.Fragment key={category.id}>
                    <tr>
                      <td>{category.id}</td>
                      <td>{category.title}</td>
                      <td>{category.parent_id}</td>
                      <td>
                        <Link to={`/categories/${category.id}/edit`}>Edit</Link>
                        <a href="#" onClick={() => onDeleteClick(category)}>
                          Delete
                        </a>
                        {category.children.length > 0 && (
                          <a href="#" onClick={() => handleExpand(category.id)}>
                            {expanded[category.id] ? "Collapse" : "Expand"}
                          </a>
                        )}
                      </td>
                    </tr>
                    {expanded[category.id] &&
                      category.children.map((child) => (
                        <tr key={child.id}>
                          <td>{child.id}</td>
                          <td>- {child.title}</td>
                          <td>{child.parent_id}</td>
                          <td>
                            <Link to={`/categories/${child.id}/edit`}>
                              Edit
                            </Link>
                            <a href="#" onClick={() => onDeleteClick(child)}>
                              Delete
                            </a>
                          </td>
                        </tr>
                      ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}