import path from 'path';
import express from 'express';
import expressRateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import swaggerUI from 'swagger-ui-express';
// Middlewares.
import globalErrorHandler from '@src/middlewares/error.middleware';
import notFoundHandler from '@src/middlewares/notfound.middleware';
import { webhookCheckout } from '@src/controllers/booking.controllers';
import swaggerDocument from '@src/docs';
// Routes.
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import tourRoutes from './routes/tour.routes';
import reviewRoutes from './routes/review.routes';
import bookingRoutes from './routes/booking.routes';

const app = express();

app.enable('trust proxy');

// VIEW TEMPLATE
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// CORS
app.use(
  cors({
    // origin: 'https://someurl.com'
  })
); // cors() is a middleware which means that you can implement on specific routes as middleware

// app.options('*', cors());
// app.options('/api/v1/tours/:id', cors()) // You can also use for specific routes

// SERVING STATIC FILES
// app.use(express.static(path.join(__dirname, 'static')))
app.use(express.static(path.join(__dirname, 'public'))); // This says, anytime there is a request from the
// server, look in the public folder e.g for http://localhost:5000/overview.html, overview should be placed
// in the root of the public folder
app.use(express.static(path.join(__dirname, 'uploads')));

// SECURITY - Anti Cross-site Scripting - Security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// LOGGING - DEVELOPMENT
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// SECURITY - Anti Brute Force Attacks - Set rate limiting
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
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);

// REQUEST BODY PARSING
app.use(express.json({ limit: '10kb' })); // This would limit the body size to 10kb
app.use(express.urlencoded({ extended: true, limit: '10kb' })); // This would limit the body size to 10kb
app.use(cookieParser()); // Parses data from cookies

// SECURITY - Data sanitization against NoSQL query injection
app.use(mongoSanitize()); // It will look at the req.body, req.query and req.params, and basically
// filter out all of the dollar($) signs and dots(.) in the values

// SECURITY - Data sanitization against XSS - cross site scripting
app.use(xss()); // This would clean any user input from malicious html code

// Security - Prevent Parameter Pollution
app.use(
  hpp({
    whitelist: ['duration', 'price'], // specify parameters that can be duplicated in the query
  })
);

// Compression ********************************************************************************* |
app.use(compression());

// MVC View Routes ***************************************************************************** |
app.use('/', require('./routes/view.routes'));

// API Resource Routes ************************************************************************* |
const api = process.env.API_ROOT ? process.env.API_ROOT : '';
const version = process.env.API_VERSION ? process.env.API_VERSION : '';

app.use(`${api}${version}/auth`, authRoutes);
app.use(`${api}${version}/users`, userRoutes);
app.use(`${api}${version}/tours`, tourRoutes);
app.use(`${api}${version}/reviews`, reviewRoutes);
app.use(`${api}${version}/bookings`, bookingRoutes);

// API Documentation *************************************************************************** |
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// Handle Unhandled Routes - routes that are not caught by any routers ************************* |
// But exclude all graphql routes at the server layer.
app.all('/^(?!graphql$)/', notFoundHandler);

// Global Error Handling *********************************************************************** |
app.use(globalErrorHandler);

export default app;
