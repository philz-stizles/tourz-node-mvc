const sendGrid = require('@sendgrid/mail');

sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendEmail = async (to, subject, text, html) => {
  const msgOptions = {
    to,
    from: process.env.ADMIN_EMAIL,
    subject,
    text,
    html,
  };

  try {
    await sendGrid.send(msgOptions);
  } catch (error) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
};
