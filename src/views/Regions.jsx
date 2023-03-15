import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import loading_icon from "../assets/icons/loading.svg";
import Modal from "react-bootstrap/Modal";
import {FiEdit2} from 'react-icons/fi';
import {BiShow} from 'react-icons/bi';
import {CgRemoveR} from 'react-icons/cg';
import { Pagination } from "../components/Pagination";
import DynamicTable from "../components/GenericTable";
import DynamicForm from "../components/UniversalFormModal";

export default function Regions() {
  const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);
  const [showModal, setShowModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState({});
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(false);  
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [allRegions, setAllRegions] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const baseUrl = "/regions/";
  const keys = ["title", "parent_id", "children_count"];
  const headers = ["Название"];

  useEffect(() => {
    getRegions();
  }, [currentPage, search, limit]);

  useEffect(() => {
    getAllRegions();
  }, []);

  const onDeleteClick = (region) => {
    setSelectedRegion(region);
    setShowConfirmation(true);

  };

  const onEditClick = (region) => {
    getRegoin(region.id);
    setShowModal(false);
    setShow(true);
  };

  const onSuccess = () => {
    getRegions();
    setShow(false);
    setShowModal(false);
    setSelectedRegion({
      title: "",
      parent_id: "",
    });
  };

  const handleClose = () => {
    setShow(false);
    setShowModal(false);
    setSelectedRegion({
      title: "",
      parent_id: "",
    });
  };

  const getAllRegions = () => {
    setLoading(true);
    axiosClient
      .get("/regions")
      .then(({ data }) => {
        setLoading(false);
        setAllRegions(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getParentRegion = (id) => {
    const region = allRegions.find((r) => r.id === id);
    return region ? region.title : "";
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getRegoin = (id) => {
    setLoading(true);
    axiosClient
      .get(baseUrl + id)
      .then(({ data }) => {
        setLoading(false);
        setSelectedRegion(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
    };

  const getRegions = () => {
    setLoading(true);
    axiosClient
      .get("/regions", {
        params: { 
                  page: currentPage, 
                  limit: 10, 
                  search: search ? search : null
                },
        })
      .then(({ data }) => {
        setLoading(false);
        console.log(data);
        setLastPage(data.meta.last_page);
        setCurrentPage(data.meta.current_page);
        setRegions(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }; 

  const onShowChildrenClick = (c) => {
    getRegoin(c.id);
    console.log("selectedRegion", selectedRegion);
    setShowModal(true);
  };  

  const columns = [
    {
      key: "title",
      label: "Название",
      render: value => value,
    },
  ]

  const regionFields = [
    {
      name: "title",
      label: "Название",
      type: "text",
      placeholder: "Название",
      required: true,
    },
    {
      name: "parent_id",
      label: "Родительский регион",
      type: "select",
      options: allRegions,
    }
  ]

  const actions = [
    {
      title: "Редактировать",
      icon: <FiEdit2 />,
      onClick: onEditClick,
    },
    {
      title: "Показать дочерние",
      icon: <BiShow />,
      onClick: onShowChildrenClick,
    },
    {
      title: "Удалить",
      icon: <CgRemoveR />,
      onClick: onDeleteClick,
    },
  ];
    
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">Регионы</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between">
            <div className="d-flex">
              <input
                type="search"
                className="form-control"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShow(true)}
            >
              Добавить регион
            </button>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          {
            // if search is not empty, show how many results are found
            search && (
              <h6 className="text-center">
                {regions.length} найденных регионов
              </h6>
            )
          }          
          {loading ? (
            <table>
            <tbody>
            <tr>
              <td colSpan="10" className="text-center">
                <img src={loading_icon} width="40px" alt="Loading" />
              </td>
            </tr>
          </tbody>
          </table>
          ) : regions.length === 0 ? (
            <h3>No regions found</h3>
          ) : (
            <DynamicTable
              columns={columns}
              headers={headers}
              data={regions}
              actions={actions}
            />
          )}
        </div>
      </div>
      <DynamicForm
        show={show}
        fields={regionFields}
        handleClose={handleClose}
        name="Region"
        url={baseUrl}
        onSuccess={onSuccess}
        data={selectedRegion}
        showConfirmation={showConfirmation} 
        setShowConfirmation={setShowConfirmation}
          />
      <Modal show={showModal} onHide={() => setShowModal(false)}> 
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedRegion && (
            <div>
              <h3 className="text-center">Информация о категории</h3>
              <hr />

          <h3 className="">Название: <span className="d-flex-inline">{selectedRegion.title}</span></h3>
          <hr />
          <h5 className="text-center">
          <h3 className="text-center">Родительский регион: </h3>
            {selectedRegion.parent
              ? selectedRegion.parent.title
              : "Нет родительского региона"}
          </h5>
          <hr />

          
          <h3 className="text-center">Дочерние категории: </h3>
          {selectedRegion.children?.length > 0 ? (
            selectedRegion.children.map((r) => (
            
                <tr key={r.id}>
             <td key={r.id}>
                <h5 className="text-center">{r.title}</h5>
              </td>
              <td key={r.id}>
                {/* actions goes here */}
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => onEditClick(r)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn btn-success btn-sm mx-1" 
                    onClick={() => onShowChildrenClick(r)}
                  >
                    <BiShow />
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => onDeleteClick(r)}
                  >
                    <CgRemoveR />
                  </button>
                </div>
              </td>
            </tr>
            )
            )
          ) : (
            <h5 className="text-center">Нет дочерниx категорий</h5>
          )}
  
          <hr />
          <h3 className="text-center">Дата создания: </h3>
          <p className="text-center">{selectedRegion.created_at?.slice(0,10)}</p>
          <hr />
            </div>
          )}
                  
        </Modal.Body>
      </Modal>
      {/* Show pagination if it is not search and number of regions is less then limit  */}
      {regions.length > limit || !search && (

      <Pagination
        currentPage={currentPage}
        lastPage={lastPage}
        onPageChange={handlePageChange}
      />
      )}
    </div>
  );
}