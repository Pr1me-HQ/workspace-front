import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import loading_icon from "../assets/icons/loading.svg";
import DynamicTable from "../components/GenericTable.jsx";
import DynamicForm from "../components/UniversalFormModal.jsx";
import { Pagination } from "../components/Pagination.jsx";
import {
        AiFillEye,
        AiFillEdit,
        AiFillDelete,
        } from "react-icons/all";

export default function Places() {
  const [showForm, setShowForm] = useState(false);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [regions, setRegions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const baseUrl = '/places/'
  const keys = ['name']
  
  const headers = ['Название']

  function getPlaces() {
    setLoading(true);
      axiosClient.get(baseUrl, {
        params: {
          page: currentPage,
          search: search ? search : null  ,
          limit: 10
        }
      }
    )

    .then(({data}) => { 
      setPlaces(data.data);
      setLastPage(data.meta.last_page);
      setCurrentPage(data.meta.current_page);
      setLoading(false);
    }
    )

    .catch((error) => {
      console.log(error)
      setLoading(false);
    }
    )
  }

  function getBranches() {
    setLoading(true);
    axiosClient.get('/branches')
    .then(({data}) => {
      setBranches(data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }

  function getPlaceTypes() {
    setLoading(true);
    axiosClient.get('/place-types')
    .then(({data}) => {
      setPlaceTypes(data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }
  
  function getRegions() {
    setLoading(true);
    axiosClient.get('/regions')
    .then(({data}) => {
      setRegions(data.data);
      console.log('regions', regions)
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }

  useEffect(() => {
    getPlaces();
  }, [currentPage, search])

  const getPlace = (id) => {
    setLoading(true);
    axiosClient.get(baseUrl + id)
    .then(({data}) => {
      setSelectedPlace(data.data);
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }
  
  useEffect(() => {
    getPlaces();
    getRegions();
    getBranches();
    getPlaceTypes();
  }, [])

  
  const placesFields = [
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      placeholder: 'Введите название',
      value: selectedPlace.name,
      required: true,
    },
    {
      name: 'region_id',
      label: 'Регион',
      type: 'select',
      placeholder: 'Выберите регион',
      value: selectedPlace.region?.id,
      required: true,
      options: regions,
    },
    {
      name: 'branch_id',
      label: 'Филиал',
      type: 'select',
      placeholder: 'Выберите филиал',
      value: selectedPlace.branch_id,
      required: true,
      options: branches,
    },
    {
      name: 'place_type',
      label: 'Тип',
      type: 'select',
      placeholder: 'Выберите тип',
      value: selectedPlace.type?.name,
      options: placeTypes,
      required: true,
    }
  ]
      
    const onDeleteClick = (user) => {
      setSelectedPlace(user);
      setShowConfirmation(true);
    }   

    const generateColumns = (keys) => {
      let columns = keys.map(key => {
      // use switch case instead of if else
      switch (key) {
        case 'region':
        case 'branch':
          return {
            key: key,
            render: (value) => <>{value?.title || value?.name}</>,
          }
        case 'created_at':
          return {
            key: key,
            render: (value) => <>{value?.split('T')[0]}</>,
          }
        case 'type':
          return {
            key: key,
            render: (value) => <>{value?.name}</>,
          }
        default:
          return {
            key: key,
            render: (value) => <>{value}</>,
          }
        }
      })
    return columns;
  }

  const columns = generateColumns(keys);

  // const handleSearch = (query) => {
  //   setSearch(query);
  //   setCurrentPage(1);
  // }

  const onDetailsClick = (place) => {
    getPlace(place.id);
    setShowDetails(true);
  }

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPlace({});
  }
  
  const onEditClick = (place) => {
    getPlace(place.id);
    console.log('selected place', place)
    setShowForm(true);
  }
  

  const handleAddPlace = () => {
      setSelectedPlace({});
      setShowForm(true);
      clearForm();
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">Места</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
        <div className="form-group">
        <input type="text" className="form-control" placeholder="Поиск" onChange={handleSearchChange} />
      </div>
        <Button variant="primary" onClick={handleAddPlace}> 
            Добавить место
          </Button>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {loading ? (
            <table className="table table-striped">
            <tbody>
              <tr>
                <td colSpan={headers.length} className="text-center">
                  <img src={loading_icon} width="40px" alt="Загрузка" />
                </td>
              </tr>
            </tbody>
          </table>
          ) : (
            <DynamicTable
              headers={headers}
              data={places}
              columns={columns}
              actions={[
                {
                  icon: <AiFillEye/>,
                  title: "Просмотр",
                  onClick: onDetailsClick,
                },
                {
                  icon: <AiFillEdit/>,
                  title: "Изменить",
                  onClick: onEditClick,
                },
                {
                  icon: <AiFillDelete/>,
                  title: "Удалить",
                  onClick: onDeleteClick,
                },
              ]}
            />
          )}
        </div>
      </div>
      <Modal show={showDetails} onHide={() => setShowDetails(false)}> 
        <Modal.Header closeButton>
          <h1 className="mx-auto ">Информация о месте</h1>
          <hr />
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedPlace && (
            <div>

          <h3 className="">Название: <span className="d-flex-inline">{selectedPlace.name}</span></h3>
          <hr />
          {
            selectedPlace.region && (
              <h5 className="text-center">
                Регион: <span className="d-flex-inline">{selectedPlace.region?.title}</span>
              </h5>
            )
          }
          <hr />
          {
            selectedPlace.branch && (
          <h5 className="text-center">
            Филиал: <span className="d-flex-inline">{selectedPlace.branch?.name}</span>
          </h5>)              
          }
          <hr />
          <h5 className="text-center">
            Тип: <span className="d-flex-inline">{selectedPlace.type?.name}</span>
          </h5>
          <hr />
          <h4 className="text-center">
          Дата создания:  {selectedPlace.created_at?.slice(0,10)}</h4>
          <hr />
            </div>
          )}
                  
        </Modal.Body>
      </Modal>

      <div className="row">
        <div className="col-12">
          <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
      </div>
      <DynamicForm
        show={showForm}
        handleClose={handleCloseForm}
        fields={placesFields}
        data={selectedPlace}
        onSuccess={getPlaces}
        formType={selectedPlace.id ? "Edit" : "Add"}
        url={baseUrl}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}