import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

// pages
import Auth from './pages/AuthPage/Auth';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/auth' element={<Auth />}></Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
