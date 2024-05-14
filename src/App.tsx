import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import { useEffect, useState } from "react";
import { TiArchive, TiPlus, TiTimes } from "react-icons/ti";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Textarea } from "./components/ui/textarea";
TimeAgo.addDefaultLocale(en);

const timeAgo = new TimeAgo("en-US");

type Note = {
  id: number;
  text: string;
  updatedAt: number;
}

async function fetchNotes() {
  try {
    const response = await fetch('/api/notes');
    const data:Note[] = await response.json();

    return data;
  } catch (e) {
    return [];
  }
}

async function postNote() {
  try {
    const response = await fetch('/api/notes', {method: 'post'});
    const note:Note = await response.json();

    return note;
  } catch (e) {
    return null;
  }
}

async function updateNote(note:Note, text:string) {
  try {
    const response = await fetch(`/api/notes/${note.id}`, {
      method: 'put',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({text: text}),
    });
    const postNote:Note = await response.json();

    return postNote;
  } catch (e) {
    return null;
  }
}

async function deleteNote(note:Note) {
  try {
    await fetch(`/api/notes/${note.id}`, {method: 'delete'});

  } catch (e) {
    return null;
  }
}

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectNote, setSelectNote] = useState<Note | null>(null);
  const [editText, setEditText] = useState<string>("");

  useEffect(()=>{
    (async () => {
      const notes = await fetchNotes();
      setNotes(notes);
    })();
  }, []);

  const [query, setQuery] = useState("");

  function search(notes: Note[]) {
    return notes.filter((note) => note.text.toLowerCase().includes(query));
  }

  const [isAutoSave, setIsAutoSave] = useState(false);

  useEffect(() => {
    let timer = setTimeout(() => {
      if (editText.length > 0) {
        handleSave();
        setIsAutoSave(true);
      }
      let saveTimer = setTimeout(() => {
        setIsAutoSave(false)
      }, 2500);
      return () => clearTimeout(saveTimer)
    }, 3000)
    return () => clearTimeout(timer)
  }, [editText])

  const handleAddNote = () => {
    (async () => {
      const note = await postNote();
      if (note) {
        handleSelect(note);
      }

      const notes = await fetchNotes();
      setNotes(notes);
    })();
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditText(event.target.value);
  };

  const handleSelect = (note: Note) => {
    setSelectNote(note);
    setEditText(note.text);
  };

  const handleSave = () => {
    (async () => {
      if (selectNote) {
        const note = await updateNote(selectNote, editText);
        setSelectNote(note);
      } else if (editText.length > 0) {
        const newPost = await postNote();
        if (newPost) {
          const note = await updateNote(newPost, editText);
          setSelectNote(note)
        }
      }

      const notes = await fetchNotes();
      setNotes(notes);
    })()
  };

  const handleDelete = () => {
    (async () => {
      if (selectNote) {
        await deleteNote(selectNote);

        const notes = await fetchNotes();
        setNotes(notes);

        if (notes.length > 0) {
          setSelectNote(notes[0]);
          setEditText(notes[0].text);
        } else {
          setSelectNote(null);
          setEditText("");
        }
      }
    })()
  };

  return (
    <main className="flex h-screen w-full">
      <div className="hidden md:flex flex-col w-full max-w-xs bg-gray-100 border-l dark:bg-gray-800 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="relative w-full max-w-md pr-4">
            <Input
              placeholder="Search"
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>
          <Button size="icon" variant="outline" onClick={handleAddNote}>
            <TiPlus className="h-5 w-5" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <ul className="divide-y dark:divide-gray-700">
            {search(notes).map((note) => (
              <li
                key={note.id}
                className="p-4 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => {
                  handleSelect(note);
                }}
              >
                <h3 className="text-lg font-medium line-clamp-1">
                  {note.text.split("\n")[0]}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm text-right italic">
                  {timeAgo.format(note.updatedAt)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-col w-full max-w-4xl mx-auto p-6 md:p-8 lg:p-10">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Notes</h1>
          <div className="text-gray-500 dark:text-gray-400 text-sm">
            {isAutoSave && "Saved!"}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {handleSave()}}
            >
              <TiArchive className="h-5 w-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={handleDelete}
            >
              <TiTimes className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <Textarea
          className="flex-1 w-full resize-none rounded-lg border border-gray-200 p-4 text-lg dark:border-gray-700"
          placeholder="Start title..."
          value={editText}
          onChange={handleChange}
        />
      </div>
    </main>
  );
}

export default App;
