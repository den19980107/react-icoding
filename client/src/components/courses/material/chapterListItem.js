import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { Icon, Menu, Dropdown, Modal } from 'antd';
import axios from 'axios';

class chapterListItem extends Component {
   state = {
      id: this.props.chapter._id,
      reNameModalVisible: false,
      reNamedChapterName: "",
   }

   showRenameChapterModal = () => {
      console.log("show")
      this.setState({
         reNameModalVisible: true,
      });
   };

   closeRenameModal = e => {
      console.log("close")
      this.setState({
         reNameModalVisible: false
      })
   }

   renameChapter = () => {
      axios.post('/api/renameChapter/' + this.state.id, {
         chapterName: this.state.reNamedChapterName
      })
         .then((res) => {
            Modal.success({
               content: "更改成功！",
               okText: '確認'
            });
            this.props.reflashChapter()
            this.closeRenameModal();
         })
         .catch((error) => {
            Modal.error({
               content: "更改失敗！",
               okText: '確認'
            });
         })
   }

   showConfrimModal = () => {
      let res = Modal.confirm({
         title: '警告',
         content: `確認要刪除"${this.props.chapter.chapterName}"講義嗎？`,
         okText: '確認',
         okType: 'danger',
         cancelText: '取消',
         onOk: this.deleteChapter
      });
   }

   deleteChapter = () => {
      console.log("delete")
      axios.post('/api/deleteChapter/' + this.state.id)
         .then((res) => {
            this.props.reflashChapter()
         })
         .catch((error) => {
            Modal.error({
               content: "刪除失敗！",
               okText: '確認'
            });
         })
   }
   showChapter = () => {
      console.log("showChapter")
      this.props.history.push(`/chapter/${this.state.id}`)
   }

   render() {
      const { chapter } = this.props;
      return (
         <div className="card mt-3 mr-3" style={{ width: "12rem", height: "16.97rem" }}>
            <div style={{ height: "5rem", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "left", borderBottom: "1px solid rgb(200,200,200)" }} title={chapter.chapterName}>
               <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Icon type="file-text" style={{ padding: "0.5rem", fontSize: "22px", color: "rgb(83,132,246)" }} />
                  <Dropdown overlay={
                     <Menu>
                        <Menu.Item>
                           <a target="_blank" rel="noopener noreferrer" onClick={this.showRenameChapterModal}>
                              重新命名
                           </a>
                        </Menu.Item>
                        <Menu.Item>
                           <a target="_blank" rel="noopener noreferrer" onClick={this.showConfrimModal}>
                              刪除
                           </a>
                        </Menu.Item>
                     </Menu>
                  }>
                     <Icon type="more" style={{ padding: "0.5rem", fontSize: "16px" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                  </Dropdown>
               </div>
               <p style={{ margin: "0", padding: "0.5rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", cursor: "default" }}>{chapter.chapterName}</p>
            </div>
            <div className="card-body p-2" style={{ height: "11.8rem", background: "linear-gradient(rgb(250,250,250) 10%,white 90%)", cursor: "pointer" }} onClick={this.showChapter}>
               <div className="card-text h-100" style={{ width: "100%", height: "95%", overflow: "hidden", fontSize: "1px" }} dangerouslySetInnerHTML={{ __html: `<div>${chapter.body}</div>` }}></div>
            </div>


            {/* Modal */}
            {/* 重新命名 */}
            <Modal
               title="重新命名"
               visible={this.state.reNameModalVisible}
               onOk={this.renameChapter}
               onCancel={this.closeRenameModal}
            >
               <div className="form-group">
                  <label>講義名稱</label>
                  <input type="text" onChange={(e) => this.setState({ reNamedChapterName: e.target.value })} className="form-control" placeholder="請輸入講義名稱" />
               </div>
            </Modal>
         </div>
      );
   }
}

export default withRouter(chapterListItem);