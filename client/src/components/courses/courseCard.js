import React, { Component } from 'react';
import { Card, Icon, Avatar, Button } from 'antd';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import './courseCard.css'
const { Meta } = Card;
class courseCard extends Component {
   constructor(props) {
      super(props);
      let classImage = props.classInfo.classImage;
      if (!classImage) {
         classImage = "/img/NoImage.png"
      } else {
         classImage = `/class/image/${classImage}`
      }
      this.state = {
         id: props.classInfo.id,
         className: props.classInfo.className,
         outline: props.classInfo.outline,
         classImage: classImage
      }
   }
   showCourse = () => {
      this.props.history.push(`/class/${this.props.id}`)
   }
   render() {
      return (
         <Card
            style={{ width: 250, margin: "0.5rem" }}
            cover={
               <div className="box">
                  <img
                     className="img w-100"
                     alt="example"
                     src={this.state.classImage}
                  />
               </div>
            }
            actions={[
               <Icon type="heart" key="heart" />,

               <Button type="primary" onClick={this.showCourse}>查看課程</Button>,
            ]}
         >
            <Meta
               avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
               title={this.state.className}
               description={<p className="card-text">{this.state.outline}</p>}
            />
         </Card>
      );
   }
}

// PropTypes
courseCard.propTypes = {
   id: PropTypes.string.isRequired,
   classInfo: PropTypes.object.isRequired
}
export default withRouter(courseCard);