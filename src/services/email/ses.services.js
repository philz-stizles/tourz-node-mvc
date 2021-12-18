const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ses = new AWS.SES({ apiVersion: '2010-12-01' }); // apiVersion

exports.sendAccountActivationMail = (email, token) => {
  const params = {
    Source: process.env.ADMIN_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.ADMIN_EMAIL],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
                        <html>
                            <h1>Verify your email address</h1>
                            <p>Please use the following link to complete your registration:</p>
                            <p>${process.env.CLIENT_URL}/auth/activate/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Complete your registration',
      },
    },
  };

  return ses.sendEmail(params).promise();
};

exports.sendPasswordResetMail = (email, token) => {
  const params = {
    Source: process.env.ADMIN_EMAIL,
    Destination: {
      ToAddresses: [email],
    },
    ReplyToAddresses: [process.env.ADMIN_EMAIL],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `
                        <html>
                            <h1>Reset your password</h1>
                            <p>Please use the following link to reset your password:</p>
                            <p>${process.env.CLIENT_URL}/auth/password/reset/${token}</p>
                        </html>
                    `,
        },
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Password reset link',
      },
    },
  };

  return ses.sendEmail(params).promise();
};

// exports.sendCategorySubscriptionMail = (email, data: any) => {
//   const params = {
//     Source: process.env.ADMIN_EMAIL,
//     Destination: {
//       ToAddresses: [email],
//     },
//     ReplyToAddresses: [process.env.ADMIN_EMAIL],
//     Message: {
//       Body: {
//         Html: {
//           Charset: 'UTF-8',
//           Data: `
//                         <html>
//                             <h1>New link published | </h1>
//                             <p>A new link titled <b>${
//                               data.title
//                             }</b> has been published in the following categories:</p>
//                             ${data.categories
//                               .map(({ name, image, slug }) => {
//                                 return `
//                                     <div>
//                                         <h2>${name}</h2>
//                                         <img src="${image.url}" alt="${name}" style="height: 50px;" />
//                                         <h3><a href="${process.env.CLIENT_URL}/links/${slug}">Check it out</a></h3>
//                                     </div>
//                                 `;
//                               })
//                               .join(`---------------------------`)}

//                             <p>Do not want to receive notifications?</p>
//                             <p>Turn off notification from your <b>dashboard</b> > <b>update profile</b> and <b>uncheck the categories</b></p>
//                             <p>${process.env.CLIENT_URL}/user/profile/update</p>
//                             </html>
//                     `,
//         },
//       },
//       Subject: {
//         Charset: 'UTF-8',
//         Data: 'New link published',
//       },
//     },
//   };

//   return ses.sendEmail(params).promise();
// };
