"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../controllers");
const authControllers_1 = require("../controllers/authControllers");
const Openauth_1 = require("../middleware/Openauth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
//for the main application section
router.get("/all-notes", authMiddleware_1.authMiddleware, controllers_1.getNotes);
router.post("/add-note", authMiddleware_1.authMiddleware, controllers_1.addNote);
router.put("/update-note/:id", controllers_1.updateNote);
router.delete("/delete-note/:id", controllers_1.deleteNote);
//for the log in and register section
router.post("/register", authControllers_1.signUp);
router.post("/login", authControllers_1.signIn);
router.post('/refreshToken', authControllers_1.refreshToken);
router.post('/logout', authControllers_1.logOut);
router.get('/hidden', Openauth_1.verifyingToken, function (req, res) {
    if (!req.user) {
        res.status(403).send({ message: "invalid jsonwebtoken" });
    }
    if (req.user.role === 'admin') {
        res.status(200).send({ message: 'congratulation!' });
    }
    else {
        res.status(403).send({
            message: 'unauthorised access'
        });
    }
});
exports.default = router;
