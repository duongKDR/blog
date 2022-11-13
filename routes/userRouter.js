const router = require('express').Router()
var jwt = require('jsonwebtoken');
const userModel = require("../models/userModel")
const postModel = require("../models/post")
const bcrypt = require("bcrypt");
const { db } = require('../models/userModel');
const { role, ROLES } = require('../models/index');
var refreshTokens = {};
const CheckToken = require("../middlewares/checkToken")
const authAdmin = require("../middlewares/checkAdmin")
const userAuth = require("../middlewares/checkUser");
 



router.get('/:id', async function (req, res) {
    const { id } = req.params;
    console.log( id);
   
    if(!id){
      return res.status(400).json({ message: "Not id" })
    }
    await userModel.findByIdAndDelete(id)
   return res.status(200).render('login')
  
})
router.get('/register', function (req, res) {
    res.render('register');
})

router.get("/", function(req, res) {
    res.render('index');
       
 })
router.get('/login', function (req, res, next) {

     res.render('login');
})

router.post('/register', async (req, res) => {
    try {
        if (!req.body.username || !req.body.password) {
            return res.json(" vui long nhap lai")
        }

        const { username, password } = req.body
        const user = await userModel.findOne({ username })
        if (user) return res.status(400).json({ msg: " Username da tồn tại" })
   
        if (password.match(/^(?=\S*[a-z])(?=\S*[A-Z])(?=\S*\d)(?=\S*[^\w\s])\S{8,}$/)) {
               res.json("định dạng lại");
           } 
        const hashPassword = bcrypt.hashSync(req.body.password, 10);

        let isvalid = ROLES.indexOf(req.body.role);
        console.log("isvalid : " + isvalid);
        if (isvalid  >2) {
            return res.json(500).message("Role is not found.");
        }

        console.log(req.body);

        let registerRequestModel = new userModel({
            username: req.body.username,
            password: hashPassword,
            role: req.body.role

        })
        let result = await registerRequestModel.save()
        // res.json(result)
        return res.send("Đăng kí thành công!");
    } catch (error) {
        res.status(500).send(error.message)
    }
})

router.post('/login', async (req, res) => {
    try {

      
        const { username, password } = req.body
        const user = await userModel.findOne({ username })
        if (!user) return res.status(400).json({ msg: " Username ko tồn tại" })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Mật khẩu sai" })
        const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
        const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

        const dataForAccessToken = {
            username: user.username,
        };

        const accessToken = await jwt.sign(
            {
                dataForAccessToken,

            },
            accessTokenSecret,
            {
                algorithm: 'HS256',
                expiresIn: accessTokenLife,
            },
        );
        if (!accessToken) {
            return res
                .status(401)
                .send('Đăng nhập không thành công, vui lòng thử lại.');
        }
        const _CONF = {
            username: user.username,
        };
        const refreshTokenLife = process.env.REFRESH_TOKEN_LIFE || "365d";


        const refreshToken = jwt.sign({
            _CONF,

        },
            refreshTokenLife,

        )
        console.log(user.role);
        console.log(user.username);
        console.log(user.createdAt);
        if (user.role == "admin") {
            const users = await userModel.findOne();
            const options = {
                expires: new Date(
                    Date.now() + 2 * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            };         
            res.cookie("token",accessToken,options).render('list', {
                users,
            })
            console.log("-----------------");
            // res.status(200).cookie("token", accessToken, { expire: new Date(3600 + Date.now()) });
            res.end();

        }
        return res.status(200).cookie("token", accessToken, { expire: new Date(3600 + Date.now()) }).render('index');
        //    .clearCookie('username')


    } catch (error) {
        console.log(error);
        // res.status(500).send(error.message)
    }
})



// router.get('/home/', CheckToken,authAdmin,userAuth, function (req, res) {
//     res.json(req.headers)
// })

// router.get('/form', function (req, res) {
//     res.render('form');
// })

// router.post('/form', async (req, res) => {
//     try {
//         if (!req.body.title || !req.body.content) {
//             return res.json(" vui long nhap lai")
//         }

//         const { title } = req.body
//         const post = await postModel.findOne({ title })
//         if (post) return res.status(400).json({ msg: " title da tồn tại" })
   

//         let postRequestModel = new postModel({
//             title: req.body.title,
//             content: req.body.content,
//             description: req.body.description

//         })
//         let result = await postRequestModel.save()
//         // res.json(result)
//         return res.send("Đăng thành công!");
//     } catch (error) {
//         res.status(500).send(error.message)
//     }
// })

module.exports = router
