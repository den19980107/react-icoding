import React, { Component } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';

//引入 component
import ChapterList from './material/chapterList';
import VideoList from './material/videoList';
import TestList from './material/testList';


const { TabPane } = Tabs;

class unit extends Component {

   constructor(props) {
      super(props);
      this.getData(this.props.unit._id)
      this.state = this.getData(this.props.unit._id)
   }


   componentWillReceiveProps(nextProps) {
      if (nextProps.unit._id !== this.state.id) {
         this.getData(nextProps.unit._id)
      }
   }
   async getData(id) {
      let videoRes = await axios.get(`/api/getVideo/${id}`)
      let videos = videoRes.data
      let chapterRes = await axios.get(`/api/getChapterInUnit/${id}`)
      let chapters = chapterRes.data
      let testRes = await axios.get(`/api/getTestInUnit/${id}`)
      let tests = testRes.data
      this.setState({
         videos,
         chapters,
         tests,
         id
      })
   }

   changeTab = (e) => {
   }

   render() {
      return (
         <div style={{ padding: "1rem" }}>
            <h3>{this.props.unit.unitName}</h3>
            <Tabs onChange={this.changeTab} type="card">
               <TabPane tab="講義" key="1">
                  <ChapterList chapters={this.state.chapters}></ChapterList>
               </TabPane>
               <TabPane tab="影片" key="2">
                  <VideoList videos={this.state.videos}></VideoList>
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