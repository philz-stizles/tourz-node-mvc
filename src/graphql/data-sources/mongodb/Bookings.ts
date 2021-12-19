import { MongoDataSource } from 'apollo-datasource-mongodb';
import { Types } from 'mongoose';
import Booking, { IBookingDocument } from '@src/models/booking.model';
import { IContext } from '@src/graphql/context';

export class Bookings extends MongoDataSource<IBookingDocument, IContext> {
  getBooking(id: Types.ObjectId): Promise<IBookingDocument | null | undefined> {
    return this.findOneById(id);
  }
}

export default new Bookings(Booking);
