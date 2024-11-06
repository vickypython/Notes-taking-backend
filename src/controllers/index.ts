import { INotes } from "../types/type";
import Notes from "../model/notes";
import { Request, Response } from "express";
const getNotes = async (req: Request, res: Response): Promise<void> => {
  const getallNotes: INotes[] = await Notes.find();
  res.status(200).json({ message: "All Notes are here", notes: getallNotes });
};
const addNote = async (req: Request, res: Response): Promise<void> => {
  const { title, content} = req.body as Pick<
    INotes,
    "title" | "content" 
  >;
  const addNote: INotes = new Notes({
    title,
    content,
  });
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
      params: {id },
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
export { getNotes, addNote, updateNote, deleteNote };
