"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.addNote = exports.getNotes = void 0;
const notes_1 = __importDefault(require("../model/notes"));
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user._id;
    if (!userId) {
        res.status(401).send({ message: "user not authenticated" });
    }
    const getallNotes = yield notes_1.default.find({ userId });
    res.status(200).json({ message: "All Notes are here", notes: getallNotes });
});
exports.getNotes = getNotes;
const addNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content } = req.body;
    const user = req.user;
    console.log("here is the user:", user);
    const userId = req.user._id; //as ObjectId; // Set userId from req.user, assuming middleware sets it
    if (!userId) {
        res.status(401).json({ message: "User not authenticated" });
    }
    const addNote = new notes_1.default({
        title,
        content,
        userId,
    });
    console.log(addNote);
    const newAddedNote = yield addNote.save();
    const allNotes = yield notes_1.default.find();
    res.status(201).json({
        message: "New notes Added cats",
        newNote: newAddedNote,
        notes: allNotes,
    });
});
exports.addNote = addNote;
const updateNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { params: { id }, body, } = req;
        const noteUpdate = yield notes_1.default.findByIdAndUpdate({ _id: id }, body);
        const allNotes = yield notes_1.default.find();
        res.status(200).json({
            message: "Notes Updated successfully",
            NewUpdatedNote: noteUpdate,
            notes: allNotes,
        });
    }
    catch (error) {
        res.status(301).json({ message: "Note not Updated" });
    }
});
exports.updateNote = updateNote;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const noteDelete = yield notes_1.default.findByIdAndDelete(req.params.id);
        const allNotes = yield notes_1.default.find();
        res.status(201).json({
            message: "one Note deleted cats",
            notedelete: noteDelete,
            notes: allNotes,
        });
    }
    catch (error) {
        res.status(401).json({ message: "Notes not deleted" });
        throw new Error("error");
    }
});
exports.deleteNote = deleteNote;
