import mongoose from "mongoose";

 const chatSchema = new mongoose.Schema({
  
     isGroupChat: {
       type: Boolean,
       default: false
     },

     chatName: {
       type: String,
       default: "Chat"
     },

     participants: [
      {
         type: mongoose.Schema.Types.ObjectId, 
         ref: "User", 
         required: true
      }
     ],

     latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
     },

     groupAdmin: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User"
     },

}, {timestamps: true});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;4