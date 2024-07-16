import "./App.css";
import { ReactComponent as Logo } from "./assets/logo.svg";
import { FaSortAmountDown } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { BiCheckbox, BiSolidCheckboxChecked } from "react-icons/bi";
import { useState, useRef, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { TbEdit } from "react-icons/tb";

export default function App() {
  return (
    <div id="App">
      <nav id="nav-bar">
        <Logo style={{ scale: "1.5" }} />
        <a
          id="about"
          href="https://en.wikipedia.org/wiki/Todo"
          target="_blank"
          rel="noreferrer"
        >
          <FcAbout id="about-icon" />
          About
        </a>
      </nav>
      <TodoContainer
        savedTodos={JSON.parse(localStorage.getItem("todos")) || []}
      />
    </div>
  );
}

function TodoTextField({ reference }) {
  return (
    <input
      type="text"
      placeholder="Type todo task here"
      // onChange={(e) => setText(e.target.value)}
      ref={reference}
    />
  );
}

function TodoContainer({ savedTodos }) {
  // Define the tabs for the todo list
  const tabs = ["All", "Completed", "Pending"];

  // Create a reference to the todo input field
  const inputRef = useRef(null);

  // Create state variables for todos and selected tab
  const [todos, setTodos] = useState(savedTodos);
  const [filterChoice, setFilterChoice] = useState(0);
  const [isSorted, setSorted] = useState(false);

  function onAddTodo(_) {
    // Retrieve the text input from the todo input field
    const text = inputRef.current.value;

    // If the input is empty, return early to avoid unnecessary processing
    if (text === "") return;

    // Clear the todo input field
    inputRef.current.value = "";

    // Generate a unique identifier for the new todo item using the current timestamp
    let timestamp = new Date().getTime();
    let newTodo = {
      id: timestamp,
      task: text,
      completed: false,
    };

    // Add the new todo item to the todos state
    setTodos((old) => {
      console.log("old todos:", old);
      return [newTodo, ...old];
    });
  }

  // Saves the todos state to local storage whenever it changes.
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const deleteTodo = (id) => {
    // Filter out the todo item with the matching ID
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  const getFilteredTodos = () => {
    let filtered = null;
    switch (filterChoice) {
      case 0:
        filtered = [...todos];
        break;
      case 1:
        filtered = todos.filter((todo) => todo.completed === true);
        break;
      default:
        filtered = todos.filter((todo) => todo.completed === false);
        break;
    }
    if (isSorted) {
      filtered.sort((a, b) => a.task.localeCompare(b.task));
    }
    return filtered;
  };

  return (
    <div id="todo-container">
      <h2>Todo List</h2>

      <div id="todo-editor">
        {/* Render the TodoTextField component */}
        <TodoTextField reference={inputRef} />

        {/* Render the add task button */}
        <button type="button" onClick={onAddTodo}>
          Add task
        </button>
      </div>
      <ul id="category-tabs">
        {/* Render the category tabs */}
        {tabs.map((tab, index) => (
          <li
            key={index}
            className={`category-tab-item ${
              index === filterChoice ? "active" : ""
            }`}
            onClick={(_) => setFilterChoice(index)}
          >
            {tab}
          </li>
        ))}
        <button onClick={(_) => setSorted(true)}>
          <FaSortAmountDown />
          sort
        </button>
      </ul>
      <ul id="todo-list">
        {getFilteredTodos().map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onDelete={deleteTodo}
            onUpdateTodos={saveTodos}
          />
        ))}
      </ul>
    </div>
  );
}

function TodoItem({ todo, onDelete, onUpdateTodos }) {
  const [checked, setChecked] = useState(todo.completed);
  const [task, setTask] = useState(todo.task);
  const dialogRef = useRef(null);

  function handleChekedClick(_) {
    todo.completed = !checked;
    onUpdateTodos();
    setChecked(!checked);
  }

  function onEdittingDone(_) {
    const dialog = dialogRef.current;
    const input = dialog.querySelector("div > textarea");
    const text = input.value;
    dialog.close();
    if (text !== "" && todo.task !== text) {
      todo.task = text;
      onUpdateTodos();
      setTask(text);
    }
  }

  return (
    <li className="todo-item">
      <span className="checkbox" onClick={handleChekedClick}>
        {todo.completed ? (
          <BiSolidCheckboxChecked className="check-filled" />
        ) : (
          <BiCheckbox />
        )}
      </span>
      <p className={todo.completed ? "completed" : ""}>{task}</p>
      <div className="todo-actions">
        <AiOutlineDelete onClick={(_) => onDelete(todo.id)} />
        {!checked && <TbEdit onClick={(_) => dialogRef.current.showModal()} />}
      </div>
      <EditDialog dialogRef={dialogRef} task={task} onDone={onEdittingDone} />
    </li>
  );
}

function EditDialog({ dialogRef, task, onDone }) {
  function onCancel(_) {
    const dialog = dialogRef.current;
    dialog.querySelector("div > textarea").value = task;
    dialog.close();
  }

  return (
    <dialog className="edit-dialog" ref={dialogRef}>
      <div className="dialog-container">
        <textarea
          name=""
          id=""
          rows="1"
          spellCheck={false}
          defaultValue={task}
          placeholder="Edit todo task"
        ></textarea>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" id="done-button" onClick={onDone}>
          Done
        </button>
      </div>
    </dialog>
  );
}
