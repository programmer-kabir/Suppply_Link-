import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'
import routes from './Router/Router.jsx'
import AuthProvider, { AuthContext } from './Provider/AuthProvider.jsx'
import { Provider } from 'react-redux'
import store from './Redux/store.js'
  import { ToastContainer } from 'react-toastify';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Provider store={store}>
      <ToastContainer />
 <RouterProvider router={routes}/>
      </Provider>
    </AuthProvider>
  </StrictMode>,
)
