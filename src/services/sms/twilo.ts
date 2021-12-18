import twilioClient from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilioClient(accountSid, authToken, {
  lazyLoading: true, // lazy loading required modules for faster loading time
  // region: 'au1',
  // edge: 'sydney',
});

interface Data {
  body: string;
  phone: string;
}

const sendText = async (data: Data, done: any) => {
  try {
    await client.messages.create({
      body: data.body,
      from: `${process.env.MESSAGING}`,
      to: `${data.phone}`,
    });
    return done();
  } catch (error: any | unknown) {
    console.error(error.message);
    done();
  }
};

export { sendText };
