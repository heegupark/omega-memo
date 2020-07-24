require('dotenv/config');
require('./db/mongoose');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const express = require('express');
const app = express();
const Pin = require('./models/pin');
app.use(staticMiddleware);
app.use(express.json());
// for socket communication
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);
app.use(function (req, res, next) {
  req.io = io;
  next();
});
io.on('connection', socket => {
  socket.on('disconnect', () => {
    // eslint-disable-next-line no-console
    console.log('Client disconnected');
  });
});
// GETTING PINS
app.get('/api/pin', async (req, res) => {
  try {
    const pin = await Pin.find();
    if (!pin) {
      return res.status(400).json({ success: false, message: 'failed to find a pin' });
    }
    return res.status(200).json({ success: true, data: pin });
  } catch (e) {
    return res.status(400).json(e);
  }
});
// ADDING A PIN
app.post('/api/pin', async (req, res) => {
  const pin = new Pin({
    ...req.body
  });
  try {
    await pin.save();
    req.io.sockets.emit('pins', { status: 'add', data: pin });
    return res.status(200).json({ success: true, data: pin });
  } catch (e) {
    return res.status(400).json(e);
  }
});
// DELETING A PIN
app.delete('/api/pin/', async (req, res) => {
  const { _id } = req.body;
  try {
    const pin = await Pin.findOneAndDelete({ _id });
    if (!pin) {
      return res.status(404).json({ success: false, message: 'failed to find a pin' });
    }
    req.io.sockets.emit('pins', { status: 'delete', data: pin });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
// UPDATING A PIN
app.patch('/api/pin/', async (req, res) => {
  const updates = Object.keys(req.body);
  const { _id } = req.body;
  try {
    const pin = await Pin.findOne({ _id });
    if (!pin) {
      return res.status(404).json({ success: false, message: 'failed to find a pin' });
    }
    updates.forEach(update => {
      pin[update] = req.body[update];
    });
    await pin.save();
    req.io.sockets.emit(`pin-${_id}`, { status: 'update', data: pin });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
// for error handling
app.use((err, req, res, next) => {
  if (err instanceof ClientError) {
    res.status(err.status).json({ error: err.message });
  } else {
    console.error(err);
    res.status(500).json({
      error: 'an unexpected error occurred'
    });
  }
});
server.listen(process.env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log('[http] Server listening on port', process.env.PORT);
});
