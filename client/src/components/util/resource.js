import React, { Component } from 'react';
import axios from 'axios';
class resource extends Component {
   state = {
      loading: false,
      refresh: false,
      payload: []
   }

   componentDidMount() {
      this.setState({ loading: true })
      axios.get(this.props.path).then(res => {
         this.setState({
            payload: res.data,
            loading: false
         })
      })
   }

   render() {
      return this.props.render(this.state)
   }
}

export default resource;