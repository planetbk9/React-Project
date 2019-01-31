import { createStore, applyMiddleware } from 'redux';
import Reducers from 'store/modules';
import thunkMiddleware from 'redux-thunk';
//import { createLogger } from 'redux-logger';

export default createStore(Reducers, applyMiddleware(thunkMiddleware));