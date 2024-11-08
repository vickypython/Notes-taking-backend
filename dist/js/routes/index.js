"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const authControllers_1 = require("../controllers/authControllers");
//refreshToken,
// import { verifyingToken } from "../middleware/Openauth";
const router = (0, express_1.Router)();
//for the main application section
router.get("/all-notes", controllers_1.getNotes);
router.post("/add-note", controllers_1.addNote);
router.put("/update-note/:id", controllers_1.updateNote);
router.delete("/delete-note/:id", controllers_1.deleteNote);
//for the log in and register section
router.post("/register", authControllers_1.signUp);
router.post("/login", authControllers_1.signIn);
// router.post('/refreshToken',refreshToken)
router.post('/logout', authControllers_1.logOut);
// router.get('/hidden',verifyingToken,function(req,res) {
//     if(!user){
//         res.status(403).send({message:"invalid jsonwebtoken"})
//     }
//     if(req.user==='admin'){
//         res.status(200).send({message:'congratulation!'})
//     }else{
//         res.status(403).send({
//             message:'unauthorised access'
//         })
//     }
// })
exports.default = router;
