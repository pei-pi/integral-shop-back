const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const cors = require('cors')
const path = require('path')

mongoose.set('useFindAndModify',false)

app.use(cors())
app.use(express.static(path.join(__dirname,"./static")))
//引入user.js
const users = require("./routers/api/users")
const upload = require("./routers/api/upload")
const goods = require("./routers/api/goods")
const manage = require("./routers/api/manage")

//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//passport初始化
app.use(passport.initialize());
require("./config/passport")(passport);

//连接数据库
mongoose.connect('mongodb://test:123456@localhost:27017/test',{ useNewUrlParser: true , useUnifiedTopology: true })
    .then(()=>console.log("MongoDB Connected!!!"))
    .catch(err=>console.log(err))

//test
// app.get("/", (req, res) => {
//     res.send("hello world!");
// })

app.use("/api/users",users)
app.use("/api/upload",upload)
app.use("/api/goods",goods)
app.use("/api/manage",manage)

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server running on port ${port}`)
})