
import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import passport from 'passport';
import dotenv from 'dotenv';
import jsend from 'jsend';
import cors from 'cors';
import path from 'path';
import routes from './Routes';
import expressError from './Utilities/validateInputs';
import './strategies';

dotenv.config();

const PORT = process.env.PORT || 2022;
const app = express();

if (app.get('env') !== 'test') {
  app.use(logger('dev'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(jsend.middleware);
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  methods: 'GET,HEAD,PUT,POST,DELETE',
  credentials: true,
  exposedHeaders: process.env.CORS_EXPOSED_HEADERS,
}));

app.use('/docs', express.static(path.resolve(`${__dirname}`, '../apiDocs')));
app.use('/public', express.static(path.resolve(`${__dirname}`, '../client/html')));
app.use('/public/asset', express.static(path.resolve(`${__dirname}`, '../client/css')));
app.use('/public/images', express.static(path.resolve(`${__dirname}`, '../client/images')));
app.use('/public/js', express.static(path.resolve(`${__dirname}`, '../client/js')));

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
    console.info(`An error occurred try to start the sever. Error is ${error}`); //eslint-disable-line
  } else {
    console.info(`Server is up and running on port ${PORT} ...`); //eslint-disable-line
  }
});

export default app;
