import dotenv from 'dotenv';
dotenv.config();

import connectDB from '../config/database.js';
import { User } from '../models/index.js';
import logger from '../config/logger.js';

const seedUsers = [
  {
    name: 'Admin User',
    email: 'admin@company.com',
    password: 'admin123',
    role: 'admin',
    department: 'Administration'
  },
  {
    name: 'John Manager',
    email: 'manager@company.com',
    password: 'manager123',
    role: 'manager',
    department: 'Engineering'
  },
  {
    name: 'Alice Employee',
    email: 'alice@company.com',
    password: 'employee123',
    role: 'employee',
    department: 'Engineering'
  },
  {
    name: 'Bob Employee',
    email: 'bob@company.com',
    password: 'employee123',
    role: 'employee',
    department: 'Engineering'
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    logger.info('Connected to database');

    await User.deleteMany({});
    logger.info('Cleared existing users');

    const createdUsers = await User.insertMany(seedUsers);
    logger.info(`Seeded ${createdUsers.length} users`);

    const manager = createdUsers.find(u => u.role === 'manager');
    
    if (manager) {
      await User.updateMany(
        { role: 'employee', _id: { $ne: manager._id } },
        { managerId: manager._id }
      );
      logger.info('Assigned manager to employees');
    }

    logger.info('Database seeding completed successfully');
    process.exit(0);
  } catch (error) {
    logger.error(`Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
