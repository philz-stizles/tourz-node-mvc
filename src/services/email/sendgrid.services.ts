import sendGrid from '@sendgrid/mail';

sendGrid.setApiKey(process.env.SENDGRID_API_KEY as string);

exports.sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html: string
) => {
  const msgOptions = {
    to,
    from: process.env.ADMIN_EMAIL as string,
    subject,
    text,
    html,
  };

  try {
    await sendGrid.send(msgOptions);
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
