import React, { Component } from "react";

class Task extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: props.startDate || new Date(),
      deadline: props.deadline || new Date(),
      duration: props.duration || 0, // duración en minutos o días
      status: props.status || "not started", // completed, not started, in progress
      listOrigin: props.listOrigin || "", // nombre o id de la lista de origen
    };
  }

  render() {
    const { startDate, deadline, duration, status, listOrigin } = this.state;
    return (
      <div className="task-card p-4 border rounded-md shadow-md">
        <h3 className="text-lg font-semibold">Task Details</h3>
        <p>
          <strong>Start Date:</strong> {startDate.toDateString()}
        </p>
        <p>
          <strong>Deadline:</strong> {deadline.toDateString()}
        </p>
        <p>
          <strong>Duration:</strong> {duration} days
        </p>
        <p>
          <strong>Status:</strong> {status}
        </p>
        <p>
          <strong>List Origin:</strong> {listOrigin}
        </p>
      </div>
    );
  }
}

export default Task;
