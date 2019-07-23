import Meetup from '../models/Meetup';

class BannerController {
  async store(req, res) {
    const meetup = await Meetup.findByPk(req.params.meetupid);

    if (!meetup) {
      return res.status(400).json({ error: 'Meetup não existe' });
    }

    if (meetup.user_id !== req.userId) {
      return res
        .status(400)
        .json({ error: 'O usuário não é o organizador desse meetup' });
    }

    meetup.banner = req.file.filename;

    await meetup.save();

    return res.json({ url: meetup.url });
  }
}

export default new BannerController();
