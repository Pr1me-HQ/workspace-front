import { useState, useEffect } from "react";
import axiosClient from "../axios-client.js";
import { useStateContext } from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
import React from "react";
import { Modal, Button } from "react-bootstrap";

export const UserForm = ({ showForm, closeForm, selectedUser }) => {

  const notification = useStateContext().notification;
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState([]);
  const { setNotification } = useStateContext();
  const [roles, setRoles] = useState([]);
  const [user, setUser] = useState({ ...selectedUser });
  
  useEffect(() => {
    setUser(selectedUser);
    console.log(selectedUser);
  }, [selectedUser]);
  
  useEffect(() => {
    getRegions();
    getRoles();
  }, []);

  const getRoles = () => { 
    try {
      axiosClient.get("/roles").then((response) => {
        setRoles(response.data.data);
        console.log(response.data.data);
      });
      
    } catch (error) {
      console.log(error);
    }
  };      

  const getRegions = () => {
    setLoading(true);
    axiosClient
      .get("/regions")
      .then(({ data }) => {
        setLoading(false);
        setRegions(data.data);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    if (selectedUser && selectedUser.id) {
      axiosClient
        .put(`/users/${selectedUser.id}`, user)
        .then(() => {
          setNotification("User was successfully updated");
          closeForm();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => setLoading(false));
    } else {
      axiosClient
        .post("/users", user)
        .then(() => {
          setNotification("User was successfully created");
          closeForm();
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
        .finally(() => setLoading(false));
    }
  };

  return (
    <>
      <Modal className="mx-auto" show={showForm} onHide={closeForm}>
        <Modal.Header className="mx-auto" closeButton>
          {selectedUser.id ? <h1>Update user</h1> : <h1>Add user</h1>}
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={onSubmit} className="p-4">
            {errors &&
              Object.entries(errors).map(([key, value]) => (
                <div key={key} className="alert alert-danger">
                  {value}
                </div>
              ))}
            <div className="form-group mt-4">
              <label htmlFor="first_name">First name</label>
              <input
                type="text"
                className="form-control"
                id="first_name"
                placeholder={selectedUser ? selectedUser.first_name : ""}
                value={user.first_name}
                onChange={(ev) =>
                  setUser({ ...selectedUser, first_name: ev.target.value })
                }
                />
            </div>
            <div className="form-group">
              <label htmlFor="last_name">Last name</label>
              <input
                type="text" 
                className="form-control"
                id="last_name"
                placeholder={selectedUser ? selectedUser.last_name : ""}
                value={user.last_name}
                onChange={(ev) =>
                setUser({ ...user, last_name: ev.target.value })
                }
                />
            </div>
            <div className="form-group">
              <label htmlFor="middle_name">Middle name</label>
              <input
                type="text"
                className="form-control"
                id="middle_name"
                placeholder={selectedUser ? selectedUser.middle_name : ""}
                value={user.middle_name}
                onChange={(ev) =>
                  setUser({ ...user, middle_name: ev.target.value })
                }
                />
            </div>
            <div className="form-group">
              <label htmlFor="birth_date">Birth date</label>
              <input
                type="date"
                className="form-control"
                id="birth_date"
                placeholder={selectedUser ? selectedUser.birth_date : ""}
                value={user.birth_date}
                onChange={(ev) =>
                  setUser({ ...user, birth_date: ev.target.value })
                }
                />
            </div>
          <div className="form-group">
            <label htmlFor="region_id">Region</label>
            <select className="form-select" id="region_id" name="region_id"
                  value={user.region_id} 
                  onChange={ev => setUser({...user, region_id: ev.target.value})}>
            <option value="">Select region</option>
            { loading ? <option value="">Loading...</option> :
            regions.map((region) => (
              <option key={region.id} value={region.id}>{region.title}</option>
            ))}
          </select>
            </div>
              
           <div className="form-group">
            <label htmlFor="role_id">Role</label>
            <select className="form-select" id="role_id" name="role_id"
                  // onClick={getRoles}    
                  value={user.role_id}
                  onChange={ev => setUser({...user, role_id: ev.target.value})}>
            <option value="">Select role</option>
            { loading ? <option value="">Loading...</option> :
            roles.map((role) => (
              <option key={role.id} value={role.id}>{role.name}</option>
            ))}
          </select>
            </div> 

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
            type="text"           
            className="form-control"
            id="phone"
            placeholder={selectedUser.phone_number ? selectedUser.phone_number : ""}
            value={user.phone_number}
            onChange={(ev) => setUser({ ...user, phone_number: ev.target.value })}
            />
            </div>           

            <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
            type="email"
            className="form-control"
            id="email"
            aria-describedby="emailHelp"
            placeholder={selectedUser ? selectedUser.email : ""}
            value={user.email}
            onChange={(ev) => setUser({ ...user, email: ev.target.value })}
            />
            </div>
            <>  
            <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Password"
              value={user.password}
              onChange={(ev) =>
              setUser({ ...user, password: ev.target.value })
            }
            />
            </div>
            <div className="form-group">
            <label htmlFor="password_confirmation">
            Confirm password
            </label>
            <input
            type="password"
            className="form-control"
            id="password_confirmation"
            placeholder="Confirm password"
            value={user.password_confirmation}
            onChange={(ev) =>
            setUser({
            ...user,
            password_confirmation: ev.target.value,
            })
            }
            />
            </div>
            </>
            
            <Button type="submit" disabled={loading} className="mt-4">
            {loading ? (
            <img
                            src={loading_icon}
                            alt="Loading..."
                            height="32"
                            width="32"
                          />
            ) : (
            "Save"
            )}
            </Button>
            </form>
            </Modal.Body>
            </Modal>
            </>
            );
            };
export default UserForm;