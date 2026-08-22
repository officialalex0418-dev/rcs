import SupportTicket from '../models/SupportTicket.js';

export const getTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find().populate('assignedTo replies.sender').sort('-createdAt');
    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.create(req.body);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

export const replyToTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    ticket.replies.push({
      sender: req.user.id,
      message: req.body.message
    });
    await ticket.save();
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};
