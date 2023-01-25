import React from 'react';
import { createRoot } from 'react-dom/client';
import 'styles/index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import store from './reducers/store/store';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketProvider } from './component/socket/socketContext.js';
import { ThemeProvider } from './component/Home/ThemeProvider';
const persistor = persistStore(store);

function render() {
  const root = createRoot(document.getElementById('root'))
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <ThemeProvider>
              <Router>
                <App token={''} isLoading={false} />
              </Router>
            </ThemeProvider>
          </SocketProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  )
}
render();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals(console.log);
