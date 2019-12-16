import React, { Component } from 'react';
import { Comment, Avatar, Form, Button, List, Input, Modal } from 'antd';
import moment from 'moment';

// redux
import { connect } from 'react-redux'
import { getUser } from '../../actions/authorizeActions';

import axios from 'axios';

const { TextArea } = Input;

const CommentList = ({ comments, user, deleteComment }) => (
   <List
      dataSource={comments}
      header={`${comments.length} 則留言`}
      itemLayout="horizontal"
      renderItem={props =>
         <List.Item
            actions={(props.authorId == user._id) ? [<a key="list-loadmore-edit" onClick={(e) => deleteComment(props.id)}>刪除</a>] : ""}
         >
            <Comment
               style={{ width: "100%" }}
               author={props.author}
               content={props.content}
               datetime={props.datetime}
               avatar={<Avatar icon="user" />}
            />
         </List.Item>
      }
   />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
   <div>
      <Form.Item>
         <TextArea rows={2} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
         <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            新增留言
      </Button>
      </Form.Item>
   </div>
);
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
   handleSubmit = async () => {
      if (!this.state.commentValue) {
         return;
      }

      this.setState({
         submitting: true,
      });
      await axios.get(`/SDC/user/${this.props.user._id}/comment/chapter/${this.state.chapter._id}/body/${this.state.commentValue}`)

      this.setState({
         submitting: false,
         commentValue: '',
         comments: [
            {
               author: this.props.user.username,
               avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
               content: <p>{this.state.commentValue}</p>,
               datetime: moment().fromNow(),
            },
            ...this.state.comments,
         ],
      });
   };

   handleChange = e => {
      this.setState({
         commentValue: e.target.value,
      });
   };

   deleteComment = (id) => {
      axios.get(`/SDC/deleteChapterComment/${this.props.id}/${id}`)
         .then((res) => {
            Modal.success({
               content: '刪除成功！',
            });
            this.reflashChapter()
         })
         .catch((error) => {
            Modal.error({
               title: '刪除失敗！',
               content: '系統發生問題...',
            });
         })
   }

   render() {
      const { comments, submitting, commentValue } = this.state;
      return (
         <div className="container mt-2">
            <h3 className="pt-4 pb-4">{this.state.chapter.chapterName}</h3>
            <div dangerouslySetInnerHTML={{ __html: this.state.chapter.body }}></div>
            <hr></hr>
            <Comment
               avatar={
                  <Avatar
                     icon="user"
                  />
               }
               content={
                  <Editor
                     onChange={this.handleChange}
                     onSubmit={this.handleSubmit}
                     submitting={submitting}
                     value={commentValue}
                  />
               }
            />
            {comments.length > 0 && <CommentList user={this.props.user} deleteComment={this.deleteComment} comments={comments} />}

         </div>
      );
   }
}

const mapStateToProps = state => ({
   user: state.authorize.user
})

export default connect(mapStateToProps, { getUser })(chapter);