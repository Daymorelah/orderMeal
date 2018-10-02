import dotenv from 'dotenv';

dotenv.config();

/**
 * Represents database configuration for the
 * development and test environment
 * @constant
 * @type {object} - Configuration Object
 */
const dbConfigurations = {
  user: process.env.DB_CONFIG_USERNAME,
  host: process.env.DB_CONFIG_HOST,
  password: process.env.DB_CONFIG_PASSWORD,
  port: process.env.DB_CONFIG_PORT,
  max: process.env.DB_CONFIG_MAX,
  idleTimeoutMillis: process.env.DB_CONFIG_IDLE_TIMEOUT_MILLIS,
};

if (process.env.NODE_ENV === 'test') {
  dbConfigurations.database = process.env.DB_CONFIG_TEST_DATABASE;
} else {
  dbConfigurations.database = process.env.DB_CONFIG_DATABASE;
}

export default dbConfigurations;

