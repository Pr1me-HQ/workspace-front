  import React, {useEffect, useState} from "react";
  import axiosClient from "../axios-client.js";
  import {useStateContext} from "../context/ContextProvider.jsx";
  import loading_icon from "../assets/icons/loading.svg";
  import { UserForm } from './UserForm.jsx'
  import { Button } from "react-bootstrap";
  import {FiEdit2} from 'react-icons/fi';
  import {MdOutlinePersonRemove, MdPersonAddAlt} from 'react-icons/all';
  import { createContext } from "react";

  export default function Users() {
    const [showForm, setShowForm] = useState(false);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const {setNotification} = useStateContext();
    const [selectedUser, setSelectedUser] = useState({});

    useEffect(() => {
      getUsers();
    }, [])

    const handleCloseForm = () => {
      setShowForm(false);
    }
    
    const handleEditClick = (user) => {
      setSelectedUser(user);
      setShowForm(true);
    }

    const clearForm = () => {
      setSelectedUser({
        first_name: '',
        last_name: '',
        middle_name: '',
        email: '',
        phone_number: '',
        password: '',
        password_confirmation: '',
      });
    }
  
    const handleAddUser = () => {
      setSelectedUser({});
      setShowForm(true);
      clearForm();
    };

    const onDeleteClick = user => {
      if (!window.confirm("Are you sure you want to delete this user?")) {
        return
      }
      axiosClient.delete(`/users/${user.id}`)
        .then(() => {
          setNotification('User was successfully deleted')
          getUsers();
        })
    }
    
    
    const getUsers = () => {
      setLoading(true)
      axiosClient.get('/users')
        .then(({ data }) => {
          setLoading(false)
          setUsers(data.data)
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
          <h1>Users</h1>
        </div>
          <Button className="w-25" variant="primary" onClick={handleAddUser}>
            <MdPersonAddAlt/>
          </Button>
        <UserForm showForm={showForm} closeForm={handleCloseForm} selectedUser={selectedUser} />
    
        <div className="card animated fadeInDown">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
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
                {users.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.first_name}</td>
                    {/* <td>{u.last_name}</td>
                    <td>{u.middle_name}</td> */}
                    <td>{u.email}</td>
                    <td>{u.created_at.slice(0,10)}</td>
                    <td>{u.created_at.slice(11,19)}</td>  
                  <td>
                     <button className="btn-edit" onClick={ev => handleEditClick(u)}><FiEdit2/></button>
                     <button className="btn-delete" onClick={ev => onDeleteClick(u)}><MdOutlinePersonRemove/></button>
                  </td>
                </tr>
              ))}
              </tbody>
            }
          </table>
        </div>
      </div>
    )
  }