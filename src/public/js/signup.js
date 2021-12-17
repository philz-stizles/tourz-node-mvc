import axios from 'axios'
import { showAlert } from "./alert"

export const signup = async (credentials) => {
  try {
    // Send a POST request
    const response = await axios({
      method: 'POST',
      url: '/api/v1/auth/signup',
      data: credentials
    })

    if(response.data.status) {
      showAlert('success', response.data.message)
      window.setTimeout(() => {
        location.assign('/login')
      }, 1500)
    }

  } catch (error) {
    console.log(error)
    showAlert('error', error.response.data.message)
  }
}