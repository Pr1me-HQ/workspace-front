import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import {Button, Modal} from "react-bootstrap";

export default function RegionForm({ showForm, closeForm , selectedRegion, regions }) {
  const navigate = useNavigate();
  const [region, setRegion] = useState({
    id: null,
    title: selectedRegion.title ? selectedRegion.title : '',
    parent_id: selectedRegion.parent_id ? selectedRegion.parent_id : '',
  })
  const [errors, setErrors] = useState(null)
  const [loading] = useState(false)
  const {setNotification} = useStateContext()

  useEffect(() => {
    setRegion(selectedRegion);
    console.log(selectedRegion);
  }, [selectedRegion]);

  const renderCategories = (regions, depth = 0) => {
    return regions.map((region) => {
      const indentation = " ".repeat(depth * 2);
      if (region.childrens && region.childrens.length > 0) {
        return [
          <option key={region.id} value={region.id}>
            {indentation + region.title}
          </option>,
          renderCategories(region.childrens, depth + 1),
        ];
      } else {
        return (
          <option key={region.id} value={region.id}>
            {indentation + region.title}
          </option>
        );
      }
    });
  };
  
  
  const getAllChildren = (region, allChildren = []) => {
    region.childrens.forEach((child) => {
      allChildren.push(child);
      getAllChildren(child, allChildren);
    });
    return allChildren;
  };

  const onSubmit = ev => {
    ev.preventDefault()
    if (selectedRegion.id) {
      axiosClient.put(`/regions/${region.id}`, region)
        .then(() => {
          setNotification('Region was successfully updated')
          navigate('/regions')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/regions', region)
        .then(() => {
          setNotification('region was successfully created')
          navigate('/regions')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <Modal show={showForm} onHide={closeForm}>
      <Modal.Header closeButton>
        <Modal.Title>{region.id ? 'Edit region' : 'Add region'}</Modal.Title>
      
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Title</label>
            <input type="text" className="form-control" id="title" name="title"
                    value={region.title}
                    onChange={ev => setRegion({...region, title: ev.target.value})}/>
            {errors && errors.title && <div className="text-danger">{errors.title[0]}</div>}
          </div>
          <div className="mb-3">
            <label htmlFor="parent_id" className="form-label">Parent</label>
            <select className="form-select" id="parent_id" name="parent_id"
                    value={region.parent_id}
                    onChange={ev => setRegion({...region, parent_id: ev.target.value})}>
            {renderCategories(regions)}
            </select>
            {errors && errors.parent_id && <div className="text-danger">{errors.parent_id[0]}</div>}
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
  )
}
