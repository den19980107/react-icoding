import { LOGIN, LOGOUT, GET_USER, LOGIN_ERROR } from '../actions/types';

const initialState = {
   user: {}
}

export default function (state = initialState, action) {
   switch (action.type) {
      case LOGIN:
         console.log("LOGIN")
         initialState.user = action.payload
         return {
            ...state,
            user: action.payload
         }
      case LOGIN_ERROR:
         return {
            ...state,
            error: action.payload
         }
      case LOGOUT:
         initialState.user = null
         return {
            ...state,
            user: initialState.user
         }
         break;
      case GET_USER:
         return {
            ...state,
            user: initialState.user
         }
         break;
      default:
         return state
   }
}