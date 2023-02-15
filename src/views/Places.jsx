import React, {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
import { PlaceForm } from './PlaceForm.jsx'
import { Button } from "react-bootstrap";
import {FiEdit2} from 'react-icons/fi';
import {MdOutlinePersonRemove} from 'react-icons/md';
import {IoAddCircleOutline} from 'react-icons/io5';


export default function Places() {
  const [showForm, setShowForm] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [selectedPlace, setSelectedPlace] = useState({});
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    getPlaces();
  }, [])

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlace({});
  }
  
  const handleEditClick = (place) => {
    setSelectedPlace(place);
    setShowForm(true);
  }

  const handleAddPlace = () => {
    setSelectedPlace({});
    setShowForm(true);
  };

  const onDeleteClick = place => {
    if (!window.confirm("Are you sure you want to delete this place?")) {
      return
    }
    axiosClient.delete(`/places/${place.id}`)
      .then(() => {
        setNotification('Place was successfully deleted')
        getPlaces();
      })
  } 

  const getPlaces = () => {
    setLoading(true)
    axiosClient.get('/places')
      .then(({ data }) => {
        setLoading(false)
        setPlaces(data.data)
        console.log(data.data)
      })
      .catch(() => {
        setLoading(false)
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
        <h1>Places</h1>
      </div>
        <Button className="w-25" variant="primary" onClick={handleAddPlace}>
          <IoAddCircleOutline/>
        </Button>
      <PlaceForm showForm={showForm} closeForm={handleCloseForm} selectedPlace={selectedPlace} places />
  
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Branch</th>
              <th>Region</th>
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
                {places.map(place => (
                  <tr key={place.id}>
                    <td>{place.id}</td>
                    <td>{place.name}</td>
                    {place.branch ?
                    <td>{place.branch.id}</td> :
                    <td>No branch</td>
                    }
                    {/* <td>{place.region.title}</td> */}
                    <td>{place.created_at.slice(0,10)}</td>
                    <td>{place.created_at.slice(11,19)}</td>  
                    <td>
                      <Button variant="light" onClick={() => handleEditClick(place)}>
                        <FiEdit2 />
                      </Button>
                      <Button variant="light" onClick={() => onDeleteClick(place)}>
                        <MdOutlinePersonRemove />
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
            }
        </table>
      </div>
    </div>
  );
}