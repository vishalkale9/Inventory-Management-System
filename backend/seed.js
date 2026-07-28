import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database connected successfully.');

    // Check if default admin user already exists
    const adminEmail = 'admin@test.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      console.log(`Default admin user (${adminEmail}) already exists. Seeding skipped.`);
    } else {
      console.log('Creating default admin user...');
      await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Default admin user created successfully.');
      console.log(`Email: ${adminEmail}`);
      console.log('Password: Admin@123');
    }

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed. Seeding process complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDatabase();
