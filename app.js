const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Item = require("./model/item");
const Cart = require("./model/cart");

const dbUrl = "mongodb://localhost:27017/shoppingCart";
mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTED TO DATABASE");
    })
    .catch((e) => {
        console.log(e);
        console.log("CONNECTION FAILED");
    });

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("", async (req, res) => {
    res.render("./home");
})
app.get("/showItem", async (req, res) => {
    const item = await Item.find();
    res.render("./showItem", { item });
})
app.get("/showItem/:id", async (req, res) => {
    const id = req.params.id;
    const item = await Item.findById(id);
    console.log(item);
    res.render("./oneItem", { item });
})
app.post("/cart", (req, res) => {
    const cart = new Cart;
    cart.save();
    res.redirect(`/cart/${cart._id}`);
})
app.get("/cart/:id", async (req, res) => {
    const cart = await Cart.findById(req.params.id).populate("item");
    res.render("./showCart", { cart });
})
app.get("/cart/:id/add", async (req, res) => {
    const item = await Item.find();
    const cart = await Cart.findById(req.params.id);
    res.render("./addItem", { item, cart });
})
app.post("/cart/:id/add", async (req, res) => {
    const item = await Item.find();
    let cart = await Cart.findById(req.params.id);
    for (let i of item) {
        const id = i._id;
        if (req.body[id] == 'on') {
            cart.item.push(i);
        }
    }
    cart.save();
    res.redirect(`/cart/${req.params.id}`);
})
app.delete("/cart/:id1/item/:id2", async (req, res) => {
    const cart = await Cart.findById(req.params.id1);
    let idx = -1;
    for (let i = 0; i < cart.item.length; i++) {
        if (cart.item[i]._id == req.params.id2) {
            idx = i;
            break;
        }
    }
    cart.item.splice(idx, 1);
    cart.save();
    res.redirect(`/cart/${req.params.id1}`);
})
app.listen("3000", () => {
    console.log("SERVING ON PORT 3000");
});