import { Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import catchAsync from '@src/utils/catchAsync.utils';
import AppError from '@src/errors/app.error';
import * as factory from '@src/factories/handler.factory';
// Models.
import User from '@src/models/user.model';
import Tour from '@src/models/tour.model';
import Booking from '@src/models/booking.model';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2020-08-27',
});

export const getCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get the currently booked tour
    const tourId = req.params.tourId;
    const tour = await Tour.findById(tourId);
    if (!tour) return next(new AppError(404, 'Resource does not exist'));

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${tour.name} Tour`,
              description: tour.summary,
              images: [
                `${req.protocol}://${req.get('host')}/img/tours/${
                  tour.imageCover
                }`,
              ],
            },
            unit_amount: tour.price * 100, // expects cents, so convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${tourId}&creator=${req.user.id}&price=${tour.price}`,
      success_url: `${req.protocol}://${req.get(
        'host'
      )}/my-tours?alert=booking`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
      customer_email: req.user.email,
      client_reference_id: req.params.tourId,
    });

    console.log(session);

    res.json({ status: true, data: session.id, message: 'success' });
  }
);

// exports.createBookingCheckout = catchAsync(async (req, res, next) => {
//   // This is only temporary because it is not secure, anyone can make booking without paying
//   const { tour, creator, price } = req.query
//   if(!tour && !creator && !price) return next()

//   await Booking.create({ tour, creator, price })

//   res.redirect(`${req.originalUrl.split('?')[0]}`)
// })

const createBookingCheckout = async (
  session: Stripe.Event.Data.Object | any | unknown
) => {
  console.log(session);
  const tour = session.client_reference_id;
  const existingUser = await User.findOne({ email: session.customer_email });
  if (!existingUser) {
    return;
  }
  const createdBy = existingUser._id;
  const price = session.amount_total / 100;

  await Booking.create({ tour, createdBy, price });
};

export const webhookCheckout = (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: any | unknown) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }
  console.log(event);

  if (event.type === 'checkout.session.completed') {
    createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

// Using handle factories.
export const createBooking = factory.createOne(Booking);
export const getAllBookings = factory.getAll(Booking);
export const getBooking = factory.getOne(Booking);
export const updateBooking = factory.updateOne(Booking);
export const deleteBooking = factory.deleteOne(Booking);
