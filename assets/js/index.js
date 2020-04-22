import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import App from './app.js';
import './i18n';

ReactDOM.render(
  <Suspense fallback="loading...">
    <App />
  </Suspense>,
  document.getElementById('root')
);
