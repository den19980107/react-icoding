import React, { Component } from 'react';
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
import moment from 'moment';

// redux
import { connect } from 'react-redux'
import { getUser } from '../../actions/authorizeActions';

import axios from 'axios';

const { TextArea } = Input;

const CommentList = ({ comments }) => (
   <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout="horizontal"
      renderItem={props => <Comment {...props} avatar={<Avatar icon="user" />} />}
   />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
   <div>
      <Form.Item>
         <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
         <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
            Add Comment
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

   render() {
      const { comments, submitting, commentValue } = this.state;
      return (
         <div className="container mt-2">
            <h3>{this.state.chapter.chapterName}</h3>
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
            {comments.length > 0 && <CommentList comments={comments} />}

         </div>
      );
   }
}

const mapStateToProps = state => ({
   user: state.authorize.user
})

export default connect(mapStateToProps, { getUser })(chapter);