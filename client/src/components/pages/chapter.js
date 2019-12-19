import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios';
import { Button, Icon } from 'antd';

// redux
import { connect } from 'react-redux'
import { getUser } from '../../actions/authorizeActions';

// component
import Comments from '../util/comments'



class chapter extends Component {
   constructor(props) {
      super(props)
      const { id } = props.match.params
      this.state = {
         id: id,
         chapter: {
            body: ""
         },
         classinfo: {},
         commentUsers: [],
         comments: [],
         submitting: false,
         commentValue: '',
      }
   }

   componentDidMount() {
      this.props.getUser()
      this.reflashChapter()
   }

   reflashChapter = async () => {
      console.log("reflashChapter")
      let res = await axios.get(`/class/getChapter/${this.state.id}`)
      this.setState({
         chapter: res.data.chapter,
         classinfo: res.data.classinfo,
         commentUsers: res.data.users
      })
      let comments = []
      res.data.comments.forEach(comment => {
         comments.push({
            id: comment._id,
            authorId: comment.userID,
            author: comment.userName,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            content: comment.body,
            datetime: comment.commentTime,
         })
      });
      this.setState({ comments: comments })
   }




   editChapter = () => {
      this.props.history.push(`/editChapter/${this.state.id}`)
   }

   render() {
      const { comments, submitting, commentValue } = this.state;
      return (
         <div className="container mt-2">
            <div style={{ display: "flex", justifyContent: "space-between" }} className="pt-4 pb-4">
               <h3>{this.state.chapter.chapterName}</h3>
               {this.props.user._id == this.state.classinfo.teacher &&
                  <Button type="info" style={{ background: "#ccc" }} onClick={this.editChapter}><Icon type="edit" />編輯講義</Button>
               }
            </div>
            <div dangerouslySetInnerHTML={{ __html: this.state.chapter.body }}></div>
            <hr></hr>
            <Comments
               thisUser={this.props.user}
               comments={this.state.comments}
               addPath={`/SDC/user/${this.props.user._id}/comment/chapter/${this.state.id}`}
               deletePath={`/SDC/deleteChapterComment/${this.state.id}/`}
               onRefresh={this.reflashChapter}
            ></Comments>
         </div>
      );
   }
}

const mapStateToProps = state => ({
   user: state.authorize.user
})

export default connect(mapStateToProps, { getUser })(withRouter(chapter));