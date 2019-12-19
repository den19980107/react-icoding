import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Card, Dropdown, Menu, Icon, Modal } from 'antd';
import YouTube from 'react-youtube';
import Player from '../../player/player';
import axios from 'axios';

const { Meta } = Card;
class videoListItem extends Component {

   state = {
      id: this.props.video._id,
      reNameModalVisible: false,
      reNamedVideoName: "",
   }


   showConfrimModal = () => {
      let res = Modal.confirm({
         title: '警告',
         content: `確認要刪除"${this.props.video.videoName}"影片嗎？`,
         okText: '確認',
         okType: 'danger',
         cancelText: '取消',
         onOk: this.deleteVideo
      });
   }

   deleteVideo = () => {
      console.log("delete")
      axios.post('/api/deleteVideo/' + this.state.id)
         .then((res) => {
            this.props.reflashVideos()
         })
         .catch((error) => {
            console.log(error)
            Modal.error({
               content: "刪除失敗！",
               okText: '確認'
            });
         })
   }

   showVideo = (e) => {
      console.log(e)
      this.props.history.push(`/video/${this.state.id}`)
   }
   render() {
      const opts = {
         height: '150',
         width: '100%',
         playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 0
         }
      };
      return (
         <Card
            bordered={false}
            cover={
               <div onClick={this.showVideo}>
                  <Player
                     showThumbnail={true}
                     id={this.props.video._id}
                  />
               </div>
            }
            style={{ width: "16rem", height: "13rem" }}
            bodyStyle={{ padding: "1rem" }}
         >
            <div style={{ display: "flex", justifyContent: "space-between", textAlign: "center", lineHeight: "2rem" }}>
               <p style={{ margin: "0" }}>{this.props.video.videoName}</p>
               <Dropdown overlay={
                  <Menu>
                     <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" onClick={this.showRenameVideoModal}>
                           重新命名
                     </a>
                     </Menu.Item>
                     <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" onClick={this.showConfrimModal}>
                           刪除
                     </a>
                     </Menu.Item>
                  </Menu>
               }>
                  <Icon type="more" style={{ padding: "0.5rem", fontSize: "16px" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
               </Dropdown>
            </div>
         </Card>
      );
   }
}

export default withRouter(videoListItem);