import React, { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
import RegionForm from "./RegionForm.jsx";
import { Button } from "react-bootstrap";
import {
  FiEdit2,
  MdOutlinePersonRemove,
  MdPersonAddAlt
} from "react-icons/all";

export default function Regions() {
  const [showForm, setShowForm] = useState(false);
  const { setNotification } = useStateContext();
  const [selectedRegion, setSelectedRegion] = useState({});
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRegions();
  }, []);


  const handleCloseForm = () => {
    setShowForm(false);
  };

  const getRegions = () => {
    setLoading(true);
    axiosClient.get("/regions").then(({ data }) => {
      setRegions(data.data);
      setLoading(false);
    });
  };

  const getParentRegion = (region) => {
    if (region.parent_id !== 0 && region.parent_id ) {
      parent = regions.find((r) => r.id === region.parent_id);
      if (parent) {
        return parent.title;
      }
      // return regions.find(r => r.id === region.parent_id);
    }
    return 'No parent region';
  }

  const handleEditClick = (region) => {
    setSelectedRegion(region);
    setShowForm(true);
  };

  const handleAddRegion = () => {
    setSelectedRegion({});
    setShowForm(true);
  };

  const onDeleteClick = region => {
    if (!window.confirm("Are you sure you want to delete this region?")) {
      return
    }
    axiosClient.delete(`/regions/${region.id}`)
      .then(() => {
        setNotification('Region was successfully deleted')
        setRegions(regions.filter(r => r.id !== region.id));
      })
  }

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
        <h1>Regions</h1>
      </div>
      <Button className="w-25" variant="primary" onClick={handleAddRegion}>
        <MdPersonAddAlt/>
      </Button>
      <RegionForm showForm={showForm} closeForm={handleCloseForm} selectedRegion={selectedRegion} regions={regions} />

      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Parent</th>
              <th>Create Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          {loading &&
            <tbody>
              <tr>
                <td colSpan="10" className="text-center">
                  <img src={loading_icon} width="40px" alt="Loading" />
                </td>
              </tr>
            </tbody>
          }
          {!loading &&
            <tbody>
              {regions.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.title}</td>
                  <td>{getParentRegion(r)}</td>
                  <td>{r.created_at.slice(0,10)}</td>
                  <td>{r.created_at.slice(11,19)}</td>
                  <td>
                    <button className="btn-edit" onClick={ev => handleEditClick(r)}><FiEdit2/></button>
                    <button className="btn-delete" onClick={ev => onDeleteClick(r)}><MdOutlinePersonRemove/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          }
        </table>
      </div>
    </div>
  )
}
