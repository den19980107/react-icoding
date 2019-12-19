import React, { Component } from 'react';
import { connect } from 'react-redux';
import Player from '../player/player';
function mapStateToProps(state) {
   return {

   };
}

class video extends Component {
   constructor(props) {
      super(props)
      const { id } = props.match.params
      this.state = {
         id: id
      }
   }
   render() {
      return (
         <div>
            <Player
               id={this.state.id}
            ></Player>
         </div>
      );
   }
}

export default connect(
   mapStateToProps,
)(video);