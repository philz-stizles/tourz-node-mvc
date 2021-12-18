import axios from 'axios'
import { showAlert } from './alert'

export const updateUserData = async (data, type) => {
  try {
    const endpoint = (type === 'password') ? 'me/changePassword' : 'me'
    // Send a POST request
    const response = await axios.patch(`http://localhost:5000/api/v1/users/${endpoint}`, data)
    if(response.data.status) {
      showAlert('success', response.data.message)
    }

  } catch (error) {
    showAlert('error', error.response.data.message)
  }
}