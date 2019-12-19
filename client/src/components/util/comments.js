import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Comment, Avatar, Form, Button, List, Input, Modal, Icon } from 'antd';
import moment from 'moment';
import axios from 'axios'
const { TextArea } = Input;
const CommentList = ({ comments, user, deleteComment }) => (
   <List
      dataSource={comments}
      header={`${comments.length} 則留言`}
      itemLayout="horizontal"
      renderItem={props =>
         <List.Item
            actions={(props.authorId === user._id) ? [<a key="list-loadmore-edit" onClick={(e) => deleteComment(props.id)}>刪除</a>] : ""}
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

class comments extends Component {
   constructor(props) {
      super(props)
      this.state = {
         submitting: false,
         commentValue: '',
         comments: []
      }
   }

   componentWillReceiveProps(nextProps) {
      this.setState({
         comments: nextProps.comments
      })
   }

   handleSubmit = async () => {
      if (!this.state.commentValue) {
         return;
      }
      this.setState({
         submitting: true,
      });
      await axios.post(this.props.addPath, {
         body: this.state.commentValue
      })

      this.setState({
         submitting: false,
         commentValue: ''
      });
      this.props.onRefresh();
   };

   deleteComment = async (id) => {
      console.log(id)
      let res = await axios.post(this.props.deletePath + id);
      if (res.status == 200) {
         this.props.onRefresh();
      }
   }

   handleChange = e => {
      this.setState({
         commentValue: e.target.value,
      });
   };
   render() {
      return (
         <React.Fragment>
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
                     submitting={this.state.submitting}
                     value={this.state.commentValue}
                  />
               }
            />
            {this.state.comments.length > 0 && <CommentList user={this.props.thisUser} deleteComment={this.deleteComment} comments={this.state.comments} />}
         </React.Fragment>
      );
   }
}
comments.propTypes = {
   thisUser: PropTypes.object.isRequired,
   addPath: PropTypes.string.isRequired,
   deletePath: PropTypes.string.isRequired,
   comments: PropTypes.array.isRequired,
   onRefresh: PropTypes.func.isRequired
}
export default comments;