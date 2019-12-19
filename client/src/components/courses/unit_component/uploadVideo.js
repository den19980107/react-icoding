import React, { Component } from 'react';

import { Button, Modal, Upload, Icon } from 'antd';

class uploadVideo extends Component {
   state = {
      videoName: "",
      videoUrl: ""
   }
   showModal = () => {
      this.setState({
         visible: true,
      });
   };

   handleOk = e => {
      console.log(e);
      this.setState({
         visible: false,
      });
   };

   handleCancel = e => {
      console.log(e);
      this.setState({
         visible: false,
      });
   };

   handleChange = e => {
      let status = e.file.status;
      switch (status) {
         case "done":
            this.props.reflashVideos();
            Modal.success({
               content: "上傳成功！",
               okText: '確認'
            })
            break;
         case "uploading":

            break;
         case "error":
            Modal.error({
               content: "上傳失敗",
               okText: '確認'
            })
            break;
         case "removed":
            Modal.info({
               content: "取消上傳",
               okText: '確認'
            })
            break;
      }
   }
   render() {
      return (
         <React.Fragment>
            <Button type="primary" onClick={this.showModal}>新增影片</Button>
            <Modal
               title="新增影片"
               style={{ top: 20 }}
               bodyStyle={{ height: "auto" }}
               width="50%"
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
            >
               <form>
                  <div className="form-group">
                     <label>影片名稱</label>
                     <input type="text" className="form-control" onChange={this.setVideoName} placeholder="請輸入影片名稱" />
                  </div>
                  <div className="form-group">
                     <label>影片網址</label>
                     <input type="text" className="form-control" onChange={this.setVideoUrl} placeholder="請輸入影片網址" />
                  </div>
                  <Upload
                     action={`/uploader/unit/${this.props.unitId}/video/local`}
                     beforeUpload={this.beforeUpload}
                     onChange={this.handleChange}
                  >
                     <Button>
                        <Icon type="upload" /> Upload
                     </Button>
                  </Upload>
               </form>
            </Modal>
         </React.Fragment>
      );
   }
}

export default uploadVideo;