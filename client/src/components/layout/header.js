import React, { Component } from 'react';
import { Navbar, Nav, NavItem, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// redux
import { connect } from 'react-redux'
import { getUser, logout } from '../../actions/authorizeActions';

class header extends Component {

   componentDidMount() {
      this.props.getUser()
   }

   logout = () => {
      this.props.setUserData(null, false)
      this.props.logout();
   }
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
                     {this.props.isLogin ? (
                        <React.Fragment>
                           <Link className="nav-link" to="/">首頁</Link>
                           <Link className="nav-link" to="/classes">總開課清單</Link>
                           <Link className="nav-link" to="/coding">程式練習區</Link>
                           <Link className="nav-link" to="/createNewClass">建立課程</Link>
                        </React.Fragment>
                     ) : (
                           <div className="nav navbar-nav navbar-right">
                              <Link className="nav-link" to="/login">登入</Link>
                              <Link className="nav-link" to="/register">註冊</Link>
                           </div>
                        )}
                  </Nav>
               </Navbar.Collapse>
               {this.props.isLogin &&
                  <Navbar.Collapse>
                     <Nav className="ml-auto">
                        {this.props.user.permission == "teacher" &&
                           <Link className="nav-link" to="/createNewClass">建立課程</Link>
                        }
                        <NavDropdown title={this.props.user.username} id="basic-nav-dropdown">
                           <Link className="dropdown-item" to="/profile">個人資料</Link>
                           <Link className="dropdown-item" to="/notes">我的筆記</Link>
                        </NavDropdown>
                        <Link className="nav-link" onClick={this.logout}>登出</Link>
                     </Nav>
                  </Navbar.Collapse>
               }
            </Navbar>
         </div>
      );
   }
}


const mapStateToProps = state => ({
   user: state.authorize.user
})

export default connect(mapStateToProps, { getUser, logout })(header);