import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class header extends Component {
   render() {
      return (
         <div>
            <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
               <Navbar.Brand href="/">
                  <img src="/img/logo.png" alt="logo" style={{ height: "2rem" }}></img>
               </Navbar.Brand>
               <Navbar.Toggle aria-controls="responsive-navbar-nav" />
               <Navbar.Collapse id="responsive-navbar-nav">
                  <Nav className="mr-auto">
                     <Link className="nav-link" to="/">首頁</Link>
                     {this.props.isLogin ? (
                        <React.Fragment>
                           <Link className="nav-link" to="/classes">總開課清單</Link>
                           <Link className="nav-link" to="/coding">程式練習區</Link>
                           <Link className="nav-link" to="/createNewClass">建立課程</Link>
                           <Link className="nav-link" to="/logout">登出</Link>
                        </React.Fragment>
                     ) : (
                           <div className="nav navbar-nav navbar-right">
                              <Link className="nav-link" to="/login">登入</Link>
                              <Link className="nav-link" to="/register">註冊</Link>
                           </div>
                        )}
                  </Nav>
               </Navbar.Collapse>
            </Navbar>
         </div>
      );
   }
}



export default header;