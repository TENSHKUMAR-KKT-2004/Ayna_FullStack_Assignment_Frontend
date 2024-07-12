import React, { useEffect, useState } from 'react'
import './Auth.css'
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { storeUser } from "../../helper"

export default function Auth() {
  const [isLoginForm, setIsLoginForm] = useState(true);
  useEffect(() => {
    const loginButton = document.querySelector('.switcher-login');
    const signupButton = document.querySelector('.switcher-signup');

    loginButton.addEventListener('click', () => setIsLoginForm(true));
    signupButton.addEventListener('click', () => setIsLoginForm(false));

    return () => {
      loginButton.removeEventListener('click', () => setIsLoginForm(true));
      signupButton.removeEventListener('click', () => setIsLoginForm(false));
    };
  }, []);

  // login funtionality
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const url = `https://genuine-confidence-10f0398c7f.strapiapp.com/api/auth/local`
    try {
      if (email && password) {
        const { data } = await axios.post(url, {
          password: password, identifier: email
        })
        if (data.jwt) {
          storeUser(data)
          toast.success("Logged in successfully!", {
            hideProgressBar: true,
          })
          setEmail('')
          setPassword('')
          navigate("/chat")
        }
      }
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }

  // registeration funtionality
  const [reg_email, setreg_Email] = useState('')
  const [reg_password, setreg_Password] = useState('')
  const [userName, setuserName] = useState('')

  const signUp = async (e) => {
    e.preventDefault()

    try {
      const url = `https://genuine-confidence-10f0398c7f.strapiapp.com/api/auth/local/register`
      if (userName && reg_email && reg_password) {
        const res = await axios.post(url, {
          email: reg_email, password: reg_password, username: userName
        })
        if (!!res) {
          toast.success("Registered successfully!", {
            hideProgressBar: true,
          })
          toast.success("Now you can login to our EchoChat!", {
            hideProgressBar: true,
          })
          setreg_Email('')
          setreg_Password('')
          setuserName('')
          navigate("/auth")
        }
      }
    } catch (error) {
      toast.error(error.message, {
        hideProgressBar: true,
      })
    }
  }

  return (
    <section className="forms-section">
      <h1 className="section-title">Welcome to EchoChat</h1>
      <div className="switcher-container">
        <button style={{paddingRight:'5%'}} type="button" className="switcher switcher-login">
          Login
          <span className="underline"></span>
        </button>

        <button type="button" className="switcher switcher-signup">
          Sign Up
          <span className="underline"></span>
        </button>
      </div>
      <div className="forms">
        <div className={`form-wrapper ${isLoginForm ? 'is-active' : ''}`}>
          <form className="form form-login" onSubmit={handleLogin}>
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label htmlFor="login-email">E-mail</label>
                <input
                  id="login-email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password"
                  required
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-login">Login</button>
          </form>
        </div>
        <div className={`form-wrapper ${!isLoginForm ? 'is-active' : ''}`}>
          <form className="form form-signup" onSubmit={signUp}>
            <fieldset>
              <legend>Please, enter your email, password and password confirmation for sign up.</legend>
              <div className="input-block">
                <label htmlFor="signup-username">Username</label>
                <input
                  id="signup-username"
                  onChange={(e) => setuserName(e.target.value)}
                  value={userName}
                  type="text"
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-email">E-mail</label>
                <input
                  id="signup-email"
                  onChange={(e) => setreg_Email(e.target.value)}
                  value={reg_email}
                  type="email"
                  required
                />
              </div>
              <div className="input-block">
                <label htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  onChange={(e) => setreg_Password(e.target.value)}
                  value={reg_password}
                  type="password"
                  required
                />
              </div>
            </fieldset>
            <button type="submit" className="btn-signup">Continue</button>
          </form>
        </div>
      </div>
    </section>

  )
}
