import React, { Component } from 'react';
import { connect } from 'react-redux';
import { login } from '../../actions/authorizeActions';

import { Input, Card, Button } from 'antd';
import Spacer from '../util/spacer';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class Login extends Component {
   state = {
      username: "",
      password: ""
   }

   // 當跟 reducer 執行完 login 之後 現在這個 component 的 porps.user 會變動
   // 當有變動時 表時 login 完成 所以把 user 的 data 往上傳到 app component
   componentWillReceiveProps(nextProps) {
      if (nextProps.error || !nextProps.user) {
         alert(nextProps.error)
      } else {
         this.props.setUserData(nextProps.user)
      }
   }

   setUsername = (e) => {
      this.setState({ username: e.target.value })
   }
   setPassword = (e) => {
      this.setState({ password: e.target.value })
   }
   onLogin = () => {
      this.props.login(this.state);
   }

   render() {
      return (
         <div style={{ marginTop: "3rem" }}>
            <div style={{ display: "flex", justifyContent: "center" }}>
               <Card type="inner" title={<h4>登入</h4>} bordered={true} style={{ width: 500 }}>
                  <p style={{ margin: "0" }}>帳號：</p>
                  <Input placeholder="請輸入帳號" onChange={this.setUsername} />
                  <Spacer></Spacer>
                  <p style={{ margin: "0" }}>密碼：</p>
                  <Input.Password placeholder="請輸入密碼" onChange={this.setPassword} />
                  <Spacer></Spacer>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                     <Button type="primary" onClick={this.onLogin}>登入</Button>
                  </div>
               </Card>
            </div>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   user: state.authorize.user,
   error: state.authorize.error
})

export default connect(mapStateToProps, { login })(withRouter(Login));