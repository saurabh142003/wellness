const Session = require('../models/session.model.js');
const Client = require('../models/client.model.js');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

// Email configuration (using Nodemailer)
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Replace with your email service
  auth: {
    user: process.env.EMAIL, // Your email
    pass: process.env.EMAIL_PASSWORD, // Your email password
  },
});

// Controller to schedule follow-up sessions
const scheduleSession = async (req, res) => {
  try {
    const { date, time, sessionType } = req.body;
    const clientId = req.params.id;
    const coachId = req.user.id;

    // Validate client exists
    const client = await Client.findById(clientId);

    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Split the date and time into components
    const [day, month, year] = date.split("-");
    const [hours, minutes] = time.split(":");

    // Create a local Date object from the input
    const localDate = new Date(year, month - 1, day, hours, minutes);

    // Convert the local date to UTC time
    const utcDate = new Date(localDate.toISOString()); // Convert local to UTC
    console.log("UTC Date to Store in DB:", utcDate);

    // Create and save session
    const session = new Session({
      clientId,
      coachId,
      date: utcDate,
      sessionType,
    });

    await session.save();

    // Notify the client via email
    const emailOptions = {
      from: process.env.EMAIL,
      to: client.email,
      subject: `New ${sessionType} Scheduled`,
      text: `Dear ${client.name},\n\nYour ${sessionType} session has been scheduled for ${date} ${time}.\n\nThank you,\nYour Wellness Team`,
    };

    await transporter.sendMail(emailOptions);

    // Calculate reminder time 24 hours before the session
    const reminderTime = new Date(utcDate.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours

    // Extract the reminder date components (e.g., hour, minute)
    const reminderHour = reminderTime.getUTCHours();
    const reminderMinute = reminderTime.getUTCMinutes();

    // Create cron expression (only works for the exact time of the day)
    const cronExpression = `${reminderMinute} ${reminderHour} * * *`; // This schedules the task at the reminder time every day

    // Schedule the reminder task using node-cron
    cron.schedule(cronExpression, async () => {
      const reminderOptions = {
        from: process.env.EMAIL,
        to: client.email,
        subject: `Reminder: Upcoming ${sessionType} Session`,
        text: `Dear ${client.name},\n\nThis is a reminder for your ${sessionType} session scheduled for ${new Date(utcDate).toLocaleString()}.\n\nThank you,\nYour Wellness Team`,
      };

      await transporter.sendMail(reminderOptions);
    });

    res.status(201).json({ message: 'Session scheduled successfully', session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error scheduling session' });
  }
};

module.exports = { scheduleSession };
