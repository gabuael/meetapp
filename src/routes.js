import { Router } from 'express';

const routes = new Router();

routes.get('/', (req, res) => {
  res.json({ ok: '22' });
});

export default routes;
