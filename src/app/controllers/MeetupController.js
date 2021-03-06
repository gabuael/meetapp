import * as Yup from 'yup';
import {
  isBefore,
  parseISO,
  startOfMinute,
  startOfDay,
  endOfDay,
} from 'date-fns';
import { Op } from 'sequelize';

import Meetup from '../models/Meetup';
import User from '../models/User';

class MeetupController {
  async index(req, res) {
    const { date, page } = req.query;

    const parsedDate = parseISO(date);

    const meetups = await Meetup.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
      offset: 10 * (page - 1),
      limit: 10 * page,
      attributes: ['titulo', 'descricao', 'date', 'banner', 'url'],
      include: [
        {
          model: User,
          attributes: ['id', 'email'],
        },
      ],
    });

    return res.json(meetups);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string().required(),
      descricao: Yup.string().required(),
      localizacao: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const hoursStart = startOfMinute(parseISO(req.body.date));

    if (isBefore(hoursStart, new Date())) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    const checkAvailability = await Meetup.findOne({
      where: {
        user_id: req.userId,
        date: hoursStart,
      },
    });

    if (checkAvailability) {
      return res.status(400).json({ error: 'Horário não disponivel' });
    }

    const { titulo, descricao, localizacao, date } = await Meetup.create({
      ...req.body,
      user_id: req.userId,
    });

    return res.json({ titulo, descricao, localizacao, date });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      titulo: Yup.string(),
      descricao: Yup.string(),
      localizacao: Yup.string(),
      date: Yup.date(),
    });
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro na validação' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'O usuário não é o organizador desse meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'O meetup não pode mais ser alterda, devido ao horário',
      });
    }

    const hoursStart = startOfMinute(parseISO(req.body.date));

    if (isBefore(hoursStart, new Date())) {
      return res.status(400).json({ error: 'Data inválida' });
    }

    const { titulo, descricao, localizacao, date } = await meetup.update(
      req.body
    );

    return res.json({
      titulo,
      descricao,
      localizacao,
      date,
      id: req.params.id,
    });
  }

  async delete(req, res) {
    const meetup = await Meetup.findByPk(req.params.id);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'O usuário não é o organizador desse meetup' });
    }

    if (isBefore(meetup.date, new Date())) {
      return res.status(400).json({
        error: 'O meetup não pode mais ser cancelado, devido ao horário',
      });
    }

    await meetup.destroy();
    return res.json({ ok: 'Meetup deletado' });
  }
}

export default new MeetupController();
