
import orderModel from '../Model';

const getOrder = (orderId) => {
  const result = orderModel.find(order => order.id === parseInt(orderId, 10));
  return result;
};

export default getOrder;
