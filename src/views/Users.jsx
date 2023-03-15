  import React, { useState, useEffect } from "react";
  import { Modal, Button, Form, Alert } from "react-bootstrap";
  import axiosClient from "../axios-client.js";
  import loading_icon from "../assets/icons/loading.svg";
  import { useStateContext } from "../context/ContextProvider.jsx";
  import DynamicTable from "../components/GenericTable.jsx";
  import DynamicForm from "../components/UniversalFormModal.jsx";
  import { Pagination } from "../components/Pagination.jsx";

  export default function Users() {
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [selectedUser, setSelectedUser] = useState({});
    const [showDetails, setShowDetails] = useState(false);
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [regions, setRegions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [limit, setLimit] = useState(localStorage.getItem('limit') || 10);

    const baseUrl = '/users/'
    const keys = ['first_name', 'last_name', 'middle_name']
    const headers = ['Имя', 'Фамилия', 'Отчество', 'Статус']
    
    function getUsers() {
      setLoading(true);
      axiosClient.get(baseUrl,
        {
          params: {
            search: search ? search : null,
            page: currentPage,
            limit: limit,
          }
        })
        .then(({data}) => {
          setUsers(data.data);
          setCurrentPage(data.meta.current_page);
          setLastPage(data.meta.last_page);
          
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
      getUsers();
    }, [currentPage, search]);
    
    useEffect(() => {
      getUsers();
      getRegions();
      getRoles();
    }, []);  

    const usersFields = [
      {
        name: 'first_name',
        label: 'Имя',
        type: 'text',
        placeholder: 'Введите имя',
        required: true,
      },
      {
        name: 'last_name',
        label: 'Фамилия',
        type: 'text',
        placeholder: 'Введите фамилию',
        required: true,
      },
      {
        name: 'middle_name',
        label: 'Отчество',
        type: 'text',
        placeholder: 'Введите отчество',
        required: true,
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        placeholder: 'Введите email',
        required: true,
      },
      {
        name: 'phone_number',
        label: 'Телефон',
        type: 'tel',
        placeholder: 'Введите телефон',
        required: true,
      },
      {
        name: 'birth_date',
        label: 'Дата рождения',
        type: 'date',
        placeholder: 'Введите дату рождения',
        required: true,
      },
      {
        name: 'about',
        label: 'Описание',
        type: 'textarea',
        placeholder: 'Введите описание',
        required: true,
      },
      {
        name: 'region_id',
        label: 'Регион',
        type: 'select',
        placeholder: 'Выберите регион',
        required: true,
        options: regions,
      },
      {
        name: 'roles[0]',
        label: 'Роль',
        type: 'select',
        placeholder: 'Выберите роль',
        required: true,
        options: roles,
      },
      {
        name: 'password',
        label: 'Пароль',
        type: 'password',
        placeholder: 'Введите пароль',
        required: true,
      },
      {
        name: 'password_confirmation',
        label: 'Подтверждение пароля',
        type: 'password',
        placeholder: 'Введите пароль еще раз',
        required: true,
      },
    ];
    

    function getRoles() {
      setLoading(true);
      axiosClient.get('/roles')
      .then(({data}) => {
          setLoading(false);
          setRoles(data.data);
        })
        .catch((error) => {
            console.log(error)
            setLoading(false);
          })
        }
        
      const onDeleteClick = (user) => {
        setSelectedUser(user);
        setShowConfirmation(true);
      }
      
      const columns = [
        {
          key: 'first_name',
          render: value => value,
          title: 'Имя',
        },
        {
          key: 'last_name',
          render: value => value,
          title: 'Фамилия',
        },
        {
          key: 'middle_name',
          render: value => value,
          title: 'Отчество',
        }
      ]

      console.log('columns', columns)

    const getUser = (id) => {
      setLoading(true)
      axiosClient.get(baseUrl + id)
        .then(({data}) => {
          setLoading(false)
          setSelectedUser(data.data)
        })
        .catch(() => {
          setLoading(false);
        });
    };


    const handleSearch = (query) => {
      setSearch(query);
      setCurrentPage(1);
    }

    const handleCloseForm = () => {
      setShowForm(false);
      setSelectedUser({});
    }
    
    const handleEditClick = (user) => {
      getUser(user.id);
      console.log('selected user', user)
      setShowForm(true);
    }
    
    const handleDetailsClick = (user) => {
      getUser(user.id);
      setShowDetails(true);
    }

    const handleAddUser = () => {
        setSelectedUser({});
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
            <h1 className="text-center">Пользователи</h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
          <div className="form-group">
          <input type="text" className="form-control" placeholder="Поиск" onChange={handleSearchChange} />
        </div>
          <Button variant="primary" onClick={handleAddUser}> 
            Добавить пользователя
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
                data={users}
                limit={limit}
                updateUrl='/users/'
                columns={columns}
                page={currentPage}
                actions={[
                  {
                    icon: "Подробнее",
                    onClick: handleDetailsClick,
                  },
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
        <Modal show={showDetails} onHide={() => setShowDetails(false)}> 
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className="text-center">
          <table>
            <tbody>
              <tr>
                <td>Имя</td>
                <td>{selectedUser.first_name}</td>
              </tr>
              <tr>
                <td>Фамилия</td>
                <td>{selectedUser.last_name}</td>
              </tr>
              <tr>
                <td>Отчество</td>
                <td>{selectedUser.middle_name}</td>
              </tr>
              <tr>
                <td>Почта</td>
                <td>{selectedUser.email}</td>
              </tr>
                <tr>
                <td>Дата рождения</td>
                <td>{selectedUser.birth_date}</td>
              </tr>
              <tr>
                <td>Описание</td>
                <td>{selectedUser.about}</td>
              </tr>
              <tr>
                <td>Роль</td>
                <td>{selectedUser.roles?.map(
                  (role) => role.name + ", "
                )}</td>
              </tr>
              <tr>
                <td>Регион</td>
                <td>{selectedUser.region?.title}</td>
              </tr>
              <tr>
                <td>Добавлен</td>
                <td>{selectedUser.created_at}</td>
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
              onPageChange={setCurrentPage}
              getUsers={getUsers}
            />
          </div>
        </div>
        <DynamicForm
          show={showForm}
          handleClose={handleCloseForm}
          fields={usersFields}
          data={selectedUser}
          onSuccess={getUsers}
          formType={selectedUser.id ? "Edit" : "Add"}
          url={baseUrl}
          showConfirmation={showConfirmation}
          setShowConfirmation={setShowConfirmation}
        />
      </div>
    );
  }