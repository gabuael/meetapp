import Meetup from '../models/Meetup';

class MyMeetupController {
  async index(req, res) {
    const meetups = await Meetup.findAll({
      where: { user_id: req.userId },
      order: ['date'],
    });
    return res.json(meetups);
  }
}

export default new MyMeetupController();
