import React, { Component } from 'react';
import CourseCard from '../courses/courseCard';
import { PageHeader } from 'antd';
import axios from 'axios';
class classes extends Component {
   state = {
      classes: []
   }
   componentDidMount() {
      axios.get('/api/getClasses')
         .then((res) => {
            let classes = res.data
            this.setState({ classes })
         })
         .catch((error) => {
            console.log(error.response.data.message)
         })
   }
   render() {
      return (
         <div>
            <PageHeader
               style={{
                  border: '1px solid rgb(235, 237, 240)',
               }}
               title={<h3>總開課清單</h3>}
            />
            <div style={{ display: "flex", justifyContent: "start", padding: "1rem" }}>
               {this.state.classes.map(classInfo => (
                  <CourseCard key={classInfo._id} id={classInfo._id} classInfo={classInfo}></CourseCard>
               ))}
            </div>
         </div>
      );
   }
}

export default classes;