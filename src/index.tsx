import React from 'react';
import { render } from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import 'index.css';
import 'tachyons';

import App from 'app/app';
import CalendarReducer from 'app/core/reducers/calendar.reducer';

const Root = () => (
  <Provider store={createStore(CalendarReducer, applyMiddleware(thunk))}>
    <App />
  </Provider>
);

render(<Root />, document.getElementById('root'));