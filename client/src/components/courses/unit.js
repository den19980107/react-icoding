import React, { Component } from 'react';
import { Tabs, Button, Modal } from 'antd';
import axios from 'axios';

//引入 component
import ChapterList from './material/chapterList';
import VideoList from './material/videoList';
import TestList from './material/testList';
import UploadVideo from './unit_component/uploadVideo';
import UploadChapter from './unit_component/uploadChapter';
import UploadTest from './unit_component/uploadTest';

const { TabPane } = Tabs;

class unit extends Component {

   constructor(props) {
      super(props);
      this.state = {
         videos: "",
         chapters: "",
         tests: "",
         id: props.unit._id,
         tabName: "講義",
         tabId: "1",
         uploadBtn: ""
      }
   }

   componentDidMount() {
      // 設定初始的新增按鈕
      this.setState({ uploadBtn: <UploadChapter unitId={this.state.id} reflashChapter={this.reflashChapter}></UploadChapter> })
      this.getData(this.props.unit._id)
   }

   componentWillReceiveProps(nextProps) {
      if (nextProps.unit._id !== this.state.id) {
         console.log("change unit")
         this.getData(nextProps.unit._id)
         this.setState({ id: nextProps.unit._id })
      }
   }
   getData = async (id) => {
      let videoRes = await axios.get(`/api/getVideo/${id}`)
      let videos = videoRes.data
      let chapterRes = await axios.get(`/api/getChapterInUnit/${id}`)
      let chapters = chapterRes.data
      let testRes = await axios.get(`/api/getTestInUnit/${id}`)
      let tests = testRes.data
      this.setState({
         videos,
         chapters,
         tests
      })
   }

   reflashChapter = async () => {
      console.log("reflashChapter")
      console.log(this.state)
      let chapterRes = await axios.get(`/api/getChapterInUnit/${this.state.id}`)
      let chapters = chapterRes.data
      console.log(chapters)
      this.setState({ chapters })
   }

   reflashVideos = async () => {
      console.log("reflashVideos")
      let videoRes = await axios.get(`/api/getVideo/${this.state.id}`)
      let videos = videoRes.data
      this.setState({ videos })
   }

   reflashTest = async () => {
      console.log("reflashTest")
      let testRes = await axios.get(`/api/getTestInUnit/${this.state.id}`)
      let tests = testRes.data
      this.setState({ tests })
   }


   changeTab = (e) => {
      let tabName = "講義"
      // 取得現在要新增的是影片、教材、還是影片的按鈕
      let uploadBtn;
      switch (e) {
         case "1":
            tabName = "講義"
            uploadBtn = <UploadChapter unitId={this.state.id} reflashChapter={this.reflashChapter}></UploadChapter>
            break;
         case "2":
            tabName = "影片"
            uploadBtn = <UploadVideo unitId={this.state.id} reflashVideos={this.reflashVideos}></UploadVideo>
            break;
         case "3":
            tabName = "測驗"
            uploadBtn = <UploadTest></UploadTest>
            break;
      }
      console.log(e, tabName)
      this.setState({
         tabName,
         tabId: e,
         uploadBtn
      })
   }


   render() {
      return (
         <div style={{ padding: "1rem" }}>
            <h3>{this.props.unit.unitName}</h3>
            <Tabs onChange={this.changeTab} type="card" tabBarExtraContent={this.state.uploadBtn}>
               <TabPane tab="講義" key="1">
                  <ChapterList chapters={this.state.chapters} reflashChapter={this.reflashChapter}></ChapterList>
               </TabPane>
               <TabPane tab="影片" key="2">
                  <VideoList videos={this.state.videos} reflashVideos={this.reflashVideos}></VideoList>
               </TabPane>
               <TabPane tab="測驗" key="3">
                  <TestList tests={this.state.tests}></TestList>
               </TabPane>
            </Tabs>
         </div>
      );
   }
}


export default unit;