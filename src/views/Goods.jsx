import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
import { Button, Form, Modal } from "react-bootstrap";
import { FiEdit2, FiEye } from "react-icons/fi";
import { IoBagRemoveOutline } from "react-icons/all";
import { Pagination } from "../components/Pagination.jsx";  
import DynamicTable from "../components/GenericTable.jsx";
import DynamicForm from "../components/UniversalFormModal.jsx";

export default function Goods() {
  const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);
  const [showForm, setShowForm] = useState(false);
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGood, setSelectedGood] = useState({});
  const { setNotification } = useStateContext();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [categories, setCategories] = useState([]);
  const [places, setPlaces] = useState([]);
  const [units, setUnits] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [ pageSize ,setPageSize] = useState(10);
  const baseUrl = "/goods/";  
  
  useEffect(() => {
    getGoods();
    getCategories();
    getPlaces();
    getUnits();
  }, []);

  useEffect(() => {
    getGoods();
    localStorage.setItem("limit", limit);
  }, [currentPage, search, limit]);
  

  const handleCloseForm = () => { 
    setSelectedGood({});
    setShowForm(false);
  };

  const getGood = (id) => {
    axiosClient
      .get(baseUrl + id)
      .then(({ data }) => {
        setSelectedGood(data.data);
      })
      .catch(() => {
        console.log("Failed to fetch good");
      });
  };


  const getCategories = () => {
    axiosClient
      .get("/categories")
      .then(({ data }) => {
        setCategories(data.data);
      })
      .catch(() => {
        console.log("Failed to fetch categories");
      });
  };

  const getPlaces = () => {
    axiosClient
      .get("/places")
      .then(({ data }) => {
        setPlaces(data.data);
      })
      .catch(() => {
        console.log("Failed to fetch places");
      });
  };

  const getUnits = () => {
    axiosClient
      .get("/units")
      .then(({ data }) => {
        setUnits(data.data);
      })
      .catch(() => {
        console.log("Failed to fetch units");
      });
  };

  
  const handleEditClick = (good) => {
    getGood(good.id);
    setShowForm(true);
  };

  const handleDetailsClick = (good) => {
    getGood(good.id);
    setShowDetails(true);
  };

  const handleAddGood = () => {
    setSelectedGood({});
    setShowForm(true);
  };

  const onDeleteClick = (good) => {
    setSelectedGood(good);
    setShowConfirmation(true);
  };

  const handleLimitChange = (e) => {
    setLimit(e.target.value);
    localStorage.setItem("limit", e.target.value);
  };

  const headers = ["Название"]

  const columns = [
    {
        key: "title",
        render: (value) => <>{value}</>
    },
];

  const goodFields = [
    {
      name: "title",
      label: "Название",
      type: "text",
    },
    {
      name: "images[]",
      label: "Изображение",
      type: "file",
    },
    {
      name: "description",
      label: "Описание",
      type: "text",
    },
    {
      name: "category_id",
      label: "Категория",
      type: "select",
      options: categories,
    },
    {
      name: "place_id",
      label: "Место",
      type: "select",
      options: places,
    },
    {
      name: "unit_id",
      label: "Единица",
      type: "select",
      options: units,
    },
    {
      name: "status",
      label: "Статус",
      type: "select",
      options: [
        {
          id: 1,
          title: "Активный",
        },
        {
          id: 0,
          title: "Не активный",
        },
      ],
    }
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getGoods = () => {
    setLoading(true);
    axiosClient
      .get("/goods", {
        params: {
          page: currentPage,
          limit: limit ? limit : 10,
          search: search ? search : null,
          status: 1, 
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setGoods(data.data);
        console.log(data);
        setCurrentPage(data.meta.current_page);
        setLastPage(data.meta.last_page);
        setPageSize(data.meta.per_page);
      })
      .catch(() => {
        setLoading(false);
        setNotification("Failed to fetch goods");
      });
  };
  
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  return (
      // use dynamic table component here instead of the table below
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center">Товары</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Form.Label style={{margin: "1rem"}}>Поиск</Form.Label>
            <Form.Control
              type="search"
              placeholder="Поиск"
              value={search}
              onChange={handleSearchChange}
              style={{width: "300px", height: "3rem", margin: "0 1rem 1rem"}}

            />
            <Form>
            <Form.Group controlId="formLimit" >
              <Form.Label style={{margin: "0 1rem"}}>Количество на странице</Form.Label>
                <Form.Control style={{width: "80px", height: "3rem", margin: "1rem"}} type="number" value={limit} onChange={handleLimitChange} />
              </Form.Group>
            </Form>        
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Button variant="primary" onClick={handleAddGood}>
              Добавить товар
            </Button>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
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
            ) : goods.length === 0 ? (
              <h3>
                <span className="text-danger">Не найдено ни одного товара
                </span>
              </h3>
            ) : (
              <DynamicTable
                headers={headers}
                page={currentPage}
                limit={localStorage.getItem("limit")} 
                columns={columns}
                data={goods}
                updateUrl="/goods/"
                actions={[
                  {
                    icon: <FiEye />,
                    onClick: handleDetailsClick,
                  },
                  {
                    icon: <FiEdit2 />,
                    onClick: handleEditClick,
                  },
                  {
                    icon: <IoBagRemoveOutline />,
                    onClick: onDeleteClick,
                  },
                ]}
              />
            )}
          </div>
        </div>
        <Modal show={showDetails} onHide={() => setShowDetails(false)}> 
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center">
          <table>
            <tbody>
              <tr>
                <td>ID</td>
                <td>{selectedGood.id}</td>
              </tr>
              <tr>
                <td>Название</td>
                <td>{selectedGood.title}</td>
              </tr>
              <tr>
                <td>Описание</td>
                <td>{selectedGood.description}</td>
              </tr>
              <tr>
                <td>Категория</td>
                <td>{selectedGood.category?.title}</td>
              </tr>
              <tr>
                <td>Место</td>
                <td>{selectedGood.place?.name}</td>
              </tr>
              <tr>
                <td>Единица</td>
                <td>{selectedGood.unit?.name}</td>
              </tr>
              <tr>
                <td>Статус</td>
                <td>{selectedGood.status ? "Активный" : "Не активный"}</td>
              </tr>
              <tr>
                <td>Дата создания</td>
                <td>{(selectedGood.created_at?.split('T')[0])}</td>
              </tr>
            </tbody>
          </table>    
        </Modal.Body>
      </Modal>
        <div className="row">
          <div className="col-12">
            <Pagination
              currentPage={currentPage}
              lastPage={lastPage}
              onPageChange={handlePageChange}
            />
          </div>
          <DynamicForm
            show={showForm}
            handleClose={handleCloseForm}
            fields={goodFields}
            data={selectedGood}
            onSuccess={getGoods}
            formType={selectedGood.id ? "Edit" : "Add"}
            name="Good"
            url={baseUrl}
            showConfirmation={showConfirmation}
            setShowConfirmation={setShowConfirmation}
          />
        </div>
      </div>  
  );
};