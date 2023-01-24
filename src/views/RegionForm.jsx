import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";

export default function RegionForm() {
  const navigate = useNavigate();
  let {id} = useParams();
  const [region, setregion] = useState({
    id: null,
    // first_name: '',
    email: '',
    password: '',
    password_confirmation: ''
  })
  const [errors, setErrors] = useState(null)
  const [loading, setLoading] = useState(false)
  const {setNotification} = useStateContext()

  if (id) {
    useEffect(() => {
      setLoading(true)
      axiosClient.get(`/regions/${id}`)
        .then(({data}) => {
          setLoading(false)
          setregion(data)
        })
        .catch(() => {
          setLoading(false)
        })
    }, [])
  }

  const onSubmit = ev => {
    ev.preventDefault()
    if (region.id) {
      axiosClient.put(`/regions/${region.id}`, region)
        .then(() => {
          setNotification('region was successfully updated')
          navigate('/regions')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    } else {
      axiosClient.post('/regions', region)
        .then(() => {
          setNotification('region was successfully created')
          navigate('/regions')
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors)
          }
        })
    }
  }

  return (
    <>
      {region.id && <h1>Update region: {region.name}</h1>}
      {!region.id && <h1>New region</h1>}
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
            {/* <input value={region.name} onChange={ev => setregion({...region, name: ev.target.value})} placeholder="Name"/> */}
            <input value={region.email} onChange={ev => setregion({...region, email: ev.target.value})} placeholder="Email"/>
            <input type="password" onChange={ev => setregion({...region, password: ev.target.value})} placeholder="Password"/>
            <input type="password" onChange={ev => setregion({...region, password_confirmation: ev.target.value})} placeholder="Password Confirmation"/>
            <button className="btn">Save</button>
          </form>
        )}
      </div>
    </>
  )
}
