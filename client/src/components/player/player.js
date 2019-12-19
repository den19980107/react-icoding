import React, { Component } from 'react';
import PropTypes from 'prop-types';
class player extends Component {

   render() {
      if (this.props.showThumbnail) {
         return (
            <video preload="metadata" style={{ width: "100%", height: "100%" }} >
               <source src={"/uploader/video/" + this.props.id} type="video/mp4" />
            </video>
         );
      } else {
         return (
            <video controls autoPlay controlsList="nodownload" style={{ width: "100%", height: "100%" }} >
               <source src={"/uploader/video/" + this.props.id} type="video/mp4" />
            </video>
         );
      }
   }
}
player.propTypes = {
   id: PropTypes.string
};
export default player;