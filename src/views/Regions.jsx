import { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import { Link } from "react-router-dom";
import React from 'react';

export default function Regions() {
  const [regions, setregions] = useState([]);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getregions();
  }, []);

  const handleExpand = () => setExpanded(!expanded);

  const onDeleteClick = (region) => {
    if (!window.confirm("Are you sure you want to delete this region?")) {
      return;
    }
    axiosClient
      .delete(`/regions/${region.id}`)
      .then(() => {
        setNotification("region was successfully deleted");
        getregions();
      })
      .catch((error) => {
        setNotification(`Error deleting region: ${error}`);
      });
  };

  const getregions = () => {
    setLoading(true);
    axiosClient
      .get("/regions")
      .then(({ data }) => {
        setLoading(false);
        setregions(data.data);
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
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1>regions</h1>
        <Link className="btn-add" to="/regions/new">
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
              <th>Created at</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading && (
            <tbody>
              <tr>
                <td colSpan="5" className="text-center">
                  Loading...
                </td>
              </tr>
            </tbody>
          )}
          {!loading && (
            <tbody>
            {regions.map(r => (
              <React.Fragment key={c.id}>
                <tr>
                  <td>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{r.parent_id}</td>
                  <td>{r.description}</td>
                  <td>{r.created_at.slice(0, 10)}</td>
                  <td>{r.created_at.slice(11, 19)}</td>
                  <td>
                    <Link className="btn-edit" to={'/regions/' + c.id}>
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