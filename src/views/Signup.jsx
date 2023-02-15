import {Link} from "react-router-dom";
import {createRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useTranslation } from 'react-i18next';
import { notification } from "antd";

export default function Signup() {
  const { t } = useTranslation();
  const first_nameRef = createRef()
  // const last_nameRef = createRef()
  // const middle_nameRef = createRef()
  // const phone_numberRef = createRef()
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()
  const [errors, setErrors] = useState(null)

        // set notification message after registration
  const { setNotification } = useStateContext()
  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      first_name: first_nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    axiosClient.post('/register', payload)
      .then(({data}) => {
        setNotification({ 
          type: 'success',
          message: 'Вы успешно зарегистрировались'
        })
        setToken(data.token);
      })
      .catch(err => {
        const response = err.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors)
        }
      })
  }

  return (

    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">{t("signup")}</h1>
          {notification && 
            <div className="alert">
              <p>{notification.message}</p>
            </div>
          }

          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }
          <input ref={first_nameRef} type="text" placeholder="Имя"/>
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
