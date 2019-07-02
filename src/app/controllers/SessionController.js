import jwt from 'jsonwebtoken';

import User from '../models/User';

class SessionController {
  async store(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha errados' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Email ou senha errados' });
    }

    const { id } = user;

    return res.json({
      user: {
        id,
      },
      token: jwt.sign({ id }, 'bc3e6a8814670821c5b0d01b98b4e5bf', {
        expiresIn: '7d',
      }),
    });
  }
}

export default new SessionController();
