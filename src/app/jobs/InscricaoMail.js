import Mail from '../../lib/Mail';

class InscricaoMail {
  get key() {
    return 'InscricaoMail';
  }

  async handle({ data }) {
    const { meetup, user } = data;

    await Mail.sendMail({
      to: `Senhor <${meetup.User.email}>`,
      subject: 'Nova inscrição',
      text: `Usuario de email ${user.email} inscrito no seu meetup`,
    });
  }
}

export default new InscricaoMail();
