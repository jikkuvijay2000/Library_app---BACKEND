const express = require('express')
const { uploadFrontendFiles, getallbooks, deleteBook, fetchBooks, usersavedBooks, getUsersavedBooks, allUsersavedBooks } = require('../Controllers/books')
const path = require('path')

const router = express.Router()
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

router.post('/upload',uploadFrontendFiles)
router.get('/getbooks',getallbooks)
router.delete('/delete/:id',deleteBook)
router.put('/',usersavedBooks);
router.get('/savedBooks/:userID',getUsersavedBooks)
router.get('/viewsavedBooks/:userID',allUsersavedBooks)



module.exports={booksRouter:router}