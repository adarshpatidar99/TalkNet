import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from '../middlewares/error.middleware.js'

export const voiceUpload = catchAsyncError(async(req, res, next) => {
  console.log("Files received:", req.files);
      if (!req.files || !req.files.audio) {
 
          return next(new ErrorHandler("No audio uploaded", 400));
      }

      const audioFile = req.files.audio;

      const result = await cloudinary.uploader.upload(audioFile.tempFilePath, {
          resource_type: "video",
          folder: "voice_messages"
      })

      if(!result) {
        return next(new ErrorHandler("failed to upload audio on cloudinary", 400));
      }

      return res.status(200).json({
        success: true,
        url: result.secure_url   
      })

});

// export const voiceUpload = catchAsyncError(async (req, res, next) => {
//   console.log("FILES:", req.files);

//   if (!req.files || !req.files.audio) {
//     return next(new ErrorHandler("No audio uploaded", 400));
//   }

//   const audioFile = req.files.audio;

//   console.log("TEMP PATH:", audioFile.tempFilePath); // 🔍

//   const result = await cloudinary.uploader.upload(
//     audioFile.tempFilePath,
//     {
//       resource_type: "video",
//       folder: "voice_messages",
//     }
//   );

//   return res.status(200).json({
//     success: true,
//     url: result.secure_url,
//   });
// });


// export const videoUpload = catchAsyncError(async (req, res, next) => {

//     if (!req.files || !req.files.video) {
//       return next(new ErrorHandler("No video uploaded", 400));
//     }

//     const videoFile = req.files.video;

//     const result = await cloudinary.v2.uploader.upload(
//       videoFile.tempFilePath,
//       {
//         resource_type: "video",
//         folder: "video_messages",
//       }
//     );

//     if (!result || !result.secure_url) {
//       return next(new ErrorHandler("Failed to upload video on Cloudinary", 400));
//     }

//     return res.status(200).json({
//       success: true,
//       url: result.secure_url,
//     });

// });


export const videoUpload = catchAsyncError(async (req, res, next) => {

    if (!req.files || !req.files.video) {
      return next(new ErrorHandler("No video uploaded", 400));
    }

    const videoFile = req.files.video;

    const result = await cloudinary.uploader.upload(
      videoFile.tempFilePath,
      {
        resource_type: "video",       // ✅ required for videos
        folder: "video_messages",     // folder on Cloudinary
      }
    );

    if (!result || !result.secure_url) {
      return next(new ErrorHandler("Failed to upload video on Cloudinary", 400));
    }

    return res.status(200).json({
      success: true,
      url: result.secure_url,        // ✅ frontend will get this URL
    });
                             
});




export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const { messageId } = req.params;

  if (!messageId) {
    return next(new ErrorHandler("Message ID is required", 400));
  }

  const deletedMessage = await Message.findByIdAndDelete(messageId);

  if (!deletedMessage) {
    return next(new ErrorHandler("Message not found", 404));
  }                                                               

  return res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    deletedMessage,
  });
});




// export const imageUpload = catchAsyncError(async (req, res, next) => {

//   if (!req.files || !req.files.image) {
//     return next(new ErrorHandler("No image uploaded", 400));
//   }

//   const imageFile = req.files.image;

//   // ✅ Validate file type
//   if (!imageFile.mimetype.startsWith("image/")) {
//     return next(new ErrorHandler("Only image files allowed", 400));
//   }

//   // ✅ Upload to Cloudinary
//   const result = await cloudinary.v2.uploader.upload(
//     imageFile.tempFilePath,
//     {
//       resource_type: "image",
//       folder: "image_messages",
//     }
//   );

//   // ✅ Success response
//   res.status(200).json({
//     success: true,
//     url: result.secure_url,
//     public_id: result.public_id,
//   });
// });

// export const imageUpload = catchAsyncError(async (req, res, next) => {
//   console.log("🟡 IMAGE UPLOAD REQUEST RECEIVED");
//   console.log("🟡 REQ.FILES:", req.files);

//   if (!req.files || !req.files.image) {
//     console.log("❌ No image file found in request");
//     return next(new ErrorHandler("No image uploaded", 400));
//   }

//   const imageFile = req.files.image;
//   console.log("🟡 IMAGE FILE OBJECT:", imageFile);

//   // Validate file type
//   if (!imageFile.mimetype.startsWith("image/")) {
//     console.log("❌ Invalid file type:", imageFile.mimetype);
//     return next(new ErrorHandler("Only image files allowed", 400));
//   }

//   console.log("🟡 Uploading image to Cloudinary...");
//   try {
//     const result = await cloudinary.v2.uploader.upload(
//       imageFile.tempFilePath,
//       {
//         resource_type: "image",
//         folder: "image_messages",
//       }
//     );

//     console.log("✅ Image uploaded successfully:", result.secure_url);

//     res.status(200).json({
//       success: true,
//       url: result.secure_url,
//       public_id: result.public_id,
//     });
//   } catch (err) {
//     console.error("❌ Cloudinary upload failed:", err);
//     return next(new ErrorHandler("Image upload failed", 500));
//   }
// });



export const imageUpload = async (req, res) => {
  try {            
    console.log("🧪 req.files:", req.files);
    console.log("🧪 req.body:", req.body);
                  
    if (!req.files || !req.files.image) {
      console.log("❌ IMAGE NOT FOUND IN req.files");
      return res.status(400).json({ message: "No image file found" });
    }

    console.log("🧪 Image temp path:", req.files.image.tempFilePath);

    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { folder: "chat_images" }
    );

    console.log("🧪 Cloudinary result:", result.secure_url);

    return res.status(200).json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    console.error("❌ IMAGE UPLOAD ERROR:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};


export const updateMessage = catchAsyncError(async (req, res, next) => {

    const { messageId } = req.params;
    const { message } = req.body;

    if (!messageId || !message) {
      return next(new ErrorHandler("Message ID and new text required", 400));
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { message },
      { new: true }
    );

    if (!updatedMessage) {
      return next(new ErrorHandler("Message not found", 404));
    }

    const io = req.app.get("io");
    io.to(updatedMessage.roomId).emit("messageUpdated", updatedMessage);

    return res.status(200).json({
      success: true,
      message: "Message updated successfully",
      updatedMessage
    });

});




export const sendMessage = catchAsyncError(async (req, res, next) => {
  
    const { replyTo ,senderId, receiverId, content , image } = req.body;

    if (!senderId || !receiverId || !content ) {
      return next(new ErrorHandler("All fields are required", 400));
    }
                                  
    let imageUrl = "";

    if(image) {              
      const uploadImage = await cloudinary.v2.uploader.upload( 
        image, 
        { folder: "chat_images" } 
      )

      imageUrl = uploadImage.secure_url;
    }

    const message = await Message.create({
      senderId,
      receiverId,
      content,
      imageUrl,
      replyTo,
      status: "sent"
    });                            

    return res.status(201).json({ success: true, message });

});

 

// export const getMessage = catchAsyncError(async (req, res, next) => {
      
//     const { senderId, receiverId } = req.params;
    
//     if (!senderId || !receiverId ) {
//       return next(new ErrorHandler("receiverId and senderId is required", 400));
//     }
                
//     const messages = await Message.find({
//        $or: [
//          {senderId, receiverId},
//          {senderId: receiverId, receiverId: senderId}
//        ]
//     })
//     .populate("senderId", "name profilePic")
//     .populate({
//        path: "replyTo",
//       select: "content imageUrl senderId",
//       populate: {
//          path: "senderId",
//          select: "name profilePic",
//       },
//     })
//     .sort({ createdAt: 1});     
   
//     return res.status(200).json({ success: true, messages });

// });

 

export const getMessage = catchAsyncError(
  async (req, res) => {

    const { receiverId } = req.params;
    const senderId = req.user._id;         
    
    const messages = await Message.find({
        $or: [
          {senderId, receiverId},     
          { senderId: receiverId, receiverId: senderId},
        ]
    }).populate("senderId", "name profilePic")
    .sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages,
    });
  }
);



export const getGroupMessage = catchAsyncError ( 
  async (req, res) => { 

  const { chatId } = req.params;
  
  const messages = await Message.find({
    chatId,    
  })

  .populate("senderId", "name profilePic")
  .sort({ createdAt: 1 });

  return res.status(200).json({
    success: true,
    messages
  })

}) 





export const updatedMessageStatus = catchAsyncError(async (req, res, next) => {

    const { messageId } = req.params;
    const { status } = req.body;

    if (!messageId || !status) {
      return next(new ErrorHandler("Message ID and status are required", 400));
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      messageId,
      { status },
      { new: true }
    );

    if (!updatedMessage) {
      return next(new ErrorHandler("Message not found", 404));
    }

    const io = req.app.get("io");
    io.to(updatedMessage.roomId).emit("messageStatusUpdated", updatedMessage);

    return res.status(200).json({
      success: true,
      message: "Message status updated successfully",
      updatedMessage,
    });

});



export const videoMessageSave = catchAsyncError(async(req, res, next) => {

       const { senderId, receiverId, type, videoUrl } = req.body; 
       
       if( !senderId || !receiverId || !type || !videoUrl ) { 
        return next(new ErrorHandler("can't able to save message, missing field", 400));
       }

       const newMessage = await Message.create({          
            senderId,                                 
            receiverId, 
            type, 
            videoUrl,      
            status: "sent",
            timestamp: new Date()                      
       })

       return res.status(200).json({
        success: true,
        message: newMessage
       })

});



export const messageSave = catchAsyncError(async(req, res, next) => {

  const { senderId, receiverId, text, imageUrl, videoUrl, audioUrl } = req.body;

  const type =
    imageUrl ? "image" :
    videoUrl ? "video" :
    audioUrl ? "audio" : "text";

  const message = await Message.create({
    senderId,
    receiverId,
    text,
    imageUrl,
    videoUrl,
    audioUrl,
    type,
    status: "sent",
  });

  res.status(201).json({ message });

});




