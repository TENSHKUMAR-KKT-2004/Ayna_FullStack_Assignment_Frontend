import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { Container } from "reactstrap";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Protector } from "./helper";

// pages
import Auth from './pages/AuthPage/Auth';
import Logout from "./components/Logout";

function App() {
  return (
    <Container>
      <Router>
        <div className="App">
          <Routes>
            {/* <Route exact path="/" element={<Protector Component={Home} />} /> */}
            <Route path='/auth' element={<Auth />}></Route>
            <Route path="/logout" element={<Logout />} />
          </Routes>
        <ToastContainer />
        </div>
      </Router>
    </Container>
  );
}

export default App;
