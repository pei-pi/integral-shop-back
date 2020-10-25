const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Goods = require("../../models/goods");

//GET api/manage/test
// router.get("/test", (req,res) => {
//     res.json({ msg: "ok" })
// })

//获取用户列表  GET api/manage/getUserList 
router.get("/getUserList", (req, res) => {
    const pagenum = req.query.pagenum
    const pagesize = req.query.pagesize
    User.countDocuments({}, (err, count) => {
        if (err) {
            res.json({
                status: 400,
                msg: JSON.stringify(error)
            });
        } else {
            User.find({}).skip((pagenum - 1) * pagesize).limit(parseInt(pagesize))
                .exec((err, doc) => {
                    if (err) {
                        res.json({
                            status: 400,
                            msg: JSON.stringify(err)
                        });
                    } else {
                        res.json({
                            total: count,
                            list: doc
                        })
                    }
                })
        }
    })

})

//搜索用户 GET  api/manage/searchUser
router.get("/searchUser", (req, res) => {
    const query = req.query.query
    User.find({ name: { $regex: query } })
        .exec((err, doc) => {
            if (err) {
                res.json({
                    status: 400,
                    msg: JSON.stringify(err)
                });
            } else {
                res.json({
                    total: doc.length,
                    list: doc
                })
            }
        })
})
//获取修改用户信息  GET  api/manage/getCurrentUser
router.get("/getCurrentUser", (req, res) => {
    const email = req.query.email
    User.find({}, err => {
        if (err) {
            res.json({
                status: 400,
                msg: JSON.stringify(err)
            })
        } else {
            User.find({ email: email }).exec((err, data) => {
                if (err) {
                    res.json({
                        status: 400,
                        msg: JSON.stringify(err)
                    })
                } else {
                    res.json({
                        data: data[0]
                    })
                }
            })
        }
    })
})

//修改用户信息 POST  api/manage/editUser
router.post("/editUser", (req, res) => {
    const email = req.body.email
    const name = req.body.name;
    const role = req.body.role;
    const integral = req.body.integral
    User.find({ email: email })
        .then((user) => {
            if (name == user[0].name && role == user[0].role && integral == user[0].integral) {
                res.status(202).json("未做任何修改")
            }
            else {
                User.findOneAndUpdate({
                    email: email
                }, {

                    $set: {
                        name: name,
                        role: role,
                        integral: integral
                    }
                }, {}, (err) => {
                    if (err) {
                        res.status(400).json("修改用户失败")
                    } else {
                        res.status(200).json("修改用户成功")
                    }
                })
            }
        })

})

//删除用户   DELETE  api/manage/deleteUser
router.delete("/deleteUser", (req, res) => {
    const email = req.query.email
    User.deleteOne({
        email: email
    }, (err) => {
        if (err) {
            res.status(400).json("删除用户失败")
        } else {
            res.status(200).json("删除用户成功")
        }
    })
})

//添加商品   POST  api/manage/addGood
router.post("/addGood", (req, res) => {
    const newGood = new Goods({
        name: req.body.name,
        index: JSON.stringify(JSON.parse(req.body.value)),
        integral: req.body.integral,
        count: req.body.count,
        address: req.body.address,
        url: req.body.Url
    })
    newGood.save()
        .then(good => res.status(200).json(good))
        .catch(err => console.log(err))
})

//获取商品列表  GET  api/manage.getGoodsList
router.get("/getGoodsList", (req, res) => {
    const pagenum = req.query.pagenum
    const pagesize = req.query.pagesize
    Goods.countDocuments({}, (err, count) => {
        if (err) {
            res.json({
                status: 400,
                msg: JSON.stringify(err)
            });
        } else {
            Goods.find({}).skip((pagenum - 1) * pagesize).limit(parseInt(pagesize))
                .exec((err, doc) => {
                    if (err) {
                        res.json({
                            status: 400,
                            msg: JSON.stringify(err)
                        });
                    } else {
                        res.json({
                            total: count,
                            list: doc
                        })
                    }
                })
        }
    })
})

//获取修改用户信息  GET  api/manage/getCurrentGood
router.get("/getCurrentGood", (req, res) => {
    const _id = req.query._id
    Goods.find({}, err => {
        if (err) {
            res.json({
                status: 400,
                msg: JSON.stringify(err)
            })
        } else {
            Goods.find({ _id: _id }).exec((err, data) => {
                if (err) {
                    res.json({
                        status: 400,
                        msg: JSON.stringify(err)
                    })
                } else {
                    res.json({
                        data: data[0]
                    })
                }
            })
        }
    })
})

//修改商品信息  POST  api/manage.editGood
router.post("/editGood", (req, res) => {
    console.log(req.body)
    const _id = req.body._id;
    const name = req.body.name;
    const index = JSON.stringify(JSON.parse(req.body.value));
    const integral = req.body.integral;
    const count = req.body.count;
    const url = req.body.url;
    const address = req.body.address;
    console.log(_id)
    Goods.find({ _id:_id})   
        .then((good) => {      
            if (name == good[0].name && index == good[0].index && integral == good[0].integral
                && count == good[0].count && url == good[0].url && address == good[0].address) {
                res.status(202).json("未做任何修改")
            } else {
                Goods.findOneAndUpdate({
                    _id: _id
                }, {
                    $set: {
                        name: name,
                        index: index,
                        integral: integral,
                        count: count,
                        url: url,
                        address: address
                    }
                }, {}, (err) => {
                    if (err) {
                        res.status(400).json("修改商品失败")
                    } else {
                        res.status(200).json("修改商品成功")
                    }
                })
            }
        })
})

//删除商品  DELETE  api/manage/deleteGood
router.delete("/deleteGood",(req,res)=>{
    const _id = req.query._id
    Goods.deleteOne({
        _id:_id
    },(err)=>{
        if(err){
            res.status(400).json("删除商品失败")
        }else{
            res.status(200).json("删除商品成功")
        }
    })
})

module.exports = router;