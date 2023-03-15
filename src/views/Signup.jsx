import { Link } from "react-router-dom";
import { createRef, useState } from "react";
import { useStateContext } from "../context/ContextProvider.jsx";
import { useTranslation } from 'react-i18next';
import axiosClient from '../axios-client.js'


export default function Signup() {
  const { t } = useTranslation();
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()
  const [errors, setErrors] = useState(null)
  
  const { setNotification } = useStateContext()
  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }

    // make axios request
    axiosClient.post('/register', payload)
      .then(res => {
        setNotification({ type: 'success', message: res.data.message })
        window.location.href = '/login'
      }
      )
      .catch(err => {
        setErrors(err.response.data.errors)
      }
      )   
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">{t("signup")}</h1>

          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }

          <input ref={emailRef} type="email" placeholder={t('email')} required={true}/>
          <input ref={passwordRef} type="password" placeholder={t("password")} required={true}/>
          <input ref={passwordConfirmationRef} type="password" placeholder={t("password_confirm")} required={true}/>
          <button className="btn btn-block">{t("signup")}</button>
          <p className="message">{t("already_have_account")} <Link to="/login">{t("login")}</Link></p>
        </form>
      </div>
    </div>
  )
}
