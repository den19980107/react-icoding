import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import axios from 'axios'
import { Input, Icon, Button, Modal } from 'antd';

// redux
import { connect } from 'react-redux'
import { getUser } from '../../actions/authorizeActions';

// component
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Spacer from '../util/spacer';

class editChapter extends Component {
   constructor(props) {
      super(props)
      const { id } = props.match.params
      this.state = {
         id: id,
         chapterName: "",
         belongUnit: "",
         body: "",
         images: "",
         like: "",
         pdf: [],
         classinfo: {}
      }
   }

   componentDidMount() {
      this.props.getUser()
      this.getChapterData()
   }

   getChapterData = async () => {
      let res = await axios.get(`/class/getChapter/${this.state.id}`)
      let chapterData = res.data.chapter
      let classinfo = res.data.classinfo
      this.setState({
         chapterName: chapterData.chapterName,
         belongUnit: chapterData.belongUnit,
         body: chapterData.body,
         images: chapterData.images,
         like: chapterData.like,
         pdf: chapterData.pdf || [],
         classinfo: classinfo
      })
   }

   handleTitleChange = (e) => {
      this.setState({
         chapterName: e.target.value
      })
   }

   saveChange = async () => {
      let res = await axios.post('/class/saveEditedChapter', {
         chapterID: this.state.id,
         chapterName: this.state.chapterName,
         body: this.state.body,
         pdf: this.state.pdf
      })
      if (res.status == 200) {
         Modal.success({
            content: "儲存成功！",
            okText: '確認',
            onOk: this.goBackToChapter()
         });
      } else {
         Modal.error({
            content: "儲存失敗！",
            okText: '確認'
         });
      }
   }

   goBackToChapter = () => {
      this.props.history.push(`/chapter/${this.state.id}`)
   }

   render() {
      return (
         <div className="container mt-2" style={{ marginBottom: "10rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }} className="pt-4 pb-4">
               <h3>編輯講義</h3>
               {this.props.user._id == this.state.classinfo.teacher &&
                  <Button type="primary" onClick={this.saveChange}><Icon type="save" />儲存</Button>
               }
            </div>
            <Input placeholder="請輸入講義名稱" style={{ fontSize: "26px", padding: "1.5rem 1rem" }} onChange={this.handleTitleChange} value={this.state.chapterName} />
            <Spacer></Spacer>
            <CKEditor
               editor={ClassicEditor}
               data={this.state.body}
               onInit={editor => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!', editor);
               }}
               onChange={(event, editor) => {
                  const data = editor.getData();
                  this.setState({ body: data })
               }}
               onBlur={(event, editor) => {
                  console.log('Blur.', editor);
               }}
               onFocus={(event, editor) => {
                  console.log('Focus.', editor);
               }}
            />
         </div >
      );
   }
}

const mapStateToProps = state => ({
   user: state.authorize.user
})

export default connect(mapStateToProps, { getUser })(withRouter(editChapter));