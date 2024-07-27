const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chinnasivakrishna2003@gmail.com',
    pass: 'qkjl voce dskw gfru'
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendBirthdayEmail = async (email, name) => {
  const mailOptions = {
    from: 'chinnasivakrishna2003@gmail.com',
    to: email,
    subject: 'Happy Birthday!',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="background-color: #f7f7f7; padding: 20px; border-radius: 10px; text-align: center;">
          <h1 style="color: #4CAF50;">🎉 Happy Birthday, ${name}! 🎉</h1>
          <p style="font-size: 18px;">We hope your special day is filled with joy, laughter, and wonderful memories.</p>
          <div style="margin: 20px 0;">
            <img src="https://res.cloudinary.com/dsbuzlxpw/image/upload/v1721563252/download_1_qoljtn.jpg" alt="Happy Birthday" style="max-width: 100%; border-radius: 10px;" />
          </div>
          <p style="font-size: 16px;">May all your wishes come true and may you have a fantastic year ahead. Thank you for being a valued member of our team. We look forward to celebrating many more birthdays with you!</p>
          <p style="font-size: 18px; font-weight: bold;">Best wishes to you</p>
          
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Birthday email sent to ${email}`);
  } catch (error) {
    console.log(`Failed to send email to ${email}: `, error);
  }
};

module.exports = { sendBirthdayEmail };
