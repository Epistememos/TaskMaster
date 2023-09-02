import React, { useState, useRef, useEffect } from "react";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";
import { nanoid } from "nanoid";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const FILTER_MAP = {
  All: () => true,
  Active: (task) => !task.completed,
  Completed: (task) => task.completed,
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

function App(props) {

  const [filter, setFilter] = useState("All");

  const [tasks, setTasks] = useState(props.tasks); //This state allows to update the tasks value through the hook function setTasks

  function addTask(name) {
    const newTask = { id: `todo-${nanoid()}`, name, completed: false };
    setTasks([...tasks, newTask]);
  }
  
  function toggleTaskCompleted(id) { //We map the task list to change the targeted task
    const updatedTask = tasks.map((task) => {
      if (id === task.id) { 
        //if statement targets a specific task 
        return { ...task,completed: !task.completed };
        //^spread syntax
      }
      return task;
    });
    setTasks(updatedTask);
  }
  
  function deleteTask(id) {
    const remainingTasks = tasks.filter((task) => id !== task.id); //Array.prototype.filter() filters out (since !==) the task
    setTasks(remainingTasks);
  }
  
  function editTask(id, newName) {
    const editedTaskList = tasks.map((task) => {
      if (id === task.id) {
        return { ...task, name: newName};
      }
      return task;
    });
    setTasks(editedTaskList);
  }

  const taskList = tasks.filter(FILTER_MAP[filter])
  .map((task) => (
    <Todo   //This is the list of tasks added from Todo component
    id={task.id} 
    name={task.name} 
    completed={task.completed} 
    key={task.id}
    toggleTaskCompleted={toggleTaskCompleted}
    deleteTask={deleteTask}
    editTask={editTask}
    />
    ));
  const filterList = FILTER_NAMES.map((name) => (<FilterButton 
    key={name} name={name} isPressed={name === filter} setFilter={setFilter} />
  ));

const tasksNoun = taskList.length > 1 ? "tasks" : "task";

  const headingText = `${taskList.length} ${tasksNoun} remaining`;
  
  const listHeadingRef = useRef(null);

  const prevTaskLength = usePrevious(tasks.length);

  useEffect(() => {
    if (tasks.length -prevTaskLength === -1) {
      listHeadingRef.current.focus();
    }
  }, [tasks.length, prevTaskLength]);
  return (
    <div className="todoapp stack-large">
      <h1>To Do List</h1>
      <Form addTask={addTask} />
      <div className="filters btn-group stack-exception">
       {filterList}
      </div>
      <h2 id="list-heading" tabIndex="-1" ref={listHeadingRef}>{headingText}</h2>
      <ul
        role="list"
        className="todo-list stack-large stack-exception"
        aria-labelledby="list-heading">
        {taskList}
      </ul>
    </div>
  );
}

export default App;
