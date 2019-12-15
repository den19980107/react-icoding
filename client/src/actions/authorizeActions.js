import { LOGIN, LOGIN_ERROR, LOGOUT, LOGOUT_ERROR, GET_USER, GET_USER_ERROR } from './types';
import axios from 'axios';

export const login = ({ username, password }) => dispatch => {
   console.log("login...")
   axios.post('/users/login', {
      username: username,
      password: password
   })
      .then(res => res.data.user)
      .then(user => dispatch({
         type: LOGIN,
         payload: user
      }))
      .catch((error) => {
         dispatch({
            type: LOGIN_ERROR,
            payload: error.response.data.message
         })
      })

}

export const getUser = () => dispatch => {
   console.log("getUser");
   dispatch({
      type: GET_USER
   })
}