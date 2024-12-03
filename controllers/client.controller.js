
const Client = require('../models/client.model.js');
const User = require('../models/user.model.js');

const createClient = async (req, res) => {
  try {
    const { name, email, phone, age, goal } = req.body;

    // Determine the coachId based on user role
    let coachId;
    if (req.user.role === 'coach') {
      // Automatically assign the logged-in coach as the coach for the client
      coachId = req.user.id;
    } else if (req.user.role === 'admin') {
      // Admin must provide a coachId manually
      coachId = req.body.coachId;
      if (!coachId) {
        return res.status(400).json({ message: 'Coach ID is required for admin role' });
      }
    } else {
      return res.status(403).json({ message: 'Unauthorized role for creating clients' });
    }

    // Create and save the new client
    const client = new Client({
      name,
      email,
      phone,
      age,
      goal,
      coachId,
    });

    await client.save();

    // Send success response
    return res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    // Handle and log errors
    console.error('Error creating client:', error);
    return res.status(500).json({ message: 'Failed to create client', error: error.message });
  }
};

const getClients = async (req, res) => {
    const coachId = req.params.coachId;
    const clients = await Client.find({ coachId});
  console.log(clients)
    res.status(200).json({ clients });
  };

  const updateClientProgress = async (req, res) => {
    try {
      const { progressNotes, weight, bmi } = req.body;
      const clientId = req.params.id;
  
      // Find the client by ID
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      // Check if the logged-in coach is the assigned coach for this client
      if (client.coachId.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Not authorized to update this client' });
      }
  
      // Automatically set the current date and time as 'lastUpdated'
      const currentDateTime = new Date();
  
      // Update progress information
      client.progress.push({
        progressNotes,
        lastUpdated: currentDateTime, // Automatically set the current date and time
        weight,
        bmi,
      });
  
      // Save the updated client
      await client.save();
  
      res.status(200).json({
        message: 'Progress updated successfully',
        progress: client.progress,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating client progress' });
    }
  };

  const deleteClient = async (req, res) => {
    try {
      const clientId = req.params.id;
  
      // Find and delete the client by ID
      const client = await Client.findById(clientId);
  
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }
  
      // Delete the client
      await client.remove();
  
      res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting client' });
    }
  };

module.exports = { createClient ,getClients ,updateClientProgress ,deleteClient};
