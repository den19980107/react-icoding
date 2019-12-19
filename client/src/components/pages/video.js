import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Button, Icon } from 'antd'
import axios from 'axios'

// redux
import { connect } from 'react-redux'
import { getUser } from '../../actions/authorizeActions';

// component
import Player from '../player/player';
import Youtube from 'react-youtube';
import Comment from '../util/comments';

class video extends Component {
   constructor(props) {
      super(props)
      const { id } = props.match.params
      this.state = {
         id: id,
         video: {},
         comments: [],
         classinfo: {},
         notes: [],
         recommandVideo: [],
         users: []
      }
   }

   componentDidMount() {
      this.props.getUser()
      this.refresh()
   }

   refresh = () => {
      axios.get(`/class/getVideo/${this.state.id}`)
         .then(res => {
            let data = res.data;
            console.log(data)
            let comments = []
            data.comments.forEach(comment => {
               comments.push({
                  id: comment._id,
                  authorId: comment.userID,
                  author: comment.userName,
                  avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                  content: comment.body,
                  datetime: comment.commentTime,
               })
            });
            this.setState({
               video: data.video,
               classinfo: data.classinfo,
               notes: data.notes,
               recommandVideo: data.recommandVideo,
               users: data.users,
               comments: comments
            })
         }).catch(err => {
            console.log(err)
         })
   }

   render() {
      return (
         <div className="container mt-2">
            <div style={{ display: "flex", justifyContent: "space-between" }} className="pt-4 pb-4">
               <h3>{this.state.video.videoName}</h3>
               {this.props.user._id == this.state.classinfo.teacher &&
                  <Button type="info" style={{ background: "#ccc" }} onClick={this.editVideo}><Icon type="edit" />編輯影片</Button>
               }
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
               <div style={{ width: "800px", height: "450px", background: "#333" }}>
                  <Player
                     id={this.state.id}
                  ></Player>
               </div>
            </div>
            <hr></hr>
            <Comment
               thisUser={this.props.user}
               comments={this.state.comments}
               addPath={`/SDC/user/${this.props.user._id}/comment/video/${this.state.id}`}
               deletePath={`/SDC/deleteVideoComment/${this.state.id}/`}
               onRefresh={this.refresh}
            ></Comment>
         </div>
      );
   }
}
const mapStateToProps = state => ({
   user: state.authorize.user
})
export default connect(mapStateToProps, { getUser })(withRouter(video));