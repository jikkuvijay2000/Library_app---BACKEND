
const multer = require('multer')
const path = require('path')
const fs = require('fs');
const  bookModel  = require('../Models/books');
const userModel = require('../Models/users');
const dotenv = require('dotenv').config();


const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const sanitizeFileName = (filename) => {
    return filename.replace(/[^a-zA-Z0-9-_]/g, '_'); // Replace invalid characters with '_'
  };
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'pdf-uploads',
      format: async (req, file) => 'pdf', // Force PDF format
      public_id: (req, file) => `${Date.now()}_${sanitizeFileName(file.originalname)}`
    }
  });

module.exports = {
  cloudinary,
  storage
};

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype === 'application/pdf') {
        cb(null, true);
      } else {
        cb(new Error('Only PDF Allowed'), false);
      }
    }
  }).single('file');

  const uploadFrontendFiles = (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
  
      try {
        const { bookName, thumbnail, description, uploadedby } = req.body;
        const pdfurl = req.file.path; // Cloudinary URL
        const newBook = new bookModel({
          bookName,
          thumbnail,
          description,
          pdfurl,
          uploadedby
        });
        await newBook.save();
        res.status(201).json({ message: 'Book uploaded successfully', pdfurl });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  };

    const getallbooks = async (req,res)=>
        {
            try
            {
                const response = await bookModel.find({});
                res.status(200).json(response)
            }catch(err)
            {
                res.status(500).json("Internal server error")
            }
        }

        const deleteBook = async (req, res) => {
            const { id } = req.params; 
            try {
                const book = await bookModel.findByIdAndDelete(id); 
                if (!book) {
                    return res.status(404).json("Book not found");
                }
                res.json("Deleted");
            } catch (err) {
                res.status(500).json({ err: "Internal Server Error" });
            }
        }

        const usersavedBooks = async (req,res)=>
            {
                try
                {
                    const user = await userModel.findById(req.body.userID)
                    const book = await bookModel.findById(req.body.bookID)

                    user.savedBooks.push(book);
                    await user.save();
                    res.status(200).json(user)

                }catch(err)
                {
                    res.status(500).json({err:"Internal server error"})
                }
            }

        const getUsersavedBooks = async(req,res)=>
            {
                try
                {
                    const user = await userModel.findById(req.params.userID);
                    res.json({savedBooks:user?.savedBooks});

                }catch(err)
                {   
                    res.status(200).json(err)
                }
            }
        
            const allUsersavedBooks = async(req,res)=>
                {
                    try
                    {
                        const user = await userModel.findById(req.params.userID);
                        const savedBooks = await bookModel.find({
                            _id :{ $in: user.savedBooks}
                        })
                        res.json({savedBooks});
    
                    }catch(err)
                    {   
                        res.status(200).json(err)
                    }
                }
        
            
        
      
        
       
        

    module.exports={uploadFrontendFiles,getallbooks,deleteBook,usersavedBooks,getUsersavedBooks,allUsersavedBooks}