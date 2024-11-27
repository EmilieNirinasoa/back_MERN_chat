const { accesschat,
    fecthChats,
    fecthGroups,
    createGroupChat,
    GroupExit } =require('../Controllers/chatControllers');
const {protect} =require('../middleware/authMiddleware')
const router=express.Router();
router.route('/').post(protect,accesschat);
router.route('/').get(protect,fecthChats);
router.route('/createGroup').post(protect,createGroupChat);
router.route('/fecthsGroup').get(protect,fecthGroups);
router.route('/groupExit').put(protect,GroupExit);
module.exports=router;