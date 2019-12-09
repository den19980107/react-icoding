import React, { Component } from 'react';
import { Layout, Card, Breadcrumb, Avatar, List, Collapse, Descriptions } from 'antd';
import Spacer from '../util/spacer';
import axios from 'axios';
const { Header, Content, Footer, Sider } = Layout;

const { Panel } = Collapse;

class classInfo extends Component {
   state = {
      classInfo: {},
      teacher: {}
   }
   componentDidMount() {
      const { id } = this.props
      this.getClassInfo(id)
   }

   getClassInfo = async (id) => {
      try {
         let res = await axios.get(`/api/getClass/${id}`)
         let classInfo = res.data
         if (!classInfo.classImage) {
            classInfo.classImage = "/img/NoImage.png"
         } else {
            classInfo.classImage = "/class/image/" + classInfo.classImage
         }
         this.setState({ classInfo });
         this.getTeacherInfo(classInfo.teacher);
      } catch (error) {
         console.log(error.response.data.message)
      }
   }

   getTeacherInfo = async (id) => {
      try {
         let res = await axios.get(`/api/getUser/${id}`);
         let teacher = res.data;
         this.setState({ teacher: teacher });
      } catch (error) {
         console.log(error.response.data.message)
      }
   }

   render() {
      const { className, classImage, classRoom, classTime, credit, isLunch, outline } = this.state.classInfo
      const teacherName = this.state.teacher.name;
      const teacherEmail = this.state.teacher.email;
      const teacherInfo = this.state.teacher.userInfo

      return (
         <React.Fragment>
            <Header style={{ background: '#fff', padding: 0, display: "flex", justifyContent: "center", flexDirection: "column" }}>
               <h3 style={{ padding: "0", margin: "1rem" }}>{className}</h3>
            </Header>
            <Content style={{ margin: '0 16px' }}>
               <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>課程資訊</Breadcrumb.Item>
               </Breadcrumb>
               <div style={{ padding: 24, background: '#fff', minHeight: 360, display: "flex" }}>
                  <div style={{ width: "60%" }}>
                     <img style={{ width: "100%" }} src={classImage}></img>
                     <Spacer></Spacer>
                     <Collapse defaultActiveKey={['1']}>
                        <Panel header="課程說明" key="1">
                           <p>{outline}</p>
                        </Panel>
                     </Collapse>
                  </div>
                  <div style={{ width: "40%", padding: "0 1rem" }}>
                     <Card style={{ width: "100%" }}>
                        <div style={{ display: "flex" }}>
                           <div>
                              <Avatar shape="square" size={64} icon="user" />
                           </div>
                           <div style={{ display: "flex", flexDirection: "column", padding: "0 1rem" }}>
                              <div>教師名稱 : {teacherName}</div>
                              <Spacer></Spacer>
                              <div>Email : {teacherEmail}</div>
                              <Spacer></Spacer>
                              <div>自我介紹 : <br></br>{teacherInfo}</div>
                           </div>
                        </div>
                     </Card>
                     <Spacer></Spacer>
                     <List header={"上課時間"} bordered>
                        <List.Item>{classTime != "" ? classTime : "未設定上課時間"}</List.Item>
                     </List>
                     <Spacer></Spacer>
                     <List header={"上課地點"} bordered>
                        <List.Item>{classRoom != "" ? classRoom : "未設定上課地點"}</List.Item>
                     </List>
                     <Spacer></Spacer>
                     <List header={"學分數"} bordered>
                        <List.Item>{credit != "" ? credit : "未設定學分數"}</List.Item>
                     </List>
                  </div>
               </div>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>

         </React.Fragment>
      );
   }
}

export default classInfo;