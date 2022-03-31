import React, { useState } from "react";
import axios from "axios";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { useEffect } from "react";

const apiUrl = "http://localhost:3000/to-dos";

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

  // useEffect(() => {
  //   axios.get(apiUrl).then((res) => {
  //     setTodos(res.data.todos);
  //   });
  // }, []);

  // useEffect(() => {
  //   axios.get(apiUrl).then((res) => {
  //     setTodos(res.data.todos);
  //   });
  // }, [setTodos]);

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
    console.log(newValue);
    if (!newValue.title || /^\s*$/.test(newValue.title)) {
      return;
    }

    try {
      axios({
        method: "patch",
        url: `${apiUrl}`,
        params: {
          id: `${todoId}`,
        },
        data: newValue,
      });
      setTodos((prev) =>
        prev.map((item) => (item.id === todoId ? newValue : item))
      );
    } catch (error) {
      console.error(error);
    }
  };

  // const removeTodo = (id) => {
  //   try {
  //     axios({
  //       method: "delete",
  //       url: `${apiUrl}`,
  //       params: {
  //         id: `${id}`,
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }

  //   const removedArr = [...todos].filter((todo) => todo.id !== id);

  //   setTodos(removedArr);
  // };

    const removeTodo = (id) => {
      axios
        .delete(`${apiUrl}/${id}`, {})
        .then(function (response) {
          const removedArr = [...todos].filter((todo) => todo.id !== id);
          setTodos(removedArr);
        });
    };

  // const completeTodo = (id) => {
  //   try {
  //     let updateTodo = todos.find((todo) => todo.id === id);

  //     axios({
  //       method: "patch",
  //       url: `${apiUrl}`,
  //       params: {
  //         id: `${id}`,
  //       },
  //       data: {
  //         title: `${updateTodo.title}`,
  //         description: `${updateTodo.description}`,
  //         isDone: `${updateTodo.is_done === 1 ? 0 : 1}`,
  //       },
  //     });

  //     setTodos((prev) =>
  //       prev.map((todo) => (todo.id === id ? updateTodo : todo))
  //     );
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
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
