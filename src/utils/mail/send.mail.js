
import transporter from './transporter.mail.js';
import renderEmailTemplate from './renderEmailTemplate.mail.js';

const sendMail = async (payload) => {

  try {
    const html = await renderEmailTemplate(payload);
    if(!payload && payload.length < 0) {
      console.error("Payload is required.");
      return null;
    }
    const mailOptions = {
      from: process.env.EMAIL_ID, 
      to: payload.member.email, 
      subject: 'Test Email from Node.js', 
      html: html,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error: ', error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error('Error during email sending process:', error);
  }
};

export { sendMail };