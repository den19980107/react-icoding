import React, { Component } from 'react';
import TestListItem from './testListItem';
class testList extends Component {
   constructor(props) {
      super(props)
      this.state = {
         tests: this.props.tests
      }
   }

   render() {
      if (this.props.tests.length) {
         return (
            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "start" }}>
               {this.props.tests.map(test => (
                  <TestListItem key={test._id} test={test}></TestListItem>
               ))}
            </div>
         );
      } else {
         return (
            <div>沒有資料</div>
         )
      }
   }
}

export default testList;