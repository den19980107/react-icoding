import React, { Component } from 'react';
import { Icon, Menu, Dropdown } from 'antd';
class chapterListItem extends Component {


   renameChapter = () => {
      console.log("rename")
   }
   deleteChapter = () => {
      console.log("delete")
   }
   showChapter = () => {
      console.log("showChapter")
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
                           <a target="_blank" rel="noopener noreferrer" onClick={this.renameChapter}>
                              重新命名
                           </a>
                        </Menu.Item>
                        <Menu.Item>
                           <a target="_blank" rel="noopener noreferrer" onClick={this.deleteChapter}>
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
         </div>
      );
   }
}

export default chapterListItem;