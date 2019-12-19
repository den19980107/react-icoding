import React, { Component } from 'react';
import VideoListItem from './videoListItem';
import { Row } from 'antd';
class videoList extends Component {
   constructor(props) {
      super(props)
      this.state = {
         videos: this.props.videos
      }
   }

   render() {
      if (this.props.videos.length) {
         return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start" }}>
               {this.props.videos.map(video => (
                  <VideoListItem key={video._id} video={video} reflashVideos={this.props.reflashVideos}></VideoListItem>
               ))}
            </div>
         );
      } else {
         return (
            <div>沒有資料</div>
         )
      }
   }
}

export default videoList;