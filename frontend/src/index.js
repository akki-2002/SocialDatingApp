
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom'; // or HashRouter, etc.
import { Provider } from 'react-redux';
import App from './App';
import store from './store/ReduxStore';

const root = createRoot(document.getElementById('root'));

root.render(
  <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<App />} />
        </Routes>
      </BrowserRouter>
  </Provider>
);



