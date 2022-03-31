import React, { useState } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

const apiUrl = "http://localhost:3001/to-dos";

function TodoList() {
  const [todos, setTodos] = useState([]);
  const getTodos = () => {
    axios.get(apiUrl).then( (res) => {
      setTodos(res.data);
    });
  };

  useEffect( ()=> {
    getTodos();
  }, []);
  const addTodo = (todo) => {
    if (!todo.title || /^\s*$/.test(todo.title)) {
      return;
    }

    try {
      console.log(todo);
      axios.post(apiUrl, todo).then((res) => {
        const newTodos = [...todos, todo];
        setTodos(newTodos);
      });
    } catch (error) {
      console.error(error);
    }
  };
  const showDescription = (todoId) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === todoId) {
        todo.showDescription = !todo.showDescription;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };
  const updateTodo = (todoId, newValue) => {
    newValue.is_done=newValue.isDone;
    console.log(newValue);
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }
    try {
      axios
        .patch(`${apiUrl}/${todoId}`, newValue)
        .then(
          setTodos((prev) =>
            prev.map((item) => (item.id === todoId ? newValue : item))
            )
        );
    } catch (error) {
      console.error(error);
    }
  };
    const removeTodo = (id) => {
      axios
        .delete(`${apiUrl}/${id}`, {})
        .then(function (response) {
          const removedArr = [...todos].filter((todo) => todo.id !== id);
          setTodos(removedArr);
        });
    };
    const completeTodo = (id) => {
      
      let updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          todo.isComplete = !todo.isComplete;
        }
        return todo;
      });
      setTodos(updatedTodos);
    };
  return (
    <>
      <h1>What's the Plan for Today?</h1>
      <TodoForm onSubmit={addTodo} />
      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
        showDescription={showDescription}
      />
    </>
  );
}

export default TodoList;
