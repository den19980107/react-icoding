import React, { Component } from 'react';
import { Icon, Menu, Dropdown } from 'antd';

class testListItem extends Component {

   renameTest = () => {
      console.log("rename")
   }
   deleteTest = () => {
      console.log("delete")
   }
   showTest = () => {
      console.log("showChapter")
   }
   render() {
      const { test } = this.props
      return (
         <div className="card mt-3 mr-3" style={{ width: "12rem", height: "5.17rem" }}>
            <div style={{ height: "5rem", display: "flex", justifyContent: "center", flexDirection: "column", textAlign: "left", borderBottom: "1px solid rgb(200,200,200)" }} title={test.testName}>
               <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Icon type="calculator" style={{ padding: "0.5rem", fontSize: "22px", color: "rgb(83,132,246)" }} />
                  <Dropdown overlay={
                     <Menu>
                        <Menu.Item>
                           <a target="_blank" rel="noopener noreferrer" onClick={this.renameTest}>
                              重新命名
                           </a>
                        </Menu.Item>
                        <Menu.Item>
                           <a target="_blank" rel="noopener noreferrer" onClick={this.deleteTest}>
                              刪除
                           </a>
                        </Menu.Item>
                     </Menu>
                  }>
                     <Icon type="more" style={{ padding: "0.5rem", fontSize: "16px" }} id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                  </Dropdown>
               </div>
               <p style={{ margin: "0", padding: "0.5rem", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden", cursor: "default" }}>{test.testName}</p>
            </div>
         </div>
      );
   }
}

export default testListItem;