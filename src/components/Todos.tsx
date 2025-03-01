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
import Bg from '../assets/bg2.avif'
const ToDos: React.FC = () => {
    const [text, setText] = useState<string>("");
    const [editId, setEditId] = useState<number | null>(null);
    const todos = useSelector((state: RootState) => state.todos || []);
    const dispatch = useDispatch();
    const [greeting, setGreeting] = useState("");
    const [motivation, setMotivation] = useState("");
    const [time, setTime] = useState<string>("");
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
    // Update the greeting based on the current time
    useEffect(() => {
        const updateGreeting = () => {
            const hour = new Date().getHours();
            if (hour < 12) setGreeting("Good Morning");
            else if (hour < 18) setGreeting("Good Afternoon");
            else setGreeting("Good Evening");
        };

        updateGreeting();
        const interval = setInterval(updateGreeting, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Update the clock in real-time
    useEffect(() => {
        const updateClock = () => {
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
            setTime(timeString);
        };
        updateClock(); // Call once on initial render
        const interval = setInterval(updateClock, 1000); // Update every second
        return () => clearInterval(interval);
    }, []);
    const motivationalLines = [
        "Small steps every day lead to big achievements.",
        "Stay focused, stay organized, stay unstoppable.",
        "Your goals are closer than you think—start now!",
        "Every task completed is a step closer to success.",
        "Don’t wait for inspiration—act and let it find you.",
        "Productivity is the key to turning dreams into reality.",
        "Conquer your day, one task at a time.",
        "Every checkmark is a victory—keep going!",
        "A clear list leads to a clear mind.",
        "You’re capable of more than you think—start with one thing!"
    ];
    useEffect(() => {
        const getMotivatedLine = () => {
            setMotivation(motivationalLines[Math.floor(Math.random() * motivationalLines.length)])
        }
        getMotivatedLine()
        const interval = setInterval(getMotivatedLine, 80000); // Update every second
        return () => clearInterval(interval);
    }, [])
    return (
        <div
            style={{ backgroundImage: `url(${Bg})` }}
            className="min-h-screen bg-gray-100 flex flex-col items-center py-10 bg-no-repeat bg-cover w-full min-w-full"
        >
            {/* Greeting and Clock */}
            <div className="text-center mb-6 px-4">
                <h2 className="text-3xl font-semibold text-white md:text-4xl">{greeting}!</h2>
                <p className="text-lg text-gray-200 md:text-xl">{time}</p>
            </div>

            <h1 className="text-4xl font-bold mb-6 text-white px-4 md:text-5xl">
                Add Your To Do:
            </h1>

            {/* Input Field */}
            <div className="w-11/12 max-w-lg bg-white p-5 mb-6 rounded-lg shadow-md">
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
                    <input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAddTodo();
                            }
                        }}
                        placeholder="Enter Your Todo"
                        className="flex-grow w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                        className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 text-nowrap"
                        onClick={handleAddTodo}
                    >
                        {editId ? "Edit Todo" : "Add Todo"}
                    </button>
                </div>
            </div>

            {/* Todo List */}
            <div className="w-11/12 max-w-lg bg-white p-5 rounded-lg shadow-md">
                {todos.length === 0 ? (
                    <p className="text-center text-gray-500">No todos available. Add some!</p>
                ) : (
                    <ul className=" overflow-y-auto max-h-[340px]">
                        {todos.map((todo) => (
                            <li
                                key={todo.id}
                                className={`flex flex-col sm:flex-row justify-between items-center mb-2 p-2 border rounded ${todo.status ? "bg-green-100" : "bg-gray-50"
                                    }`}
                            >
                                {/* Todo Text and Timestamp */}
                                <div className="flex flex-col gap-1 w-[80%]">
                                    <button
                                        title="Mark as Done"
                                        className={`text-start flex-grow cursor-pointer text-lg font-semibold ${todo.status
                                            ? "line-through text-gray-500"
                                            : "text-gray-900"
                                            }`}
                                        onClick={() => dispatch(toggleTodo(todo.id))}
                                    >
                                        {todo.text}
                                    </button>
                                    <span className="text-xs text-gray-500">
                                        {new Date(todo.id).toLocaleString()}
                                    </span>
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-2 mt-2 sm:mt-0 text-start md:justify-end w-[20%]">
                                    <button
                                        className="px-2 py-1 text-sm bg-yellow-400 text-white rounded-md hover:bg-yellow-500 disabled:cursor-not-allowed"
                                        onClick={() => handleEdit(todo.id, todo.text || "")}
                                        disabled={todo.status}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-2 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600"
                                        onClick={() => dispatch(removeTodo(todo.id))}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Motivation Section */}
            <div className=" bottom-[10%] right-[4%] px-4 text-center md:text-right hidden md:absolute">
                <h1 className="text-lg md:text-xl font-semibold">"{motivation}"</h1>
            </div>
        </div>

    );
};

export default ToDos;
