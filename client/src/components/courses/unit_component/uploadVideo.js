import React, { Component } from 'react';

import { Button, Modal } from 'antd';

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
                  <div class="form-group">
                     <label for="exampleInputEmail1">影片名稱</label>
                     <input type="text" class="form-control" onChange={this.setVideoName} placeholder="請輸入影片名稱" />
                  </div>
                  <div class="form-group">
                     <label for="exampleInputPassword1">影片網址</label>
                     <input type="text" class="form-control" onChange={this.setVideoUrl} placeholder="請輸入影片網址" />
                  </div>
               </form>
            </Modal>
         </React.Fragment>
      );
   }
}

export default uploadVideo;