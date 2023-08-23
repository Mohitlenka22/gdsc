import express from "express";
import Member from "../models/memberSchema.js";
import authenticate from '../middlewares/authenticate.js';

const api = express.Router()

api.post("/member-api/post", authenticate, async (req, res) => {
    const { uname, role, uemail, phone } = req.body;
    if (!uname || !role || !uemail || !phone) {
        res.status(404).send({ "msg": "Please fill fields properly" });
    }
    try {
        const member = await Member({ uname, role, uemail, phone });
        const response = await member.save();
        if (response) {
            res.status(201).send({ "msg": "created successfully" });
        }
        else {
            res.status(500).send({ "err": "Error Occured" })
        }
    } catch (err) {
        res.status(404).send({ "err": err.name });
    }
})

api.get("/member-api/getall", authenticate, async (req, res) => {
    const member = await Member.find();
    if (member) {
        res.status(200).send(member);
    }
    else {
        res.status(500).send("Error")
    }
})

api.get("/member-api/getone/:_id", authenticate, async (req, res) => {
    const member = await Member.findOne({ _id: req.params._id });
    if (!member) {
        res.status(500).send("Error")
    }
    res.status(200).send(member);
});

api.patch("/member-api/edit/:_id", authenticate, async (req, res) => {
    try {
        const response = await Member.updateOne(
            { _id: req.params._id },
            { $set: req.body }
        );
        if (response) {
            res.status(200).send("updated")
        }
    }
    catch (err) {
        res.status(404).send(err.name);
    }
});

api.delete("/member-api/delete/:_id", authenticate, async (req, res) => {
    try {
        const response = await Member.deleteOne({ _id: req.params._id });
        if (response) {
            res.status(200).send("User deleted successfully");
        }
        else {
            res.status(404).send("User Not found");
        }
    }
    catch (err) {
        res.status(500).send(err.name);
    }
});

export default api;