import React, { Component } from 'react';
import { Button, Modal } from 'antd';
class uploadTest extends Component {
   state = {
      visible: false
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
            <Button type="primary" onClick={this.showModal}>新增測驗</Button>
            <Modal
               title="新增測驗"
               style={{ top: 20 }}
               bodyStyle={{ height: "auto" }}
               width="80%"
               visible={this.state.visible}
               onOk={this.handleOk}
               onCancel={this.handleCancel}
            >
            </Modal>
         </React.Fragment>
      );
   }
}

export default uploadTest;