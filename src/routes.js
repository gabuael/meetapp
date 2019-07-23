import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import MeetupController from './app/controllers/MeetupController';
import MyMeetupController from './app/controllers/MyMeetupController';
import BannerController from './app/controllers/BannerController';
import InscricaoController from './app/controllers/InscricaoController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/session', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.delete('/meetups/:id', MeetupController.delete);

routes.get('/my-meetups', MyMeetupController.index);

routes.post(
  '/banners/:meetupid',
  upload.single('file'),
  BannerController.store
);

routes.post('/inscricoes', InscricaoController.store);

export default routes;
