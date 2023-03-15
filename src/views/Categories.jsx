import React, { useEffect, useState } from "react";
import axiosClient from "../axios-client";
import { useStateContext } from "../context/ContextProvider";
import loading_icon from "../assets/icons/loading.svg";
import Modal from "react-bootstrap/Modal";
import {FiEdit2} from 'react-icons/fi';
import {BiShow} from 'react-icons/bi';
import {CgRemoveR} from 'react-icons/cg';
import {IoBagRemoveOutline} from 'react-icons/all';
import {Pagination} from "../components/Pagination";
import DynamicTable from "../components/GenericTable";
import DynamicForm from "../components/UniversalFormModal";
import Form from 'react-bootstrap/Form';

export default function Categories() {
  const [limit, setLimit] = useState(localStorage.getItem("limit") || 10);
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  
  const baseUrl = "/categories/";
  const headers = ["Название"];

  useEffect(() => {
    getCategories();
    localStorage.getItem("limit", limit)
  }, [currentPage, search, limit]);

  useEffect(() => {
    getAllCategories();
  }, []);

  var counter=from;

  const counterIncrement = () => {
    if (counter <= to) {
      counter++;
    } else {
      counter=from;
    }

    return counter;
  };


  const onDeleteClick = (category) => {
    setSelectedCategory(category);
    setShowConfirmation(true);
  };

  const onSuccess = () => {
    getCategories();
    setShowConfirmation(false);
    setSelectedCategory({
      title: "",
      description: "",
      parent_id: null,
    });
  };

  const onEditClick = (category) => {
    getCategory(category.id);
    setShow(true);
    setShowModal(false);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCategory({
      title: "",
      description: "",
      parent_id: null,
    });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getCategories = () => {
    setLoading(true);
    axiosClient
    // Add pagination to the request url
      .get("/categories", {
        params: { 
                  page: currentPage, 
                  limit: limit, 
                  search: search ? search : null},
        })
      .then(({ data }) => {
        setLoading(false);
        console.log(data);
        setLastPage(data.meta.last_page);
        setFrom(data.meta.from);
        setTo(data.meta.to);
        setCurrentPage(data.meta.current_page);
        setCategories(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  }; 

  const getAllCategories = () => {
    axiosClient
      .get("/categories", {
        params: {
          status: 1,
        },
      }
     )
      .then(({ data }) => {
        setAllCategories(data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

 const getCategory = (id) => {
    setLoading(true);
    axiosClient
      .get(baseUrl + id)
      .then(({ data }) => {
        setLoading(false);
        setSelectedCategory(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
    };


  const getParentCategory = (id) => {
    const category = allCategories.find((r) => r.id === id);
    return category ? category.title : "-";
  };

  const onShowChildrenClick = (c) => {
    getCategory(c.id);
    console.log("selectedCategory", selectedCategory);
    setShowModal(true);
  };  


  const handleLimitChange = (e) => {
    setLimit(e.target.value);
    localStorage.setItem("limit", e.target.value);
  };

  const columns = [
  {
      key: "title",
      render: (value) => <>{value}</>
  },
  // {
  //     key: "description",
  //     // show only first 50 characters
  //     render: (value) => <>{value.substring(0, 30)+". . ."}</>
  // },      
  // {
  //   key: "parent_id",
  //   render: (parent_id) => getParentCategory(parent_id),
  // },
  // {
  //     key: "children",
  //     render: (value) => <>{value.length}</>
  // },
  // {
  //     key: "created_at",
  //     render: (value) => <>{value}</>
  // },
  ];

  const categoryFields = [
    {
      name: "title",
      label: "Title",
      type: "text",
      placeholder: "Enter title",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "text",
      placeholder: "Enter description",
      required: true,
    },
    {
      name: "parent_id",
      label: "Parent Category",
      type: "select",
      options: allCategories,
    },

  ];

  const actions = [
    {
      title: "Edit",
      icon: <FiEdit2 />,
      onClick: onEditClick,
    },
    {
      title: "Show Children",
      icon: <BiShow />,
      onClick: onShowChildrenClick,
    },
    {
      title: "Delete",
      icon: <CgRemoveR />,
      onClick: onDeleteClick,
    },
  ];
    
  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h1 className="text-center">Категории</h1>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <div className="d-flex-inline">
            <div>
            
            <input
              type="search"
              className="form-control"
              placeholder="Search"
              size={3}
              value={search}
              onChange={(e) => setSearch(e.target.value)}/>

            <Form>
              <Form.Group controlId="formLimit">
                <Form.Label>Показывать по</Form.Label>
                <Form.Control type="number" value={limit} onChange={handleLimitChange} />
              </Form.Group>
            </Form>
            </div>
            <button
              className="btn btn-primary mt-3 mb-3"
              onClick={() => setShow(true)}
              size="sm"
            >
              Добавить категорию
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
                {categories.length} найденных регионов
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
          ) : categories.length === 0 ? (
            <h3>No categories found</h3>
          ) : (
            <DynamicTable
              columns={columns}
              headers={headers}
              data={categories}
              actions={actions}
            />
          )}
        </div>
      </div>
      <DynamicForm
        show={show}
        fields={categoryFields}
        handleClose={handleClose}
        name="Category"
        url={baseUrl}
        data={selectedCategory}
        setShowConfirmation={setShowConfirmation}
        onSuccess={onSuccess}
        showConfirmation={showConfirmation}
        />
      <Modal show={showModal} onHide={() => setShowModal(false)}> 
        <Modal.Header closeButton>
          <h3 className="text-center">Информация о категории</h3>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedCategory && (
            <table className="table table-bordered">
              <tbody>
                <tr>
                  <td>Название</td>
                  <td>{selectedCategory.title}</td>
                </tr>
                <tr>
                  <td>Описание</td>
                  <td>{selectedCategory.description}</td>
                </tr>
                <tr>
                  <td>Родительская категория</td>
                  <td>{getParentCategory(selectedCategory.parent_id)}</td>
                </tr>
                <tr>
                  <td>Количество дочерних категорий</td>
                  <td>{selectedCategory.children?.length}</td>
                </tr>
                <tr>
                  <td>Дата создания</td>
                  <td>{selectedCategory.created_at}</td>
                </tr>
              </tbody>
          {selectedCategory.children?.length > 0 ? (
            selectedCategory.children.map((c) => (
              
              <tr key={c.id}>
                  <td>Дочерние категории</td>
             <td key={c.id}>
                <h5 className="text-center">{c.title}</h5>
              </td>
              <td key={c.id}>
                {/* actions goes here */}
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-primary btn-sm mx-1"
                    onClick={() => onEditClick(c)}
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="btn btn-success btn-sm mx-1" 
                    onClick={() => onShowChildrenClick(c)}
                  >
                    <BiShow />
                  </button>
                  <button
                    className="btn btn-danger btn-sm mx-1"
                    onClick={() => onDeleteClick(c)}
                  >
                    <CgRemoveR />
                  </button>
                </div>
              </td>
            </tr>
            )
            )
          ) : (
            <td className="text-center">Нет дочерниx категорий</td>
          )}
          </table>
          )}
                  
        </Modal.Body>
      </Modal>
      {
        // if length of categories is greater than limit, show pagination
        allCategories.length > limit && !search && (
          <Pagination
            currentPage={currentPage}
            lastPage={lastPage}
            onPageChange={handlePageChange}
          />
        )

      }
    
    </div>
  );
}