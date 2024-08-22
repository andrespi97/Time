import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const TaskTable = ({ tasks }) => {
  return (
    <div className="card">
      <DataTable value={tasks} tableStyle={{ minWidth: "50rem" }}>
        <Column field="status" header="Status"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="category" header="Category"></Column>
        <Column field="quantity" header="Quantity"></Column>
      </DataTable>
    </div>
  );
};
export default TaskTable;
