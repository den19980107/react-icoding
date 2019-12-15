import { combineReducers } from 'redux';
import authorizeReducers from './authorizeReducers';

export default combineReducers({
   authorize: authorizeReducers
})