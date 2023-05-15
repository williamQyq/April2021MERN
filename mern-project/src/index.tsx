import React from 'react';
import ReactDom from 'react-dom/client';
import './assets/index.css';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import store from './redux/store/store';
import { Provider } from 'react-redux';
import persistStore from 'redux-persist/es/persistStore';
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SocketProvider } from './component/socket/SocketProvider';
import { ThemeProvider } from './pages/Home/components/ThemeProvider';

const persistor = persistStore(store);

function render() {

  const root: ReactDom.Root = ReactDom.createRoot(
    document.getElementById('root') as HTMLElement
  );

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SocketProvider>
            <ThemeProvider>
              <Router>
                <App />
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
