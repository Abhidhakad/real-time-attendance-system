import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
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

    
    for (let user of seedUsers) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    const createdUsers = await User.insertMany(seedUsers);
    logger.info(`Seeded ${createdUsers.length} users`);

    const manager = createdUsers.find(u => u.role === 'manager');
    const admin = createdUsers.find(u => u.role === 'admin');
    
    if (manager) {
      await User.updateMany(
        { _id: { $ne: manager._id } },
        { managerId: manager._id }
      );
      logger.info(`Assigned manager ${manager.email} to all non-manager users`);
    }

    logger.info('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    logger.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();