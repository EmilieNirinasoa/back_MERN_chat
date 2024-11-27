const asyncHandler=require('express-async-handler')
const Chat= require('../modals/chatModels')
const User=require('../modals/userModals')

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: 'UserId non fourni.' });
    }
  
    try {
      let isChat = await Chat.find({
        isGroupChat: false,
        users: { $all: [req.user._id, userId] },
      })
        .populate('users', '-password')
        .populate('latestMessage');
  
      isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',
        select: 'name email',
      });
  
      if (isChat.length > 0) {
        res.status(200).json(isChat[0]);
      } else {
        const chatData = {
          chatName: 'sender',
          isGroupChat: false,
          users: [req.user._id, userId],
        };
  
        const createdChat = await Chat.create(chatData);
  
        const fullChat = await Chat.findById(createdChat._id)
          .populate('users', '-password')
          .populate('latestMessage');
        
        res.status(200).json(fullChat);
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  const fetchChats = asyncHandler(async (req, res) => {
    try {
      const chats = await Chat.find({ users: { $in: [req.user._id] } })
        .populate('users', '-password')
        .populate('groupAdmin', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 });
  
      const results = await User.populate(chats, {
        path: 'latestMessage.sender',
        select: 'name email',
      });
  
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  const fetchGroups = asyncHandler(async (req, res) => {
    try {
      const groups = await Chat.find({ isGroupChat: true }).populate('users', '-password');
      res.status(200).json(groups);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  const createGroupChat = asyncHandler(async (req, res) => {
    const { users, name } = req.body;
  
    if (!users || !name) {
      return res.status(400).json({ message: 'Les données sont insuffisantes.' });
    }
  
    const parsedUsers = JSON.parse(users);
    parsedUsers.push(req.user);
  
    try {
      const groupChat = await Chat.create({
        chatName: name,
        users: parsedUsers,
        isGroupChat: true,
        groupAdmin: req.user,
      });
  
      const fullGroupChat = await Chat.findById(groupChat._id)
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
  
      res.status(201).json(fullGroupChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  

  const groupExit = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    if (!chatId || !userId) {
      return res.status(400).json({ message: 'chatId et userId sont requis.' });
    }
  
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
  
      if (!updatedChat) {
        return res.status(404).json({ message: 'Le chat n\'a pas été trouvé.' });
      }
  
      res.status(200).json(updatedChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
      

  const addSelfToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
  
    if (!chatId || !userId) {
      return res.status(400).json({ message: 'chatId et userId sont requis.' });
    }
  
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        { $addToSet: { users: userId } },
        { new: true }
      )
        .populate('users', '-password')
        .populate('groupAdmin', '-password');
  
      if (!updatedChat) {
        return res.status(404).json({ message: 'Le chat n\'a pas été trouvé.' });
      }
  
      res.status(200).json(updatedChat);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
      
  module.exports = {
    accessChat,
    fetchChats,
  fetchGroups,
  createGroupChat,
  groupExit,
  addSelfToGroup,
};
