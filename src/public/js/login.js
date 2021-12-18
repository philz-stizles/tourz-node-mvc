import axios from 'axios'
import { showAlert } from './alert'

export const login = async (credentials) => {
    try {
        // Send a POST request
        const response = await axios.post('/api/v1/auth/login', credentials) // Since the view and the
        // server are on the same server, hosted in the same place, using the same URL, then we can
        // specify '/api/v1/auth/login' without the base URL 'http://localhost:5000'. This is important
        // for deployment
        // NOTE: You can use fetch directly from the browser console

        if (response.data.status) {
            showAlert('success', response.data.message)
            window.setTimeout(() => {
                location.assign('/')
            }, 1500)
        }
    } catch (error) {
        showAlert('error', error.response.data.message)
    }
}

export const logout = async () => {
    try {
        // Send GET request
        const response = await axios.get('/api/v1/auth/logout') // Since the view and the server are on the
        // same server, hosted in the same place, using the same URL, then we can specify '/api/v1/auth/logout'
        // without the base URL 'http://localhost:5000'. This is important for deployment.
        // NOTE: You can use fetch directly from the browser console

        console.log(response)

        if (response.data.status) {
            showAlert('success', response.data.message)
            document.location.href = '/' // By default, the reload() method reloads the page from the cache,
            // but you can force it to reload the page from the server by setting the forceGet parameter
            // to true: location.reload(true).
        }
    } catch (error) {
        showAlert('error', 'Error logging out, try again')
    }
}
