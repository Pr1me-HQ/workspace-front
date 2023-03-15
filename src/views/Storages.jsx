import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import axiosClient from "../axios-client.js";
import loading_icon from "../assets/icons/loading.svg";
import { useStateContext } from "../context/ContextProvider.jsx";
import DynamicTable from "../components/GenericTable.jsx";
import DynamicForm from "../components/UniversalFormModal.jsx";
import { Pagination } from "../components/Pagination.jsx";

export default function Storages() {
  const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);
  const [showForm, setShowForm] = useState(false);
  const [storages, setStorages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [regions, setRegions] = useState([]);
  const [branches, setBranches] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = '/storages/'
  const keys = ['name']
  const headers = ['Название']
  

  // =========== Make all requests ============
  function getStorages() {
    setLoading(true);
    axiosClient.get(baseUrl,
      {
        params: {
          page: currentPage,
          search: search ? search : null,
          limit: limit,
        }
      })
    .then(({data}) => { 
      setStorages(data.data);
      setLastPage(data.meta.last_page);
      console.log('storages', storages)
      setLoading(false);

    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }

  function getStorage(id){
    setLoading(true);
    axiosClient.get('/regions'+ id)
    .then(({data}) => {
      setSelectedStorage(data.data);
      console.log('selectedStorage', selectedStorage)
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
      // append empty option to the beginning of the array and set it as the default value and append the regions to the array
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }

  function getBranches() {
    setLoading(true);
    axiosClient.get('/branches')
    .then(({data}) => {
      setBranches(data.data);
      console.log('branches', branches)
      setLoading(false);
      // append empty option to the beginning of the array and set it as the default value and append the regions to the array
    })
    .catch((error) => {
      console.log(error)
      setLoading(false);
    })
  }
  
  useEffect(() => {
    getStorages()
    getRegions()
    getBranches()
  }, [])

  useEffect(() => {
    getStorages()
    localStorage.setItem("limit", limit);
  }, [currentPage, search, limit])

  // ============================================

  // ============ Make all columns ==============
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
  // ============================================

  // ============ Make all fields =============== 
    const storagesFields = [
    {
      name: 'name',
      label: 'Название',
      type: 'text',
      placeholder: 'Введите название',
      required: true,
    },
    {
      name: 'description',
      label: 'Описание',
      type: 'text',
      placeholder: 'Введите описание',
      required: true,
    },
    {
      name: 'branch_id',
      label: 'Филиал',
      type: 'select',
      options: branches,
      required: true,
    },
    {
      name: 'region_id',
      label: 'Регион',
      type: 'select',
      options: regions,
      required: true,
    },
  ]
  // ============================================
   
  // ============ Make delete function ============
  const onDeleteClick = (storage) => {
    setSelectedStorage(storage);
    setShowConfirmation(true);
  }    

  // ============================================

  // ============ Make edit function ============

  const onEditClick = (storage) => {
    setSelectedStorage(storage);
    console.log('selected storage', storage)
    setShowForm(true);
  }
  
  // ============================================

  // ============ Make add function ============

  const onAddClick = () => {
      setSelectedStorage({});
      setShowForm(true);
      clearForm();
  }
  // ============================================
  

  // ============ Handle pagination ===============
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  }
  // ============================================
  
  // ============ Handle search ====================
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1);
  }
  // ===============================================

  // ============ Handle form ======================
  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedStorage({});
  }
  // ===============================================

  // ============ Handle confirmation ==============

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setSelectedStorage({});
  }
  // ===============================================

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">Склад</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
        <div className="form-group">
        <input type="text" className="form-control" placeholder="Поиск" onChange={handleSearchChange} />
      </div>
        <Button variant="primary" onClick={onAddClick}> 
            Добавить склад
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
              data={storages}
              columns={columns}
              actions={[
                {
                  icon: "Изменить",
                  onClick: onEditClick,
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
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={paginate}
            getStorages={getStorages}
          />
        </div>
      </div>
      <DynamicForm
        show={showForm}
        handleClose={handleCloseForm}
        fields={storagesFields}
        data={selectedStorage}
        onSuccess={getStorages}
        formType={selectedStorage.id ? "Edit" : "Add"}
        url={baseUrl}
        showConfirmation={showConfirmation}
        setShowConfirmation={setShowConfirmation}
      />
    </div>
  );
}