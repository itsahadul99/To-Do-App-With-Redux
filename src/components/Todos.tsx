import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
    addTodos,
    removeTodo,
    updateTodo,
    toggleTodo,
    loadFromStorage,
    ToDo,
} from "../redux/todosSlice";

const ToDos: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [editId, setEditId] = useState<number | null>(null);
    const todos = useSelector((state: RootState) => state.todos || []); // Add fallback here
    const dispatch = useDispatch();

    // Load todos from localStorage
    useEffect(() => {
        const savedTodos = localStorage.getItem("todos");
        if (savedTodos) {
            try {
                const parsedTodos = JSON.parse(savedTodos) as ToDo[];
                dispatch(loadFromStorage(parsedTodos));
            } catch (error) {
                console.error("Error parsing todos from localStorage:", error);
            }
        }
    }, [dispatch]);

    // Save todos to localStorage
    useEffect(() => {
        localStorage.setItem("todos", JSON.stringify(todos));
    }, [todos]);

    const handleAddTodo = () => {
        if (!text.trim()) {
            alert("Please enter a todo!");
            return;
        }

        if (editId !== null) {
            dispatch(updateTodo({ id: editId, text: text.trim() }));
            setEditId(null);
        } else {
            dispatch(addTodos({ text: text.trim() }));
        }
        setText("");
    };

    const handleEdit = (id: number, currentText: string) => {
        setEditId(id);
        setText(currentText);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-6">Redux Todo App</h1>

            <div className="w-11/12 max-w-lg bg-white p-5 mb-6 rounded-lg">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter Your Todo"
                        className="flex-grow px-4 py-2 border rounded-md focus:outline-none"
                    />
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleAddTodo}
                    >
                        {editId ? "Edit Todo" : "Add Todo"}
                    </button>
                </div>
            </div>

            <div className="w-11/12 max-w-lg bg-white p-5 rounded-lg">
                {todos.length === 0 ? (
                    <p className="text-center text-gray-500">No todos available. Add some!</p>
                ) : (
                    <ul>
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className={`flex justify-between items-center mb-2 p-2 border rounded ${todo.status ? "bg-green-100" : "bg-gray-50"
                                    }`}
                            >
                                <div className="flex flex-col gap-1 w-full">
                                    <button
                                        className={`flex-grow cursor-pointer text-lg font-semibold ${todo.status ? "line-through text-gray-500" : "text-gray-900"
                                            }`}
                                        onClick={() => dispatch(toggleTodo(todo.id))}
                                    >
                                        {todo.text}
                                    </button>
                                    <span className="text-xs text-gray-500">{new Date(todo.id).toLocaleString()}</span>
                                </div>
                                <button
                                    className="px-2 py-1 text-sm bg-yellow-400 text-white rounded-md hover:bg-yellow-500 disabled:cursor-not-allowed"
                                    onClick={() => handleEdit(todo.id, todo.text || "")}
                                    disabled={todo.status}
                                >
                                    Edit
                                </button>
                                <button
                                    className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 ml-2"
                                    onClick={() => dispatch(removeTodo(todo.id))}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default ToDos;
