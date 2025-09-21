'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    outTradeNo: DataTypes.STRING,
    tradeNo: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    subject: DataTypes.STRING,
    totalAmount: DataTypes.DECIMAL,
    paymentMethod: DataTypes.TINYINT,
    status: DataTypes.TINYINT,
    paidAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};