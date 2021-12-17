import axios from 'axios'
const stripe = Stripe('pk_test_51IBge5GrxPzaHsCXGVOz7uAektaCJ6NtoQnmno4HUjc3Oo5WFAWk9d6e7W9OHUqxvFEerKUp9sItTpWerAw8ao5s00efCn6C9W')
import { showAlert } from './alert'

export const createCheckoutSession = async tourId => {
  try {
    console.log(tourId)
    // Get checkout session from API
    const response = await axios.get(`/api/v1/bookings/checkoutSession/${tourId}`) // Since the view and the server are on the 
    // same server, hosted in the same place, using the same URL, then we can specify '/api/v1/auth/logout' 
    // without the base URL 'http://localhost:5000'. This is important for deployment.
    // NOTE: You can use fetch directly from the browser console
    console.log(response)

    if(response.data.status) {
      // Create checkout form + charge credit card
      await stripe.redirectToCheckout({
        sessionId: response.data.data
      })
      // Note that stripe will automatically send email to the user 
    }

  } catch (error) {
    console.log(error)
    showAlert('error', error.message)
  }
}