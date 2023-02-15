import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {Link} from "react-router-dom";
import {useStateContext} from "../context/ContextProvider.jsx";
import loading_icon from "../assets/icons/loading.svg";
import { CategoryForm } from './CategoryChilds.jsx' // Add this line

export default function Categories() {
  // Add state variables to track the modal's visibility and the selected category
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({});
  
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext()

  useEffect(() => {
    getCategories();
  }, [])

  const onDeleteClick = category => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return
    }
    axiosClient.delete(`/categories/${category.id}`)
      .then(() => {
        setNotification('Category was successfully deleted')
        getCategories()
      })
  }

  // Add a function to handle the "Edit" button click
  const onEditClick = category => {
    setSelectedCategory(category);
    setShowModal(true);
  }

  // Add a function to handle the "Add new" button click
  const onAddClick = () => {
    setSelectedCategory({});
    setShowModal(true);
  }

  const getCategories = () => {
    setLoading(true)
    axiosClient.get('/categories')
    .then(({ data }) => {
      setLoading(false)
      setCategories(data.data)
      })
      .catch(() => {
        setLoading(false)
      })
  }


  return (
    <div className="content">
      <div style={{width:'90%', display: 'flex', justifyContent: "space-around", alignItems: "flex-end"}}>
      <h1>Categories</h1>
        <CategoryForm/>
      </div>

      <div className="card animated fadeInDown">
        <table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
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
            {categories.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.created_at.slice(0,10)}</td>
                <td>{c.created_at.slice(11,19)}</td>
                <td>
                  <Link className="btn-edit" to={'/categories/' + c.id}>Edit</Link>
                  &nbsp;
                  <button className="btn-delete" onClick={ev => onDeleteClick(u)}>Delete</button>
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
