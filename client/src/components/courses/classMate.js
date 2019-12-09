import React, { Component } from 'react';
import axios from 'axios';
import { Table } from 'antd';
class classMate extends Component {
   state = {
      students: []
   }
   componentDidMount() {
      axios.get(`/api/getStudentInClass/${this.props.classId}`)
         .then((res) => {
            let students = res.data.users
            console.log(students)
            this.setState({ students: students })
            console.log(this.state.students)
         })
         .catch((error) => {
            console.log(error)
         })
   }
   render() {
      const columns = [
         {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
         },
         {
            title: '信箱',
            dataIndex: 'email',
            key: 'email',
         },
         {
            title: '學號',
            dataIndex: 'studentid',
            key: 'studentid',
         },
      ];
      return (
         <div style={{ padding: "1rem" }}>
            <h3>本班成員</h3>
            <Table dataSource={this.state.students} columns={columns} />;
         </div>
      );
   }
}

export default classMate;