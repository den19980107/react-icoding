import React, { Component } from 'react';
import { Card, Input, Button } from 'antd';
import { Form } from 'react-bootstrap'
class profile extends Component {
   state = {
      name: "",
      email: "",
      username: "",
      schoolname: "",
      department: "",
      studentid: ""
   }
   componentDidMount() {
      const { name, email, username, schoolname, department, studentid } = this.props.user
      this.setState({
         name,
         email,
         username,
         schoolname,
         department,
         studentid
      })
   }

   render() {
      return (
         <div className="container mt-4" style={{ display: "flex", justifyContent: "space-between" }}>
            <Card style={{ width: "60%" }}>
               <h3>個人資料</h3>
               <Form.Group>
                  <Form.Label>姓名</Form.Label>
                  <Form.Control placeholder="請輸入姓名" onChange={(e) => this.setState({ name: e.target.value })} value={this.state.name} />
               </Form.Group>
               <Form.Group>
                  <Form.Label>信箱</Form.Label>
                  <Form.Control placeholder="請輸入信箱" onChange={(e) => this.setState({ email: e.target.value })} value={this.state.email} />
               </Form.Group>
               <Form.Group>
                  <Form.Label>帳號</Form.Label>
                  <Form.Control placeholder="請輸入帳號" value={this.state.username} disabled />
               </Form.Group>
               <Form.Group>
                  <Form.Label>學校</Form.Label>
                  <Form.Control placeholder="請輸入學校" onChange={(e) => this.setState({ schoolname: e.target.value })} value={this.state.schoolname} />
               </Form.Group>
               <Form.Group>
                  <Form.Label>科系</Form.Label>
                  <Form.Control placeholder="請輸入科系" onChange={(e) => this.setState({ department: e.target.value })} value={this.state.department} />
               </Form.Group>
               <Form.Group>
                  <Form.Label>學號</Form.Label>
                  <Form.Control placeholder="請輸入學號" onChange={(e) => this.setState({ studentid: e.target.value })} value={this.state.studentid} />
               </Form.Group>
            </Card>
            <Card style={{ width: "35%" }}>
               <p>Card content</p>
               <p>Card content</p>
               <p>登入紀錄</p>
            </Card>
         </div>
      );
   }
}

export default profile;