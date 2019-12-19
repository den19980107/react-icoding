import React, { Component } from 'react';
import '../style/spinner.css'
class spinner extends Component {
   render() {
      return (
         <div className="spinner" style={{ width: "100vw" }}>
            <div className="rect1"></div>
            <div className="rect2"></div>
            <div className="rect3"></div>
            <div className="rect4"></div>
            <div className="rect5"></div>
         </div>
      );
   }
}

export default spinner;