import React from 'react'
import TaskTable from './taskTable'

const TaskArea = () => {
  return (
    <div className='container h-100'>
        <div className='row d-flex justify-content-center align-items-center h-100'>
            <div className='col-md-6 col-xl-6'>
                <div className='card'>
                    <div className="card-body">
                        <TaskTable/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TaskArea
