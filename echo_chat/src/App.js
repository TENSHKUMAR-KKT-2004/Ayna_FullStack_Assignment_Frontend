import { BrowserRouter as Router,Navigate, Routes, Route } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { Container } from "reactstrap"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css'
import { userData,Protector } from "./helper"
import 'bootstrap/dist/css/bootstrap.min.css'

// pages
import Auth from './pages/AuthPage/Auth'
import Chat from './pages/Chat/Chat'
import Logout from "./components/Logout"

// apollo connection
import client from './ApolloConnect'

function App() {
  const {uid} = userData()
  return (
    <Container>
      <Router>
        <ApolloProvider client={client}>
          <div className="App">
            <Routes>
              <Route path="/" element={uid ? <Navigate to='/chat' /> : <Navigate to='/auth' /> } />
              <Route path='/auth' element={<Auth />}></Route>
              <Route path="/chat" element={<Protector Component={Chat} />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
            <ToastContainer />
          </div>
        </ApolloProvider>
      </Router>
    </Container>
  )
}

export default App
