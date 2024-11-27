const asyncHandler=require('express-async-handler')
const Chat= require('../modals/chatModels')
const Message=require('../modals/messageModel')
const User=require('../modals/userModals')

const allMessages=asyncHandler(async(req,res)=>{

    try {
        const messages= await Message.find({chat:req.params.chatId})
        .populate("sender","name email")
        .populate("receiver")
        .populate("chat")
        res.json(messages)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}

)

const sendMessage=asyncHandler(async(req,res)=>{
    const {content,chatId}=req.body;
    if (!content || !chatId) {
        return res.sendStatus(400)
    }
    var newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    };
        try {
            var message= await Message.create(newMessage)
         
            message=await message.populate("sender","name")
            message=await message.populate("chat")
            message=await message.populate("receiver")
            message=await message.populate(message,{
               path:"chat.users" ,
               select:"name email"
            })
          
          await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message})
          res.json(message)
          
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
   
    )



    module.exports={
        allMessages,
        sendMessage

    }