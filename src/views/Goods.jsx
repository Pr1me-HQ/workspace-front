import React, {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
// import { GoodForm } from './GoodForm.jsx'
import { Button } from "react-bootstrap";
import {FiEdit2} from 'react-icons/fi';
import {MdOutlinePersonRemove, MdPersonAddAlt} from 'react-icons/md';


export default function Goods() {
  const [showForm, setShowForm] = useState(false);
  const [goods, setGoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();
  const [selectedGood, setSelectedGood] = useState({});

  useEffect(() => {
    getGoods();
  }, [])

  const handleCloseForm = () => {
    setShowForm(false);
  }
  
  const handleEditClick = (good) => {
    setSelectedGood(good);
    setShowForm(true);
  }

  const handleAddGood = () => {
    setSelectedGood({});
    setShowForm(true);
  };

  const onDeleteClick = good => {
    if (!window.confirm("Are you sure you want to delete this good?")) {
      return
    }
    axiosClient.delete(`/goods/${good.id}`)
      .then(() => {
        setNotification('Good was successfully deleted')
        getGoods();
      })
  }
  
  
  const getGoods = () => {
    setLoading(true)
    axiosClient.get('/goods')
      .then(({ data }) => {
        setLoading(false)
        setGoods(data.data)
        console.log(data.data)
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
        <h1>Goods</h1>
      </div>
        <Button className="w-25" variant="primary" onClick={handleAddGood}>
          <MdPersonAddAlt/>
        </Button>
      {/* <GoodForm showForm={showForm} closeForm={handleCloseForm} selectedGood={selectedGood} /> */}
  
      <div className="card animated fadeInDown">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              {/* Goods headers goes here */}
              <th>Title</th>
              <th>Category</th>
              <th>Place</th>
              <th>Unit</th>
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
              {goods.map(good => (
                <tr key={good.id}>
                  <td>{good.id}</td>
                  {/* 
                    Goods data goes here
                  */}
                  <td>{good.title}</td>
                  <td>{good.category?.title}</td>
                  <td>{good.place?.name }</td>
                  <td>{good.unit?.name}</td>
                  <td>{good.created_at.slice(0,10)}</td>
                  <td>{good.created_at.slice(11,19)}</td>  
                <td>
                   <button className="btn-edit" onClick={ev => handleEditClick(good)}><FiEdit2/></button>
                   <button className="btn-delete" onClick={ev => onDeleteClick(good)}><MdOutlinePersonRemove/></button>
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