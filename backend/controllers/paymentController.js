import { handlePayment, fetchPaymentStatus } from '../services/paymentService.js';

export const processPayment = async (req, res, next) => {
  try {
    const result = await handlePayment(req.body, req.headers);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export const getPaymentStatus = async (req, res, next) => {
  try {
    const result = await fetchPaymentStatus(req.params.id, req.headers);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};