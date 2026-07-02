import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice';
import messageReducer from '../features/message/messageSlice';
import socketReducer from '../features/socket/socketSlice';
import onlineReducer from '../features/online/onlineSlice';  
import chatReducer from '../features/chat/chatSlice'

export default configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    socket: socketReducer,
    online: onlineReducer,  
    chat: chatReducer
  },
});
                                             