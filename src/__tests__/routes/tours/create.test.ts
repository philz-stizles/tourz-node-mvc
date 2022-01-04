import request from 'supertest';
import app from '@src/app';
import Tour from '@src/models/tour.model';
import { signinWithToken as signin } from '@src/test/setupFilesAfterEnv';

const api = process.env.API_ROOT ? process.env.API_ROOT : '';
const version = process.env.API_VERSION ? process.env.API_VERSION : '';

describe('Create tour route', () => {
  it(`has a route handler listening to ${api}${version}/tours routes for POST requests`, async () => {
    const response = await request(app).post('/api/tours').send({});
    expect(response.status).not.toEqual(404);
  });

  it('can only be accessed if the user is authenticated', async () => {
    await request(app).post(`${api}${version}/tours`).send({}).expect(401);
  });

  it('returns a status other than 401 if the user is authenticated', async () => {
    const token = await signin();
    console.log(token);
    const response = await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(response.status).not.toEqual(401);
  });

  it('returns an error if an invalid name is provided', async () => {
    const token = await signin();
    await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', price: 10 })
      .expect(400);
    await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ price: 10 })
      .expect(400);
  });

  it('returns an error if an invalid price is provided', async () => {
    const token = await signin();
    await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test name', price: -10 })
      .expect(400);
    await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test name' })
      .expect(400);
  });

  it('creates a new tour if valid inputs are provided', async () => {
    const token = await signin();
    let tours = await Tour.find({});
    expect(tours.length).toEqual(0);

    const newTour = { name: 'Test name', price: 10 };

    await request(app)
      .post(`${api}${version}/tours`)
      .set('Authorization', `Bearer ${token}`)
      .send(newTour)
      .expect(201);

    tours = await Tour.find({});
    expect(tours.length).toEqual(1);
    expect(tours[0].name).toEqual(newTour.name);
    expect(tours[0].price).toEqual(newTour.price);
  });
});
