import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import loading_icon from "../assets/icons/loading.svg";
import { useStateContext } from "../context/ContextProvider.jsx";
import DynamicTable from "../components/GenericTable.jsx";
import DynamicForm from "../components/UniversalFormModal.jsx";
import { Pagination } from "../components/Pagination.jsx";

export default function Units() {
  const [showForm, setShowForm] = useState(false);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [selectedUnit, setSelectedUnit] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = '/units/'
  const keys = ['name']
  const headers = keys.map(key => key.replace(/_/g, ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase()))));
  
  function getUnits() {
    setLoading(true);
    axiosClient.get(baseUrl,
      {
        params: 
        {
          page: currentPage,
          search: search ? search : null,
        }
      })
    .then(({data}) => { 
      setUnits(data.data);
      setLoading(false);
    }
    )
    .catch((error) => {
      console.log(error)
      setLoading(false);
    }
    )
  }
  
  useEffect(() => {
    getUnits();
  }, [])

  const unitFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
    }
  ]

  const onDeleteClick = (unit) => {
      setSelectedUnit(unit);
      setShowConfirmation(true);
    }
    
    const generateColumns = () => {
      let columns = keys.map(key => {
        if (key === 'branch') {
          return {
            key: key,
            render: (value) => <>{value?.name}</>,
          }
        } else if (key === 'region') {
          return {
            key: key,
            render: (value) => <>{value?.title}</>,
          }
        } else {
          return {
            key: key,
            render: (value) => <>{value}</>,
          }
        }
      });
      
      return columns;
    }
    

    const columns = generateColumns();

  const handleSearch = (query) => {
    setSearch(query);
    setCurrentPage(1);
  }

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUnit({});
  }
  
  const handleEditClick = (unit) => {
    setSelectedUnit(unit);
    // console.log('selected unit', unit)
    setShowForm(true);
  }

  const handleAddUnit = () => {
      setSelectedUnit({});
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
          <h1 className="text-center">Единицы</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
        <div className="form-group">
        <input type="text" className="form-control" placeholder="Поиск" onChange={handleSearchChange} />
      </div>
        <Button variant="primary" onClick={handleAddUnit}> 
            Добавить единицу
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
                  <img src={loading_icon} width="40px" alt="Loading" />
                </td>
              </tr>
            </tbody>
          </table>
          ) : (
            <DynamicTable
              headers={headers}
              data={units}
              columns={columns}
              actions={[
                {
                  icon: "Изменить",
                  onClick: handleEditClick,
                },
                {
                  icon: "Удалить",
                  onClick: onDeleteClick,
                },
              ]}
            />
          )}
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {
            units.length === 0 && !loading && (
              <Alert variant="info">
                Нет единиц
              </Alert>
            )
          }
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            setCurrentPage={setCurrentPage}
            getUnits={getUnits}
          />
        </div>
      </div>
      <DynamicForm
        show={showForm}
        handleClose={handleCloseForm}
        fields={unitFields}
        data={selectedUnit}
        onSuccess={getUnits}
        formType={selectedUnit.id ? "Edit" : "Add"}
        url={baseUrl}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}