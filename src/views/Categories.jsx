import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";
import React from 'react';
import loading_icon from '../assets/loading.svg';


export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();


  useEffect(() => {
    getCategories();
  }, []);

  const handleExpand = () => setExpanded(!expanded);

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
    <div >
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
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Parent</th>
              <th>Description</th>
              <th>Created</th>
              <th>Time</th>
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
            {categories.map(c => (
              <React.Fragment key={c.id}>
                <tr>
                  <td>{c.id}</td>
                  <td>{c.title}</td>
                  <td>{c.parent_id}</td>
                  <td>{c.description}</td>
                  <td>{c.created_at.slice(0, 10)}</td>
                  <td>{c.created_at.slice(11, 19)}</td>
                  <td>
                    <Link className="btn-edit" to={'/categories/' + c.id}>
                      Edit
                    </Link>

                    <button
                      className="btn-delete" onClick={() => onDeleteClick(c)}>
                      Delete
                    </button>
                    <button className="btn-hide-show" onClick={() => handleExpand()}>
                      {expanded ? "Hide" : "Show"}
                    </button>
                  </td>
                </tr>
                {expanded && c.childrens.map((child) => (
                  <tr key={child.id}>
                    <td></td>
                    <td>{child.title}</td>
                    <td>{child.parent_id}</td>
                    <td>{child.description}</td>
                    <td>{child.created_at.slice(0, 10)}</td>
                    <td>{child.created_at.slice(11, 19)}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}


            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}