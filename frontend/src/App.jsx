import { Login } from "./components/login/Login";
import { Register } from "./components/register/Register";
import { PageNotFound } from "./components/pagenotfound/PageNotFound";
import { UploadPdf } from "./components/uploadPdf/UploadPdf.jsx";
import {BrowserRouter,Routes,Route} from "react-router-dom";
import './App.css';
 
function App() {

  return (
    <BrowserRouter basename="/">
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/uploadPdf" element={<UploadPdf/>}></Route>
        <Route path="*" element={<PageNotFound/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
