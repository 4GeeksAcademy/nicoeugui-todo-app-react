import React, { useState } from 'react';

const TaskTable = () => {
    const [taskName, setTaskName] = useState("");
    const [taskList, setTaskList] = useState([]);
    const [listNum, setListNum] = useState(1);

    // funcion para agregar task
    const addTask = () => {
        if (taskName.trim() !== "") {
            setTaskList([...taskList, { id: listNum, name: taskName }]);
            setTaskName("");
            setListNum(listNum + 1);
        }
    };

    // funcion para eliminar task por (ID)
    const deleteTask = (id) => {
        const updatedList = taskList.filter((task) => task.id !== id);
        setTaskList(updatedList);
    };

    return (
        <>
            <input type="text" className='form-control' maxLength={55} placeholder="Task Name" aria-label="Task Name" value={taskName} name="taskName" onChange={(e) => setTaskName(e.target.value)}
                onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                        // al hacer Enter se agrega el task con la funcion addTask()
                        addTask();
                    }
                }} />

            <table className='table mb-0 mt-3'>
                <tbody className="table-group-divider">
                    <tr>
                        <th scope="row">Task Name</th>
                        <th scope="row">Actions</th>
                    </tr>
                    {taskList.map((task) => (
                        <tr key={task.id}>
                            <td className='text-dark'>{task.name}</td>
                            <td>
                                <button type="button" class="btn btn-primary" onClick={() => deleteTask(task.id)} ><span class="bi bi-trash"></span></button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}

export default TaskTable;
