import {Link} from "react-router-dom";
import {createRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../context/ContextProvider.jsx";
import { useTranslation } from 'react-i18next';

export default function Signup() {
  const { t } = useTranslation();
  const emailRef = createRef()
  const passwordRef = createRef()
  const passwordConfirmationRef = createRef()
  const {setUser, setToken} = useStateContext()
  const [errors, setErrors] = useState(null)

  const onSubmit = ev => {
    ev.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    axiosClient.post('/register', payload)
      .then(({data}) => {
        setUser(data.username)
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
          {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          }
          {/* <input ref={nameRef} type="text" placeholder="Full Name"/> */}
          <input ref={emailRef} type="email" placeholder={t('email')}/>
          <input ref={passwordRef} type="password" placeholder={t("password")}/>
          <input ref={passwordConfirmationRef} type="password" placeholder={t("password_confirm")}/>
          <button className="btn btn-block">{t("signup")}</button>
          <p className="message">{t("already_have_account")} <Link to="/login">{t("login")}</Link></p>
        </form>
      </div>
    </div>
  )
}
