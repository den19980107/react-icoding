import React, { Component } from 'react';
// 引入分頁
import ClassInfo from '../courses/classInfo';
import Unit from '../courses/unit';
import Assistant from '../courses/assistant';
import ClassMate from '../courses/classMate';
import ReviewTest from '../courses/reviewTest';
import StudySituation from '../courses/studySituation';
import VideoSituation from '../courses/videoSituation';
import Article from '../courses/article';
import QRcode from '../courses/qrcode';


import axios from 'axios';


import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
class classDashboard extends Component {
   constructor(props) {
      super(props)
      const { id } = props.match.params
      this.state = {
         classId: id,
         collapsed: false,
         units: [],
         selectedUnit: {},
         nowPanel: {
            pannelId: "classInfo",
            keyPath: []
         }
      }
   }

   componentDidMount() {
      axios.get(`/api/getUnit/${this.state.classId}`)
         .then((res) => {
            let units = res.data
            this.setState({ units: units })
         })
         .catch((error) => {
            console.log(error)
         })
   }

   onCollapse = collapsed => {
      this.setState({ collapsed });
   };

   changePanel = (e) => {
      this.setState({
         nowPanel: {
            pannelId: e.keyPath[e.keyPath.length - 1],
            keyPath: e.keyPath
         }
      })
   }

   getUnit = () => {
      let unitId = this.state.nowPanel.keyPath[0];
      for (let i = 0; i < this.state.units.length; i++) {
         let unit = this.state.units[i];
         if (unit._id == unitId) {
            return unit
         }
      }
   }

   render() {
      return (
         <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={this.state.collapsed} onCollapse={this.onCollapse}>
               <div className="logo" />
               <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={this.changePanel}>
                  <Menu.Item key="classInfo">
                     <Icon type="info-circle" />
                     <span>課程資訊</span>
                  </Menu.Item>
                  <SubMenu
                     key="unit"
                     title={
                        <span>
                           <Icon type="file" />
                           <span>單元列表</span>
                        </span>
                     }
                  >
                     {this.state.units.map(unit => (
                        <Menu.Item key={unit._id}>{unit.unitName}</Menu.Item>
                     ))}

                  </SubMenu>
                  <Menu.Item key="assistant">
                     <Icon type="user" />
                     <span>助教管理</span>
                  </Menu.Item>
                  <Menu.Item key="classMate">
                     <Icon type="team" />
                     <span>本班成員</span>
                  </Menu.Item>
                  <Menu.Item key="reviewTest">
                     <Icon type="file-done" />
                     <span>批閱測驗</span>
                  </Menu.Item>
                  <Menu.Item key="studySituation">
                     <Icon type="pie-chart" />
                     <span>學習狀況</span>
                  </Menu.Item>
                  <Menu.Item key="vidoeSituation">
                     <Icon type="bar-chart" />
                     <span>影片觀看情形</span>
                  </Menu.Item>
                  <Menu.Item key="article">
                     <Icon type="sound" />
                     <span>討論區</span>
                  </Menu.Item>
                  <Menu.Item key="qrcode">
                     <Icon type="qrcode" />
                     <span>QR CODE</span>
                  </Menu.Item>
               </Menu>
            </Sider>
            <Layout>
               {this.state.nowPanel.pannelId == "classInfo" &&
                  <ClassInfo id={this.state.classId}></ClassInfo>
               }
               {this.state.nowPanel.pannelId == "unit" &&
                  <Unit unit={this.getUnit()}></Unit>
               }
               {this.state.nowPanel.pannelId == "assistant" &&
                  <Assistant></Assistant>
               }
               {this.state.nowPanel.pannelId == "classMate" &&
                  <ClassMate classId={this.state.classId}></ClassMate>
               }
               {this.state.nowPanel.pannelId == "reviewTest" &&
                  <ReviewTest></ReviewTest>
               }
               {this.state.nowPanel.pannelId == "studySituation" &&
                  <StudySituation></StudySituation>
               }
               {this.state.nowPanel.pannelId == "vidoeSituation" &&
                  <VideoSituation></VideoSituation>
               }
               {this.state.nowPanel.pannelId == "article" &&
                  <Article></Article>
               }
               {this.state.nowPanel.pannelId == "qrcode" &&
                  <QRcode></QRcode>
               }
            </Layout>
         </Layout >
      );
   }
}

export default classDashboard;