import { Router } from "express";
import { getNotes, addNote, deleteNote, updateNote } from "../controllers";
import { signIn, signUp, refreshToken, logOut } from "../controllers/authControllers";
const router: Router = Router();
router.get("/all-notes", getNotes);
router.post("/add-note", addNote);
router.put("/update-note/:id",updateNote)
router.delete("/delete-note/:id", deleteNote);
router.post("/register", signUp);
router.post("/login", signIn);
router.post('/refreshToken',refreshToken)
router.post('/logout',logOut)
router.get('/hidden',verifyingToken,function(req,res) {
    if(!user){
        res.status(403).send({message:"invalid jsonwebtoken"})
    }
    if(req.user==='admin'){
        res.status(200).send({message:'congratulation!'})
    }else{
        res.status(403).send({
            message:'unauthorised access'
        })
    }
})
export default router;
