import React, { Component } from 'react';
import { Col, Card } from 'antd';
import YouTube from 'react-youtube';

class videoListItem extends Component {
   render() {
      const opts = {
         height: '150',
         width: '100%',
         playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0
         }
      };
      return (
         <Col span={8} style={{ marginBottom: "1rem" }}>
            <Card title={this.props.video.videoName} bordered={false}>
               <YouTube
                  videoId={this.props.video.videoURL}
                  opts={opts}
               />
            </Card>
         </Col>
      );
   }
}

export default videoListItem;