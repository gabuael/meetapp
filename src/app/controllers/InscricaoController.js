import { isBefore } from 'date-fns';
import { Op, Sequelize } from 'sequelize';

import Meetup from '../models/Meetup';
import Inscricao from '../models/Inscricao';
import User from '../models/User';
import Queue from '../../lib/Queue';
import InscricaoMail from '../jobs/InscricaoMail';

class InscricaoController {
  async index(req, res) {
    const inscricoes = await Inscricao.findAll({
      where: { inscrito_id: req.userId },
      attributes: ['id'],
      include: [
        {
          model: Meetup,
          where: {
            date: { [Op.gte]: new Date() },
          },
          attributes: ['id', 'titulo', 'descricao', 'date', 'banner', 'url'],
          include: [
            {
              model: User,
              attributes: ['email'],
            },
          ],
        },
      ],
      order: [Sequelize.col('date')],
    });
    return res.json(inscricoes);
  }

  async store(req, res) {
    const meetup = await Meetup.findByPk(req.body.meetup_id, {
      include: [{ model: User, attributes: ['email'] }],
    });
    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }

    if (meetup.user_id === req.userId) {
      return res
        .status(400)
        .json({ error: 'Você não pode se inscrever no seu proprio meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res
        .status(400)
        .json({ error: 'Esse meetup não está disponivel devido ao horario' });
    }

    const checkInscricao = await Inscricao.findOne({
      where: { meetup_id: req.body.meetup_id, inscrito_id: req.userId },
    });

    if (checkInscricao) {
      return res
        .status(400)
        .json({ error: 'Você já está inscrito nesse meetup' });
    }

    const checkDate = await Inscricao.findOne({
      where: { inscrito_id: req.userId },
      include: [
        {
          model: Meetup,
          required: true,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (checkDate) {
      return res
        .status(400)
        .json({ error: 'Você já está inscrito em um meetup nesse horario' });
    }

    const inscricao = await Inscricao.create({
      meetup_id: req.body.meetup_id,
      inscrito_id: req.userId,
    });

    const user = await User.findByPk(req.userId);

    await Queue.add(InscricaoMail.key, {
      user,
      meetup,
    });

    return res.json(inscricao);
  }
}

export default new InscricaoController();
