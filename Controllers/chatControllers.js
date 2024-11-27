const asyncHandler=require('express-async-handler')
const Chat= require('../modals/chatModels')
const User=require('../modals/userModals')

const accesschat=asyncHandler(async(req,res)=>{
const {userId}=req.body;
if (!userId) {
    console.log('UserId params is not send with request')
    return res.sendStatus(400)
}
var isChat=await Chat.find({
    isGroupChat:false,
    $and:[
        {users:{$elemMacth:{$eq:req.user._id}}},
        {users:{$elemMacth:{$eq:userId}}}
    ]
})
.populate("users","-passwords")
.populate("latestMessage")
isChat=await User.populate(isChat,{
    path:"latestMessage.sender",
    select:"name email"
})

if(isChat.length>0){
   res.send(isChat[0])
}else{
    var chatData={
        chatName:"sender",
        isGroupChat:false,
        users:[req.user._id,userId]
    }

    try {
        const createdChat= await Chat.create(chatData);
        const fullchat=await Chat.findOne({_id:createdChat._id}).then("users","-password");
        res.status(200).json(fullchat)
    } catch (error) {
        res.status(400)
        throw new Error(error.message)
    }
}
}
)

const fecthChats=asyncHandler(async(req,res)=>{
        try {
          Chat.find({users:{$elemMacth:{$eq:req.user._id}}})
          .populate("users","-password")
          .populate("groupAdmin","-password")
          .populate("latestMessage")
          .sort("updatedAt:-1")
          .then(async(results)=>{
            results=await User.populate(results,{
               path:"latestMessage.sender",
               select:"name email"
            })
            res.status(200).send(results)
          })
          
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
   
    )

 const fecthGroups=asyncHandler(async(req,res)=>{
        try {
         const allGroups= await Chat.where("isGroupChat").equals(true);
         res.status(200).json(allGroups)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
   
    )

const createGroupChat=asyncHandler(async(req,res)=>{
        if (!req.body.users || !req.body.name) {
            return res.status(400).send({message:"Data is insufficient"})
        }

        var users=JSON.parse(req.body.users)
        console.log("create Groups",req)
        users.push(req.user);
        try {
         const groupChat= await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user
         });

         const FullgroupChat=await Chat.findOne({_id:groupChat._id})
         .populate("users","-password")
         .populate("groupAdmin","-password")
        
         res.status(200).json(FullgroupChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message)
        }
    }
   
    )

    const GroupExit = asyncHandler(async (req, res) => {
        const { chatId, userId } = req.body;
      
        if (!chatId || !userId) {
          return res.status(400).send({ message: "chatId et userId sont requis." });
        }
      
        try {
          const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
              $pull: { users: userId }, // Supprime l'utilisateur du groupe
            },
            { new: true } // Retourne le document mis à jour
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
      
          if (!updatedChat) {
            res.status(404);
            throw new Error("Le chat n'a pas été trouvé.");
          }
      
          res.status(200).json(updatedChat);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      });
      

      const addSelfToGroup = asyncHandler(async (req, res) => {
        const { chatId, userId } = req.body;
      
        if (!chatId || !userId) {
          return res.status(400).send({ message: "chatId et userId sont requis." });
        }
      
        try {
          const updatedChat = await Chat.findByIdAndUpdate(
            chatId,
            {
              $addToSet: { users: userId }, // Ajoute uniquement si l'utilisateur n'est pas déjà présent
            },
            { new: true } // Retourne le document mis à jour
          )
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
      
          if (!updatedChat) {
            res.status(404);
            throw new Error("Le chat n'a pas été trouvé.");
          }
      
          res.status(200).json(updatedChat);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      });
      
    module.exports={
        accesschat,
        fecthChats,
        fecthGroups,
        createGroupChat,
        GroupExit,
        addSelfToGroup

    }