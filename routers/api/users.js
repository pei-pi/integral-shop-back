// 登录&注册&当前用户数据
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport");

//GET api/users/test
router.get("/test", (req,res) => {
    res.json({ msg: "login works" })
    console.log("idhwaai")
})

//注册  POST api/users/register
router.post("/register", (req, res) => {
    //console.log(JSON.stringify(req.body))
    //查询数据库中是否拥有邮箱
     User.findOne({ email: req.body.email })
         .then((user) => {
             if (user) {
                 return res.status(400).json({ email: "邮箱已被注册" })
             } else {
                const newUser = new User({
                    email: req.body.email,
                    name: req.body.name,   
                    password: req.body.password,
                    integral: req.body.integral,
                    role:req.body.role,
                })
                //密码加密
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                    .catch(err => console.log(err));
                    });
                });
                newUser.save()
                    .then(user => res.json(user))
                 .catch(err => console.log(err));
                
            }
        })
 })

//登录 POST api/users/login
router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    //查询数据库
    User.findOne({email}).then(user => {
        if(!user){
            return res.status(404).json({email:"用户不存在"});
        }
        //密码匹配
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch){
                    //生成token    jwt.sign("规则","加密名字","过期时间","箭头函数")
                    //定义规则
                    const rule = {id:user.id,name:user.name};
                    jwt.sign(rule,"secret",{expiresIn:3600},(err,token) => {
                        if(err) throw err;
                        res.json({
                            success:true,
                            token:"Bearer " + token,
                        });
                    })
                }else{
                    return res.status(400).json({password:"密码错误！"});
                }
            })
    })
})

//请求 GET api/users/current
//验证token返回用户数据
router.get("/current",passport.authenticate('jwt',{session:false}),(req,res)=>{
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,
        integral:req.user.integral,
        role:req.user.role
    });
})

module.exports = router;