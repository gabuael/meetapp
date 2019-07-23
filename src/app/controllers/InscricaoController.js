import { isBefore } from 'date-fns';
import Meetup from '../models/Meetup';
import Inscricao from '../models/Inscricao';

class InscricaoController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.body.meetup_id);
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

    return res.json(inscricao);
  }
}

export default new InscricaoController();
