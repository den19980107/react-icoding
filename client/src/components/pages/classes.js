import React, { Component } from 'react';
import CourseCard from '../courses/courseCard';
import { PageHeader } from 'antd';
import Resource from '../util/resource';
import Spinner from '../util/spinner';

class classes extends Component {
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
               <Resource
                  path="/api/getClasses"
                  render={data => {
                     if (data.loading) return <Spinner></Spinner>
                     return data.payload.map(classInfo => (
                        <CourseCard key={classInfo._id} id={classInfo._id} classInfo={classInfo}></CourseCard>
                     ))
                  }}
               >
               </Resource>
            </div>
         </div>
      );
   }
}

export default classes;