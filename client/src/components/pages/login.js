import React, { Component } from 'react';
import { Input, Card, Button } from 'antd';
import Spacer from '../util/spacer';
import axios from 'axios';
import { withRouter } from "react-router-dom";

class login extends Component {
   state = {
      username: "",
      password: ""
   }
   setUsername = (e) => {
      this.setState({ username: e.target.value })
   }
   setPassword = (e) => {
      this.setState({ password: e.target.value })
   }
   onLogin = () => {
      axios.post('/users/login', {
         username: this.state.username,
         password: this.state.password
      })
         .then((res) => {
            let user = res.data.user
            this.props.setUserData(user)
            this.props.history.push("/");
         })
         .catch((error) => {
            console.log(error.response.data.message)
         })
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

export default withRouter(login);