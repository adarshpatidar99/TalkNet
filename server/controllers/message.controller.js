import Message from "../models/message.model.js";
import cloudinary from "../config/cloudinary.js";
import catchAsyncError from "../middlewares/catchAsyncError.middleware.js";
import ErrorHandler from '../middlewares/error.middleware.js'

// VOICE MESSAGE
export const voiceUpload = catchAsyncError(async(req, res, next) => {

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

// VIDEO MESSAGE
export const videoUpload = catchAsyncError(async (req, res, next) => {

    if (!req.files || !req.files.video) {
      return next(new ErrorHandler("No video uploaded", 400));
    }

    const videoFile = req.files.video;

    const result = await cloudinary.uploader.upload(
      videoFile.tempFilePath,
      {
        resource_type: "video",       
        folder: "video_messages",   
      }
    );

    if (!result || !result.secure_url) {
      return next(new ErrorHandler("Failed to upload video on Cloudinary", 400));
    }

    return res.status(200).json({
      success: true,
      url: result.secure_url,        // frontend will get this URL
    });
                             
});

// IMAGE MESSAGE
export const imageUpload = async (req, res) => {
  try {            
                  
    if (!req.files || !req.files.image) {
      return res.status(400).json({ message: "No image file found" });
    }

    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      { folder: "chat_images" }
    );

    return res.status(200).json({
      success: true,
      url: result.secure_url
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

export const sendMessage = catchAsyncError(async (req, res, next) => {
  
    const { senderId, receiverId, content, image } = req.body;

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
      status: "sent"
    });                            

    return res.status(201).json({ success: true, message });

});

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

// MESSAGE SAVE IN DB (text / image / video / audio)
export const messageSave = catchAsyncError(async (req, res, next) => {
  const { senderId, receiverId, text, imageUrl, videoUrl, audioUrl } = req.body;

  if (!senderId || !receiverId) {
    return next(new ErrorHandler("senderId and receiverId are required", 400));
  }

  const type =
    imageUrl ? "image" :
    videoUrl ? "video" :
    audioUrl ? "audio" : "text";

  const message = await Message.create({
    senderId,
    receiverId,
    text: text || "",
    imageUrl: imageUrl || "",
    videoUrl: videoUrl || "",
    audioUrl: audioUrl || "",
    type,
    status: "sent",
  });

  return res.status(201).json({
    success: true,
    message,
  });
});





