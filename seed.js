const mongoose = require("mongoose");
const Item = require("./model/item");
const data = require("./product.json");

const dbUrl = "mongodb://localhost:27017/shoppingCart";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTED TO DATABASE");
    })
    .catch((e) => {
        console.log(e);
        console.log("CONNECTION FAILED");
    });

const seedDb = async () => {
    for (let i of data) {
        await Item.insertMany(i);
    }
}
seedDb().then(() => {
    mongoose.connection.close();
})