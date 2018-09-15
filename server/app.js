
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import jsend from 'jsend';
import routes from './Routes';

const PORT = process.env.PORT || 2022;
const app = express();

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsend.middleware);

routes(app);

// Catch all invalid routes
app.all('*', (req, res) => {
  res.status(404).jsend.error({
    code: 404,
    message: 'Page not found',
  });
});

app.listen(PORT, (error) => {
  if (error) {
    console.log(`An error occurred try to start the sever. Error is ${error}`);
  } else {
    console.log(`Server is up and runnig on port ${PORT} ...`);
  }
});

export default app;
