import path from 'path';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import expressRateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import hpp from 'hpp';
import xss from 'xss-clean';
import compression from 'compression';
import swaggerUI from 'swagger-ui-express';
// Middlewares.
import notFoundHandler from '@src/middlewares/notfound.middleware';
import globalErrorHandler from '@src/middlewares/error.middleware';
import { webhookCheckout } from '@src/controllers/booking.controllers';
// Routes.
import authRoutes from '@src/routes/auth.routes';
import userRoutes from '@src/routes/user.routes';
import tourRoutes from '@src/routes/tour.routes';
import reviewRoutes from '@src/routes/review.routes';
import bookingRoutes from '@src/routes/booking.routes';
// API Documentation
import swaggerDocument from '@src/docs';

const app: Express = express();

// app.enable('trust proxy');

// Set View Template *********************************************************************************** |
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// CORS
// app.use(
//   cors({
//     // origin: 'https://someurl.com'
//   })
// ); // cors() is a middleware which means that you can implement on specific routes as middleware

// app.options('*', cors());
// app.options('/api/v1/tours/:id', cors()) // You can also use for specific routes
// Serving Static Files ******************************************************************************** |
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public'))); // This says, anytime there is a request from the
// server, look in the public folder e.g for http://localhost:5000/overview.html, overview should be placed
// in the root of the public folder
app.use(express.static(path.join(__dirname, 'uploads')));

// Security - Anti Cross-site Scripting - ************************************************************** |
// Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// Logging - Development ******************************************************************************* |
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting - Anti Brute Force Attacks ************************************************************ |
app.use(
  '/api',
  expressRateLimit({
    // By specifying api, this would then affect all the routes since they all have /api
    max: 100, // no of requests per IP
    windowMs: 60 * 60 * 1000, // per period(1 hr)
    message: {
      status: 429,
      message: 'Too many requests from this IP, please try again in an hour',
    },
  })
);

// STRIPE CHECKOUT WEBHOOK
// When we needs this body in a raw form
// app.post(
//   '/webhook-checkout',
//   express.raw({ type: 'application/json' }),
//   webhookCheckout
// );

// Security - SQL Injection ***************************************************************************************** |
// Data sanitization against NoSQL query injection. |
app.use(mongoSanitize()); // It will look at the req.body, req.query and req.params, and basically
// filter out all of the dollar($) signs and dots(.) in the values

// Security - Cross Site Scripting(XSS) **************************************************************************************** |
// Data sanitization against XSS - cross site scripting. |
app.use(xss()); // This would clean any user input from malicious html code

// Security - Prevent Parameter Pollution
// app.use(
//   hpp({
//     whitelist: ['duration', 'price'], // specify parameters that can be duplicated in the query
//   })
// );

// Request body parsing ******************************************************************************* |
app.use(express.json({ limit: '5mb' })); // This would limit the body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '5mb' })); // This would limit the body size to 10kb
app.use(cookieParser()); // Parses data from cookies

// Compression **************************************************************************************** |
app.use(compression());

// MVC View Routes ************************************************************************************ |
app.use('/', require('./routes/view.routes'));

// API Resource Routes ******************************************************************************** |
const api = process.env.API_ROOT ? process.env.API_ROOT : '';
const version = process.env.API_VERSION ? process.env.API_VERSION : '';

app.use(`${api}${version}/auth`, authRoutes);
app.use(`${api}${version}/users`, userRoutes);
app.use(`${api}${version}/tours`, tourRoutes);
app.use(`${api}${version}/reviews`, reviewRoutes);
app.use(`${api}${version}/bookings`, bookingRoutes);

// API Documentation ********************************************************************************** |
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Handle Unknown Routes -  *************************************************************************** |
// i.e routes that are not caught by any routers, but exclude all graphql routes at the server layer.
app.all(/^\/(?!graphql).*/, notFoundHandler);

// Global Error Handling ****************************************************************************** |
app.use(globalErrorHandler);

export default app;
