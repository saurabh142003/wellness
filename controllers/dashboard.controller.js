const Client = require('../models/client.model.js');
const User = require('../models/user.model.js');
const Session = require('../models/session.model.js');
const NodeCache = require('node-cache');

// Initialize cache with a 5-minute TTL (time-to-live)
const cache = new NodeCache({ stdTTL: 300, checkperiod: 60 });

// Controller to get the admin dashboard data
const getAdminDashboard = async (req, res) => {
  try {
    // Check if the data is in cache
    const cachedData = cache.get('adminDashboard');
    if (cachedData) {
      return res.status(200).json(cachedData); // Return cached data if available
    }

    // 1. Total number of clients
    const totalClients = await Client.countDocuments();

    // 2. Number of active clients (clients with at least one future session)
    const activeClients = await Client.aggregate([
        {
          $lookup: {
            from: 'sessions',
            localField: '_id',
            foreignField: 'clientId',
            as: 'sessions'
          }
        },
        { $unwind: '$sessions' }, // Unwind to flatten sessions array
        { $match: { 'sessions.date': { $gte: new Date() } } }, // Filter for future sessions
        {
          $group: {
            _id: '$clientId',  // Group by clientId to avoid counting multiple sessions for the same client
          }
        },
        { $count: 'activeClients' }  // Count the number of distinct clients
      ]);
      
      const activeClientsCount = activeClients.length > 0 ? activeClients[0].activeClients : 0;

    // 3. Number of coaches and average clients per coach
    const totalCoaches = await User.countDocuments({ role: 'coach' });
    const avgClientsPerCoach = totalCoaches ? totalClients / totalCoaches : 0;

    // 4. Clients' progress trends (e.g., average weight change)
    const clientProgress = await Client.aggregate([
        { $unwind: '$progress' },
        {
          $group: {
            _id: '$coachId',
            avgWeight: { $avg: '$progress.weight' }, // Calculate the average weight
          }
        }
      ]);
      

    // Prepare the data to send in the response
    const dashboardData = {
      totalClients,
      activeClients: activeClientsCount,
      totalCoaches,
      avgClientsPerCoach,
      clientProgress
    };

    // Cache the data for future requests
    cache.set('adminDashboard', dashboardData);

    res.status(200).json(dashboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
};

module.exports = { getAdminDashboard };
