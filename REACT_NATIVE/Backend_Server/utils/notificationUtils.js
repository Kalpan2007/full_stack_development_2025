const nodemailer = require('nodemailer');

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send email notification
exports.sendEmailNotification = async (email, subject, message) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      text: message
    });
    console.log('Email notification sent successfully');
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
};

// Send in-app notification
exports.createNotification = async (userId, title, message, type) => {
  try {
    const notification = new Notification({
      user: userId,
      title,
      message,
      type
    });
    await notification.save();
    
    // You can implement real-time notifications using Socket.IO here
    // io.to(userId).emit('notification', { title, message, type });
    
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};