import { Model } from 'sequelize';

class Inscricao extends Model {
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
        modelName: 'inscricoes',
      }
    );
  }

  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'inscrito_id' });
  }
}

export default Inscricao;
