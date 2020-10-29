const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
    name:String,
    email:String,
    count:Number,
    address:String,
})

module.exports = Order = mongoose.model("Order",OrderSchema)