const express = require("express");
const router = express.Router();
const Goods = require("../../models/goods");
const User = require("../../models/User");
const Order = require("../../models/Order");

//GET api/goods/test
// router.get("/test", (req,res) => {
//     res.json({ msg: "login works" })
// })

//获取商品列表  POST api/goods/showgoods
router.post("/showgoods", (req, res) => {
    const ee = JSON.parse(JSON.stringify(req.body))
    const index = Object.keys(ee)
    Goods.find({ index: index }).then(good => {
        if (!good) {
            return res.status(404).json( "没有商品" );
        } else {
            return res.json({
                data: good,
                count: good.length
            })
        }
    })
})

//获取商品详情  GET api/goods/getgood
router.get("/getgood", (req, res) => {
    Goods.find({ _id: req.query.id }).then(good => {
        res.json({
            data: good
        })
    }).catch(err => {
        res.status(404).json(err)
    })
})

//兑换商品  post api/goods/exchange
router.post("/exchange", (req, res) => {
    User.findOneAndUpdate({ email: req.body.email }, {
        $set: {
            integral: req.body.integral
        }
    }, {}, (err) => {
        console.log(err)
    })
    Goods.findOneAndUpdate({ _id: req.body._id }, {
        $set: {
            count: req.body.count
        }
    }, {}, (err) => {
        console.log(err)
    })
    res.status(200).json("兑换成功")
    const newOrder = new Order({
        name : req.body.name,
        email : req.body.email,
        address : req.body.address,
        count : req.body.num,
    })
    newOrder.save().catch(err => console.log(err))
})

//查询订单  get api/goods/getOrder
router.get("/getOrder",(req,res)=>{
    console.log(req.query.email)
    Order.find({email:req.query.email}).then(order=>{
        if(!order){
            return res.status(404).json("暂无订单")
        }else{
            res.json({
                data:order
            })
        }       
    })
})


module.exports = router;