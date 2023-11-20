import React, { useEffect, useState } from 'react';

const TaskTable = () => {
    const [taskName, setTaskName] = useState("");
    const [taskList, setTaskList] = useState([]);
    const [listNum, setListNum] = useState(1);
    const [pendingTasksCount, setPendingTasksCount] = useState(0);
    const [reloadData, setReloadData] = useState(false);

    useEffect(() => {
        // Comprobar si el usuario existe
        async function crearUsuario() {
            try {
                const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
                    method: "POST",
                    body: JSON.stringify([]),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                if(response.status == 400) {
                    throw new Error('Usuario ya creado');
                }
            } catch(error) {
                console.log(error);
            }
        }
        async function fetchData() {
            try {
                const response = await fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui');
                let data = await response.json();
                const tasksArray = Array.isArray(data) ? data : [];
                console.log(tasksArray);
                setTaskList(tasksArray);
            } catch(error) {
                console.log(error.message);
            }
        }

        crearUsuario();
        fetchData();

    }, []);

    // funcion que al hacer click recarga la data
    const handleButtonClick = () => {
        setReloadData(!reloadData);
    };


    //funcion para agregar task
    const addTask = () => {
        if (taskName.trim() !== "") {
            const newTask = { label: taskName, done: false };

            setTaskList([...taskList, newTask]);

            fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
                method: "PUT",
                body: JSON.stringify([...taskList, newTask]),
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then(response => {
                    console.log(response.ok);
                    console.log(response.status);
                    console.log(response.text());
                    return response.json();
                })
                .then(data => {
                    console.log(data.msg);
                })
                .catch(error => {
                    console.log(error);
                });

            setTaskName("");
            setListNum(listNum + 1);
        }
    };

    //funcion para eliminar task por (ID)
    const deleteTask = (id) => {

        const updatedList = taskList.filter((task) => task.id !== id);

        // Actualizar lista
        setTaskList(updatedList);

        fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
            method: "PUT",
            body: JSON.stringify(updatedList),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                console.log(response.ok);
                console.log(response.status);
                console.log(response.text());
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    // Marcar como hecha la tarea se cambia el estado de "done"
    const toggleDone = (id) => {
        const updatedList = taskList.map((task) =>
            task.id === id ? { ...task, done: !task.done } : task
        );

        setTaskList(updatedList);

        fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
            method: "PUT",
            body: JSON.stringify(updatedList),
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    console.log(data);
                    // Seteamos la cantidad de tareas pendientes
                    setPendingTasksCount(data.filter(task => !task.done).length);
                } else {
                    console.error("Formato de datos recibido no válido:", data.msg);
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    const clearAllTasks = () => {
        // Limpiamos la lista completa de tareas
        setTaskList([]);

        // Ahora limpiamos la lista de tareas en la [ ] de la API
        fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to delete user. Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                setPendingTasksCount(0); // Se deja en 0 la cantidad de tareas pendientes

                // Despues que se limpia la lista completa de tareas se vuelve a crear el usuario
                return fetch('https://playground.4geeks.com/apis/fake/todos/user/nicoeugui', {
                    method: "POST",
                    body: JSON.stringify([]),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
            })
            .then(response => response.json())
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };



    return (
        <>
            <input type="text" className='form-control' maxLength={55} placeholder="Task Name" aria-label="Task Name" value={taskName} name="taskName" onClick={handleButtonClick} onChange={(e) => setTaskName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        // al hacer Enter se agrega el task con la funcion addTask()
                        addTask();
                    }
                }} />

            <button
                type="button"
                className="btn btn-danger ms-auto mt-4 mb-2"
                onClick={() => {
                    clearAllTasks();
                }}
            >
                Limpiar todas las tareas
            </button>


            <table className='table mb-0 mt-3'>
                <tbody className="table-group-divider">
                    <tr>
                        <th scope="row">Task Name</th>
                        <th scope="row">Actions</th>
                        <th scope="row">Estado</th>
                    </tr>

                    {taskList.slice(1).map((task, index) => (
                        <tr key={task.id}>
                            <td className={`text-dark ${task.done ? 'done-task' : ''}`}>
                                {task.label}
                            </td>
                            <td>
                                <button type="button" className="btn btn-danger" onClick={() => deleteTask(task.id)}><i className="fa-solid fa-trash"></i></button>
                            </td>
                            <td>
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        role="switch"
                                        id={`flexSwitchCheck${task.id}`}
                                        checked={task.done}
                                        onChange={() => {
                                            toggleDone(task.id);
                                            const newCount = task.done ? pendingTasksCount + 1 : pendingTasksCount - 1;
                                            setPendingTasksCount(newCount);
                                        }}
                                    />
                                    <label className="form-check-label" htmlFor={`flexSwitchCheck${task.id}`}>
                                        {task.done ? 'Completada' : 'Pendiente'}
                                    </label>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TaskTable;
