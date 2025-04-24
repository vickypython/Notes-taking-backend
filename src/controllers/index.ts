import { INotes } from "../types/type";
import Notes from "../model/notes";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";
const welcome=async(req:Request,res:Response)=>{
  res.status(200).send("welcome and have a good time")
}
const getNotes = async (req: any, res: Response): Promise<void> => {
  const userId = req.user._id;
  if (!userId) {
    res.status(401).send({ message: "user not authenticated" });
  }
  const getallNotes: INotes[] = await Notes.find({userId});
  res.status(200).json({ message: "All Notes are here", notes: getallNotes });
};
const addNote = async (req: any, res: Response): Promise<void> => {
  const { title, content } = req.body as Pick<INotes, "title" | "content">;
  const user=req.user
  console.log("here is the user:",user);
  
  const userId = req.user._id //as ObjectId; // Set userId from req.user, assuming middleware sets it
  if (!userId) {
    res.status(401).json({ message: "User not authenticated" });
  }
const addNote: INotes = new Notes({
    title,
    content,
    userId,
  });
  console.log(addNote);
  
  const newAddedNote: INotes = await addNote.save();
  const allNotes: INotes[] = await Notes.find();

  res.status(201).json({
    message: "New notes Added cats",
    newNote: newAddedNote,
    notes: allNotes,
  });
};
const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      params: { id },
      body,
    } = req;

    const noteUpdate: INotes | null = await Notes.findByIdAndUpdate(
      { _id: id },
      body
    );
    const allNotes: INotes[] = await Notes.find();
    res.status(200).json({
      message: "Notes Updated successfully",
      NewUpdatedNote: noteUpdate,
      notes: allNotes,
    });
  } catch (error) {
    res.status(301).json({ message: "Note not Updated" });
  }
};
const deleteNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const noteDelete: INotes | null = await Notes.findByIdAndDelete(
      req.params.id
    );
    const allNotes: INotes[] = await Notes.find();

    res.status(201).json({
      message: "one Note deleted cats",
      notedelete: noteDelete,
      notes: allNotes,
    });
  } catch (error) {
    res.status(401).json({ message: "Notes not deleted" });
    throw new Error("error");
  }
};
export { welcome,getNotes, addNote, updateNote, deleteNote };
