const bookService = require('../services/book.service')
const jwt = require('jsonwebtoken')
const ApiError = require('../api-error')


function verifyToken (req, res) {
    const token = req.headers['authorization']
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET || 'B2203508_LeTruongKy_CT449_BTL', (error, user) => {
            if( error || !user.ChucVu) {
                return reject('Unauthorized !')
            }
            else {
                resolve(user)
            }
        }) 
    })
}

// [GET] [/book]
module.exports.getAll = async (req, res, next) =>{
    try {
        const bookservice = new bookService()
        const result = await bookservice.getAll()
        res.json(result)
    } catch (error) {
        console.log(error)
        return next( new ApiError(500, "An error occurred while getAll books !")
        )
    }
}

// [POST] [/book/add]
module.exports.add =  async (req, res, next) =>{
    if(!req.body.TenSach) {
        return next( new ApiError(400, "Tên sách không được để trống!"))
    }
    try {
        await verifyToken(req, res) 
        const bookservice = new bookService()
        const result = await bookservice.add(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next( new ApiError(401,error))
        }
        return next( new ApiError(500, "An error occurred while adding book !"))
    }
}

// [PATCH] [/book/update/:MaSach]
module.exports.update = async (req, res, next) =>{
    try {
        await verifyToken(req,res)
        const bookservice = new bookService()
        const result =  await bookservice.update(req.body)
        res.json(result)
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next( new ApiError(401,error))
        }
        return next( new ApiError(500, "An error occurred while updating book !"))
    }
}

// [DELETE] [/book/delete/:MaSach]
module.exports.delete = async (req, res, next) =>{
    try {
        await verifyToken(req,res)
        const bookservice = new bookService()
        const result =await  bookservice.delete(req.params.MaSach)
        if(!result) {
            return next ( new ApiError (404, "Không tìm thấy sách!"))
        }
        return res.json({
            result,
            message:"Xóa sách thành công!"
        })
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next( new ApiError(401,error))
        }
        return next( new ApiError(500, "An error occurred while updating book !"))
    }
}

// [DELETE] [book/delete/]
module.exports.deleteAll = async (req, res,  next) =>{
    try {
        await verifyToken(req,res)
        const bookservice = new bookService()
        const deletedCount = await bookservice.deleteAll()
        res.json({
            message: `${deletedCount} sách được xóa thành công!`
        })
    } catch (error) {
        console.log(error)
        if(error == 'Unauthorized !') {
            return next( new ApiError(401,error))
        }
        return next( new ApiError(500, "An error occurred deleting all books !"))
    }
}