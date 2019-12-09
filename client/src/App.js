import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import pages
import Index from './components/pages/index';
import Classes from './components/pages/classes';
import CreateNewClass from './components/pages/createNewClass';
import Coding from './components/pages/coding';
import Login from './components/pages/login';
import Register from './components/pages/register';
import ClassDashboard from './components/pages/classDashboard';
// components
import Header from './components/header/header';

class App extends Component {
  state = {
    user: null,
    isLogin: false
  }
  setUserData = (user) => {
    this.setState({ user: user, isLogin: true })
  }
  render() {
    if (this.state.isLogin) {
      return (
        <Router history={History}>
          <Header isLogin={this.state.isLogin}></Header>
          {/* 首頁 */}
          <Route exact path="/" component={Index}></Route>
          {/* 總開課清單 */}
          <Route path="/classes" component={Classes}></Route>
          {/* 程式練習區 */}
          <Route path="/coding" component={Coding}></Route>
          {/* 建立課程 */}
          <Route path="/createNewClass" component={CreateNewClass}></Route>
          {/* 登入 */}
          <Route path="/login" component={Login}></Route>
          {/* 註冊 */}
          <Route path="/register" component={Register}></Route>
          {/* 顯示課程首頁 */}
          <Route path="/class/:id" component={ClassDashboard}></Route>
        </Router >
      );
    } else {
      return (
        <Router>
          <Header isLogin={this.state.isLogin}></Header>
          <Route path="/" render={props => (
            <Login setUserData={this.setUserData}></Login>
          )}></Route>
        </Router >
      )
    }

  }
}

export default App;