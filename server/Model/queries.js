const queries = {
  signup: 'INSERT INTO users (username, password, email) VALUES($1,$2,$3) RETURNING *',
};

export default queries;
