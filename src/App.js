import { useState, useEffect } from "react";
import Preview from "./components/Preview";
import Message from "./components/Message";
import NotesContainer from "./components/Notes/NotesContainer";
import NotesList from "./components/Notes/NotesList";
import Note from "./components/Notes/Note";
import NoteForm from "./components/Notes/NoteForm";
import Alert from "./components/Alert";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState(null);
  const [creating, setCreating] = useState(false); //usestate: hooks
  const [editing, setEditing] = useState(false);
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("notes")) {
      setNotes(JSON.parse(localStorage.getItem("notes")));
    } else {
      localStorage.setItem("notes", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    if (validationErrors.length !== 0) {
      setTimeout(() => {
        setValidationErrors([]);
      }, 3000);
    }
  }, [validationErrors]);

  const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
    // Change Title of Note
  };
  // validation
  const validate = () => {
    const validationErrors = [];
    let passed = true;
    if (!title) {
      validationErrors.push("ادخال عنوان للملاحظة");
      passed = false;
    }

    if (!content) {
      validationErrors.push("  ادخال  محتوى ملاحظة");
      passed = false;
    }

    setValidationErrors(validationErrors);
    return passed;
  };
  const changeTitleHandler = (event) => {
    setTitle(event.target.value);
  };

  // Change content  of Note

  const changeContentHandler = (event) => {
    setContent(event.target.value);
  };

  //save note
  const saveNoteHandler = () => {
    if (!validate()) return;

    const note = {
      id: new Date(),
      title: title,
      content: content,
    };

    const updatedNotes = [...notes, note];
    saveToLocalStorage("notes", updatedNotes);
    setNotes(updatedNotes);
    setCreating(false);
    setSelectedNote(note.id);
    setTitle("");
    setContent("");
  };

  // Select Note

  const selectedNoteHandler = (noteId) => {
    setSelectedNote(noteId);
    setCreating(false);
    setEditing(false);
  };

  // Switch to Edit Mode

  const editNoteHandler = () => {
    const note = notes.find((note) => note.id === selectedNote);
    setEditing(true);
    setTitle(note.title);
    setContent(note.content);
  };

  // Update Note

  const updateNoteHandler = () => {
    if (!validate()) return;
    const updateNotes = [...notes];
    const noteIndex = notes.findIndex((note) => note.id === selectedNote);

    updateNotes[noteIndex] = {
      id: selectedNote,
      title: title,
      content: content,
    };
    saveToLocalStorage("notes", updateNotes);
    setNotes(updateNotes);
    setEditing(false);
    setTitle("");
    setContent("");
  };

  // Delete Note

  const deleteNoteHandler = () => {
    const updateNotes = [...notes];
    const noteIndex = updateNotes.findIndex((note) => note.id === selectedNote);
    notes.splice(noteIndex, 1);
    saveToLocalStorage("notes", notes);
    setNotes(notes);
    setSelectedNote(null);
  };
  const getAddNote = () => {
    return (
      <NoteForm
        formTitle="ملاحظة جديدة"
        title={title}
        content={content}
        titleChanged={changeTitleHandler}
        contentChanged={changeContentHandler}
        submitText="حفظ"
        submitClicked={saveNoteHandler}
      />
    );
  };

  const getPreview = () => {
    if (notes.length === 0) {
      return <Message title=" لا يوجد ملاحظة " />;
    }

    if (!selectedNote) {
      return <Message title="الرجاء اختيار ملاحظ" />;
    }

    const note = notes.find((note) => {
      return note.id === selectedNote;
    });

    let noteDisplay = (
      <div>
        <h2> {note.title}</h2>
        <p>{note.content}</p>
      </div>
    );

    if (editing) {
      noteDisplay = (
        <NoteForm
          formTitle="تعديل ملاحظة"
          title={title}
          content={content}
          titleChanged={changeTitleHandler}
          contentChanged={changeContentHandler}
          submitText="تعديل"
          submitClicked={updateNoteHandler}
        />
      );
    }

    return (
      <div>
        {!editing && (
          <div className="note-operations">
            <a href="#" onClick={editNoteHandler}>
              <i className="fa fa-pencil-alt" />
            </a>
            <a href="#" onClick={deleteNoteHandler}>
              <i className="fa fa-trash" />
            </a>
          </div>
        )}
        {noteDisplay}
      </div>
    );
  };
  const addNoteHandler = () => {
    setCreating(true);
    setEditing(false);
    setTitle("");
    setContent("");
  };

  return (
    <div className="App">
      <NotesContainer>
        <NotesList>
          {notes.map((note) => (
            <Note
              key={note.id}
              title={note.title}
              noteClicked={() => selectedNoteHandler(note.id)}
              active={selectedNote === note.id}
            />
          ))}
        </NotesList>
        <button className="add-btn" onClick={addNoteHandler}>
          +
        </button>
      </NotesContainer>
      <Preview>{creating ? getAddNote() : getPreview()}</Preview>
      {validationErrors.length !== 0 && (
        <Alert validationMessages={validationErrors} />
      )}
    </div>
  );
}

export default App;
