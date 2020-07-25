require('dotenv/config');
require('./db/mongoose');
const staticMiddleware = require('./static-middleware');
const ClientError = require('./client-error');
const express = require('express');
const app = express();
const Memo = require('./models/memo');
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
// GETTING MEMOS
app.get('/api/memo', async (req, res) => {
  try {
    const memo = await Memo.find();
    if (!memo) {
      return res.status(400).json({ success: false, message: 'failed to find a memo' });
    }
    return res.status(200).json({ success: true, data: memo });
  } catch (e) {
    return res.status(400).json(e);
  }
});
// ADDING A MEMO
app.post('/api/memo', async (req, res) => {
  const memo = new Memo({
    ...req.body
  });
  try {
    await memo.save();
    req.io.sockets.emit('memos', { status: 'add', data: memo });
    return res.status(200).json({ success: true, data: memo });
  } catch (e) {
    return res.status(400).json(e);
  }
});
// DELETING A MEMO
app.delete('/api/memo', async (req, res) => {
  const { _id } = req.body;
  try {
    const memo = await Memo.findOneAndDelete({ _id });
    if (!memo) {
      return res.status(404).json({ success: false, message: 'failed to find a memo' });
    }
    req.io.sockets.emit('memos', { status: 'delete', data: memo });
    return res.status(201).json({ success: true });
  } catch (e) {
    return res.status(400).json({ success: false, message: e.message });
  }
});
// UPDATING A MEMO
app.patch('/api/memo', async (req, res) => {
  const updates = Object.keys(req.body);
  const { _id } = req.body;
  try {
    const memo = await Memo.findOne({ _id });
    if (!memo) {
      return res.status(404).json({ success: false, message: 'failed to find a memo' });
    }
    updates.forEach(update => {
      memo[update] = req.body[update];
    });
    await memo.save();
    req.io.sockets.emit(`memo-${_id}`, { status: 'update', data: memo });
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
