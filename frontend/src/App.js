import {BrowserRouter, Route, Routes} from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import Crypto from "./pages/Crypto/Crypto";
import Blogs from "./pages/Blogs/Blogs";
import Submit from "./pages/Submit/Submit";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Logout from "./pages/Logout/Logout";

import styles from "./App.module.css";


function App() {
  return (
    <div className={styles.container}>
      <BrowserRouter>
        <div className={styles.layout}>
          <Navbar />
          <Routes>
          <Route path="/" exact element={<div className={styles.main}><Home/></div>}/>
          <Route path="crypto" exact element={<div className={styles.main}><Crypto/></div>}/>
          <Route path="blogs" exact element={<div className={styles.main}><Blogs/></div>}/>
          <Route path="submit" exact element={<div className={styles.main}><Submit/></div>}/>
          <Route path="login" exact element={<div className={styles.main}><Login/></div>}/>
          <Route path="register" exact element={<div className={styles.main}><Register/></div>}/>
          <Route path="logout" exact element={<div className={styles.main}><Logout/></div>}/>
          </Routes>
          <Footer/>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
