import React, { useEffect, useState } from 'react'
import './Auth.css'
import axios from "axios"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { storeUser } from "../../helper"

export default function Auth() {

  useEffect(() => {
    const switchers = [...document.querySelectorAll('.switcher')]

    switchers.forEach(item => {
      item.addEventListener('click', function () {
        switchers.forEach(item => item.parentElement.classList.remove('is-active'))
        this.parentElement.classList.add('is-active')
      })
    })

    return () => {
      switchers.forEach(item => {
        item.removeEventListener('click', function () {
          switchers.forEach(item => item.parentElement.classList.remove('is-active'))
          this.parentElement.classList.add('is-active')
        })
      })
    }
  }, [])

  // login funtionality
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const url = `http://localhost:1337/api/auth/local`
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
          console.log(data)
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
      const url = `http://localhost:1337/api/auth/local/register`
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
      <div className="forms">
        <div className="form-wrapper is-active">
          <button type="button" className="switcher switcher-login">
            Login
            <span className="underline"></span>
          </button>
          <form className="form form-login">
            <fieldset>
              <legend>Please, enter your email and password for login.</legend>
              <div className="input-block">
                <label for="login-email">E-mail</label>
                <input id="login-email"
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email" required />
              </div>
              <div className="input-block">
                <label for="login-password">Password</label>
                <input id="login-password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  type="password" required />
              </div>
            </fieldset>
            <button type="submit" onClick={handleLogin} className="btn-login">Login</button>
          </form>
        </div>
        <div className="form-wrapper">
          <button type="button" className="switcher switcher-signup">
            Sign Up
            <span className="underline"></span>
          </button>
          <form className="form form-signup">
            <fieldset>
              <legend>Please, enter your email, password and password confirmation for sign up.</legend>
              <div className="input-block">
                <label for="signup-username">Username</label>
                <input id="signup-username"
                  onChange={(e) => setuserName(e.target.value)}
                  value={userName}

                  type="text" required />
              </div>
              <div className="input-block">
                <label for="signup-email">E-mail</label>
                <input id="signup-email"
                  onChange={(e) => setreg_Email(e.target.value)}
                  value={reg_email}

                  type="email" required />
              </div>
              <div className="input-block">
                <label for="signup-password">Password</label>
                <input id="signup-password"
                  onChange={(e) => setreg_Password(e.target.value)}
                  value={reg_password}

                  type="password" required />
              </div>
            </fieldset>
            <button type="submit" onClick={signUp} className="btn-signup">Continue</button>
          </form>
        </div>
      </div>
    </section>
  )
}
