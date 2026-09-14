import SupportTicket from '../models/SupportTicket.js';
import { uploadToR2 } from '../utils/r2Storage.js';
import path from 'path';

export const getTickets = async (req, res, next) => {
  try {
    let filters = {};

    // If not admin, show only tickets where user is sender or assignedTo
    if (!['SUPER_ADMIN', 'ADMIN'].includes(req.user.role)) {
      filters = {
        $or: [
          { sender: req.user.id },
          { assignedTo: req.user.id }
        ]
      };
    }

    const tickets = await SupportTicket.find(filters)
      .populate('sender', 'name designation profilePicture')
      .populate('assignedTo', 'name designation profilePicture')
      .populate('replies.sender', 'name designation profilePicture')
      .sort('-updatedAt');

    res.status(200).json({ success: true, data: tickets });
  } catch (err) {
    next(err);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const ticketData = {
      ...req.body,
      sender: req.user.id
    };

    if (req.file) {
      const fileName = `support/ticket-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);

      if (publicUrl) {
        ticketData.attachment = {
          url: publicUrl,
          fileName: req.file.originalname,
          storageKey: fileName
        };
      }
    }

    const ticket = await SupportTicket.create(ticketData);
    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

export const updateTicketStatus = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });
    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

export const replyToTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found' });

    const reply = {
      sender: req.user.id,
      message: req.body.message
    };

    if (req.file) {
      const fileName = `support/reply-${Date.now()}${path.extname(req.file.originalname)}`;
      const publicUrl = await uploadToR2(req.file.buffer, fileName, req.file.mimetype);

      if (publicUrl) {
        reply.attachment = {
          url: publicUrl,
          fileName: req.file.originalname
        };
      }
    }

    ticket.replies.push(reply);
    await ticket.save();

    const updatedTicket = await SupportTicket.findById(req.params.id)
      .populate('sender', 'name designation profilePicture')
      .populate('assignedTo', 'name designation profilePicture')
      .populate('replies.sender', 'name designation profilePicture');

    res.status(200).json({ success: true, data: updatedTicket });
  } catch (err) {
    next(err);
  }
};
