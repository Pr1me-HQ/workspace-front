import { useState } from "react";
import axiosClient from "../axios-client.js";
import actionCreator from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import React from "react";
import { Modal, Button } from "react-bootstrap";

export const PlaceForm = ({ showForm, closeForm, selectedPlace, places }) => {
  const notification = useStateContext().notification;
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setNotification } = useStateContext();
  const [placeTypes, setPlaceTypes] = useState([]);
  const [branches, setBranches] = useState([]);
  const [regions, setRegions] = useState([]);

  const [place, setPlace] = useState({
    id: selectedPlace ? selectedPlace.id : null,
    name: selectedPlace ? selectedPlace.name : '',
    branch_id: selectedPlace ? selectedPlace.branch_id : '',
    place_type_id: selectedPlace ? selectedPlace.place_type_id : '',
  });

  
  const getPlaceTypes = () => {
    setLoading(true);
    // load data only if it is not loaded via client
    selectedPlace.length > 0 ? null:
    axiosClient.get("/place-types").then(({ data }) => {
      setPlaceTypes(data.data);
      setLoading(false);
    })
  };

  const getBranches = () => {
    setLoading(true);
    selectedPlace.length > 0 ? null:
    axiosClient.get("/branches").then(({ data }) => {
      setBranches(data.data);
      setLoading(false);
    });
  };

  const getRegions = () => {
    setLoading(true);
    selectedPlace.length > 0 ? null:
    axiosClient.get("/regions").then(({ data }) => {
      setRegions(data.data);
      setLoading(false);
  });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (selectedPlace && selectedPlace.id) {
      axiosClient
        .put(`/places/${selectedPlace.id}`, place)
        .then(() => {
          setNotification("Place was successfully updated");
          closeForm();
        })
        .catch((err) => {
          console.log(place)
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => setLoading(false));
    } else {
      axiosClient
        .post("/places", place)
        .then(() => {
          console.log(place)
          setNotification("Place was successfully created");
          closeForm(true);
        })
        .catch((err) => {
          console.log(place)
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => setLoading(false));
    }
  };


  return (
    <Modal show={showForm} onHide={closeForm} >
    <Modal.Header closeButton>
      <Modal.Title>{selectedPlace.id ? 'Edit place' : 'Add place'}</Modal.Title>
    
    </Modal.Header>
    <Modal.Body>
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Title</label>
          <input type="text" className="form-control" id="name" name="name"
                  value={place.name}
                  placeholder= {selectedPlace ? selectedPlace.name : "Enter name"}
                  onChange={ev => setPlace({...place, name: ev.target.value})}/>
          {errors && errors.name && <div className="text-danger">{errors.name[0]}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="place_type_id" className="form-label">Place type</label>
          <select className="form-select" id="place_type_id" name="place_type_id"
                  value={place.place_type_id}
                  placeholder= {selectedPlace ? selectedPlace.place_type_id : "Select place type"}
                  onClick={getPlaceTypes}
                  onChange={ev => setPlace({...place, place_type_id: ev.target.value})}>
            <option value="">Select place type</option>
            { loading ? <option value="">Loading...</option> :
            placeTypes.map(placeType => (
              <option key={placeType.id} value={placeType.id}>{placeType.name}</option>
            ))}
          </select>
          {errors && errors.place_type_id && <div className="text-danger">{errors.place_type_id[0]}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="branch_id" className="form-label">Branch</label>
          <select className="form-select" id="branch_id" name="branch_id"
                  value={place.branch_id} 
                  onClick={getBranches}
                  onChange={ev => setPlace({...place, branch_id: ev.target.value})}>
            <option value="">Select branch</option>
            {loading ? <option value="">Loading...</option> : 
            branches.map(branch => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          {errors && errors.branch_id && <div className="text-danger">{errors.branch_id[0]}</div>}
        </div>
        <div className="mb-3">
          <label htmlFor="region_id" className="form-label">Region</label>
          <select className="form-select" id="region_id" name="region_id"
                  onClick={getRegions}
                  value={place.region_id} 
                  onChange={ev => setPlace({...place, region_id: ev.target.value})}>
            <option value="">Select region</option>
            { loading ? <option value="">Loading...</option> :
            regions.map(region => (
              <option key={region.id} value={region.id}>{region.title}</option>
            ))}
          </select>
          {errors && errors.region_id && <div className="text-danger">{errors.region_id[0]}</div>}
        </div>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={closeForm}>
            Close
          </Button>
          <Button variant="primary" type="submit" className="ms-2">
            {loading ? 'Loading...' : 'Save'}
          </Button>
        </div>
      </form>
    </Modal.Body>
  </Modal>
   );
  };
  
export default PlaceForm;