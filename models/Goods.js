const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GoodsSchema = new Schema({
    name:String,
    index:Number,
    url:String,
    integral:Number,
    count:Number,
    address:String,
})

module.exports = Goods = mongoose.model("Goods",GoodsSchema);