const router = require('express').Router()
const postModel = require("../models/post")
const bcrypt = require("bcrypt");

var refreshTokens = {};


router.get('/post', function (req, res) {
    res.render('home');
})
router.get('/form', function (req, res) {
    res.render('form');
})

router.post('/form', async (req, res) => {
    try {
        if (!req.body.title || !req.body.content) {
            return res.json(" vui long nhap lai")
        }

        const { title } = req.body
        const post = await postModel.findOne({ title })
        if (post) return res.status(400).json({ msg: " title da tồn tại" })
   

        let postRequestModel = new postModel({
            title: req.body.title,
            content: req.body.content,
            description: req.body.description

        })
        let result = await postRequestModel.save()
        // res.json(result)
        return res.send("Đăng thành công!");
    } catch (error) {
        res.status(500).send(error.message)
    }
})
router.get("/", function(req, res) {
  
    const posts = postModel.find();        
    res.render('index', {
        posts,
        
    }) 
 })
module.exports = router
