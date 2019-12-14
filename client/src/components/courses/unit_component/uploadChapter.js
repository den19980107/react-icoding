import React, { Component } from 'react';
import { Button, Modal } from 'antd';
import PropTypes from 'prop-types';
import axios from 'axios';

// import component
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
class uploadChapter extends Component {
   constructor(props) {
      super(props)
      this.state = {
         title: "",
         body: "",
         pdf: null,
         visible: false
      }
   }

   showModal = () => {
      this.setState({
         visible: true,
      });
   };

   createChapter = e => {
      let chapterData = {
         title: this.state.title,
         unitID: this.props.unitId,
         body: this.state.body,
         pdf: this.state.pdf
      }
      let error = [];
      if (chapterData.title == "") error.push("講義標題不得為空！");
      if (chapterData.body == "") error.push("講義內容不得為空！");

      if (error.length > 0) {
         let errorString = ""
         for (let i = 0; i < error.length; i++) {
            errorString += error[i] + "\n"
         }
         Modal.error({
            content: "請檢察輸入內容！\n" + errorString,
            okText: '確認'
         });
      } else {
         axios.post('/class/unit/addLecture', chapterData)
            .then((res) => {
               Modal.success({
                  content: "新增成功",
                  okText: '確認'
               });
               this.props.reflashChapter()
            })
            .catch((error) => {
               Modal.error({
                  content: "新增失敗",
                  okText: '確認'
               });
            })
         this.setState({
            visible: false,
         });
      }
   };

   handleCancel = e => {
      console.log(e);
      this.setState({
         visible: false,
      });
   };
   render() {
      return (
         <React.Fragment>
            <Button type="primary" onClick={this.showModal}>新增講義</Button>
            <Modal
               title="新增講義"
               style={{ top: 20 }}
               bodyStyle={{ height: "auto" }}
               width="80%"
               visible={this.state.visible}
               onOk={this.createChapter}
               onCancel={this.handleCancel}
            >
               <div className="form-group">
                  <label for="exampleInputEmail1">講義名稱</label>
                  <input type="text" className="form-control" onChange={(e) => this.setState({ title: e.target.value })} placeholder="請輸入講義名稱" />
               </div>
               <CKEditor
                  editor={ClassicEditor}
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
            </Modal>
         </React.Fragment>
      );
   }
}
uploadChapter.propTypes = {
   unitId: PropTypes.string.isRequired,
}
export default uploadChapter;