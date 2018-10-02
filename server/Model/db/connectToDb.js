import { Pool } from 'pg';
import config from '../../Config';

let pool;

/** Check if DATABASE_URL environment variable is set. (used for production) */
if (process.env.DATABASE_URL) {
  pool = new Pool({ connectionString: process.env.DATABASE_URL });
}

/** Check if node environment is set to development. (used for development) */
if (process.env.NODE_ENV === 'development') {
  pool = new Pool(config);
}

/** Check if node environment is set to test. (used for testing) */
if (process.env.NODE_ENV === 'test') {
  pool = new Pool(config);
}

const poolConnection = pool;

export default poolConnection;
