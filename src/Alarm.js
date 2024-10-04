import React, { useState, useEffect } from "react";

const AlarmApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ label: "", time: "" });
  const [editingTask, setEditingTask] = useState(null);
  const [activeAlarm, setActiveAlarm] = useState(null);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewTask((prevTask) => ({
      ...prevTask,
      [id]: value,
    }));
  };

  const addTask = () => {
    if (newTask.label && newTask.time) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setNewTask({ label: "", time: "" });
    }
  };

  const deleteTask = (index) => {
    setTasks((prevTasks) => prevTasks.filter((_, i) => i !== index));
  };

  const editTask = (index) => {
    const taskToEdit = tasks[index];
    setEditingTask({ index, ...taskToEdit });
  };

  const saveEditedTask = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index] = editingTask;
    setTasks(updatedTasks);
    setEditingTask(null);
  };

  const checkAlarms = () => {
    const currentTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
    tasks.forEach((task, index) => {
      if (task.time === currentTime) {
        setActiveAlarm({ index, ...task });
      }
    });
  };

  const dismissAlarm = () => {
    setActiveAlarm(null);
  };

  const snoozeAlarm = () => {
    const snoozedTime = new Date(new Date().getTime() + 5 * 60000) // Snooze for 5 minutes
      .toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    const updatedTasks = [...tasks];
    updatedTasks[activeAlarm.index].time = snoozedTime;
    setTasks(updatedTasks);
    setActiveAlarm(null);
  };

  useEffect(() => {
    const interval = setInterval(checkAlarms, 1000);
    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className="alarmContainer">
      <h1>React Alarm App</h1>
      <div>
        <button id="add-new" onClick={() => setNewTask({ label: "", time: "" })}>
          Add New Task
        </button>
        <div>
          <input
            type="text"
            id="label"
            placeholder="Label"
            value={newTask.label}
            onChange={handleInputChange}
          />
          <input
            type="time"
            id="time"
            value={newTask.time}
            onChange={handleInputChange}
          />
          <button id="save" onClick={addTask}>
            Save
          </button>
        </div>
      </div>

      <div id="alarms">
        {tasks.map((task, index) => (
          <div key={index}>
            {editingTask && editingTask.index === index ? (
              <div>
                <input
                  type="text"
                  id={`${index}-label`}
                  value={editingTask.label}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, label: e.target.value })
                  }
                />
                <input
                  type="time"
                  id={`${index}-time`}
                  value={editingTask.time}
                  onChange={(e) =>
                    setEditingTask({ ...editingTask, time: e.target.value })
                  }
                />
                <button id={`${index}-save`} onClick={() => saveEditedTask(index)}>
                  Save
                </button>
              </div>
            ) : (
              <div>
                <span>{task.label}</span>
                <span>{task.time}</span>
                <button id={`${index}-edit`} onClick={() => editTask(index)}>
                  Edit
                </button>
                <button id={index} onClick={() => deleteTask(index)}>
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {activeAlarm && (
        <div className="activeAlarm">
          <h2>Alarm: {activeAlarm.label}</h2>
          <button
            id={`${activeAlarm.label}-active-alarm-close`}
            onClick={dismissAlarm}
          >
            Dismiss
          </button>
          <button
            id={`${activeAlarm.label}-active-alarm-snooze`}
            onClick={snoozeAlarm}
          >
            Snooze
          </button>
          <button
            id={`${activeAlarm.label}-active-alarm-delete`}
            onClick={() => deleteTask(activeAlarm.index)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default AlarmApp;
