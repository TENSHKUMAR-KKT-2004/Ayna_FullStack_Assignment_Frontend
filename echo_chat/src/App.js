import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from "reactstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
// import { Protector } from "./helper";
import 'bootstrap/dist/css/bootstrap.min.css';

// pages
import Auth from './pages/AuthPage/Auth';
import Chat from './pages/Chat/Chat';
import Logout from "./components/Logout";

function App() {
  return (
    <Container>
      <Router>
        <div className="App">
          <Routes>
            {/* <Route exact path="/" element={<Protector Component={Homepage} />} /> */}
            <Route path='/auth' element={<Auth />}></Route>
            <Route path='/chat' element={<Chat />}></Route>

            <Route path="/logout" element={<Logout />} />
          </Routes>
        <ToastContainer />
        </div>
      </Router>
    </Container>
  );
}

export default App;
