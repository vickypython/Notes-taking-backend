import { Request, Response, Router } from "express";
import { getNotes, addNote, deleteNote, updateNote ,welcome} from "../controllers";
import { signIn, signUp,  logOut,refreshToken} from "../controllers/authControllers";

import { verifyingToken, } from "../middleware/Openauth";
import { authMiddleware } from "../middleware/authMiddleware";

const router: Router = Router();
//for the main application section
router.get("/",welcome)
router.get("/all-notes",authMiddleware, getNotes);
router.post("/add-note",authMiddleware, addNote);
router.put("/update-note/:id",updateNote)
router.delete("/delete-note/:id", deleteNote);
//for the log in and register section
router.post("/register", signUp);
router.post("/login", signIn);
 router.post('/refreshToken',refreshToken)
router.post('/logout',logOut)
router.get('/hidden',verifyingToken,function(req:any,res:Response) {
    if(!req.user){
        res.status(403).send({message:"invalid jsonwebtoken"})
    }
    if(req.user.role==='admin'){
        res.status(200).send({message:'congratulation!'})
    }else{
        res.status(403).send({
            message:'unauthorised access'
        })
    }
})
export default router;
