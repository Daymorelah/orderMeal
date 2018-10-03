
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import jsend from 'jsend';
import cors from 'cors';
import path from 'path';
import routes from './Routes';
import expressError from './Utilities/validateInputs';

const PORT = process.env.PORT || 2022;
const app = express();

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(jsend.middleware);
app.use(cors());
app.use('/docs', express.static(path.resolve(`${__dirname}`, '../apiDocs')));
app.use('/public', express.static(path.resolve(`${__dirname}`, '../client/html')));
app.use('/asset', express.static(path.resolve(`${__dirname}`, '../client/css')));
app.use('/images', express.static(path.resolve(`${__dirname}`, '../client/images')));

routes(app);

// Catch all invalid routes
app.all('*', (req, res) => {
  res.status(404).jsend.error({
    code: 404,
    message: 'Page not found',
  });
});

app.use(expressError.checkExpressErrors);

app.listen(PORT, (error) => {
  if (error) {
    console.log(`An error occurred try to start the sever. Error is ${error}`);
  } else {
    console.log(`Server is up and running on port ${PORT} ...`);
  }
});

export default app;
