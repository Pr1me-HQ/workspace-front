import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function CategoryForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [category, setCategory] = useState({
    id: null,
    title: '',
    parent_id: 0,
    description: '',
    icon_url: null
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const {setNotification} = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient.get(`/categories/${id}`)
        .then(({data}) => {
          setLoading(false);
          setCategory(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = ev => {
    ev.preventDefault();
    if (category.id) {
      axiosClient.put(`/categories/${category.id}`, category)
        .then(() => {
          setNotification('Category was successfully updated');
          navigate('/categories');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient.post('/categories', category)
        .then(() => {
          setNotification('Category was successfully created');
          navigate('/categories');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <div className="form">
      {category.id && <h1>Update Category: {category.title}</h1>}
      {!category.id && <h1>Add new category</h1>}

      <div className="card animated fadeInDown">
        {loading && (
          <div className="text-center">
            Loading...
          </div>
        )}
        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }
        {!loading && (
          <form onSubmit={onSubmit}>
            <input value={category.title} onChange={ev => setCategory({...category, title: ev.target.value})} placeholder="Title"/>
            <input value={category.parent_id} onChange={ev => setCategory({...category, parent_id: ev.target            .value})} placeholder="Parent ID"/>
            <input value={category.description} onChange={ev => setCategory({...category, description: ev.target.value})} placeholder="Description"/>
            <input value={category.icon_url} onChange={ev => setCategory({...category, icon_url: ev.target.value})} placeholder="Icon URL"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </div>
  )
}

