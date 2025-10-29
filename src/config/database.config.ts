import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  mysql: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mydb',
  },
  postgres: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mydb',
  },
  mongo: {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydb',
  },
}));

export interface DatabaseConfig {
  mysql: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  postgres: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  mongo: {
    uri: string;
  };
}

// Optional: separate types for convenience
export type MysqlConfig = DatabaseConfig['mysql'];
export type PostgresConfig = DatabaseConfig['postgres'];
export type MongoConfig = DatabaseConfig['mongo'];
