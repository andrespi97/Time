import React, { useState, useEffect } from "react";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { InputText } from "primereact/inputtext";

const TaskTable = ({ tasks }) => {
  //headers de la tabla
  const columns = [
    { field: "status", header: "Status" },
    { field: "name", header: "Name" },
    { field: "deadline", header: "Deadline" },
    { field: "plannedDate", header: "Planned Date" },
    { field: "duration", header: "Duration" },
    { field: "reoccurence", header: "Reoccurence" },
    { field: "priority", header: "Priority" },
    { field: "wantedDate", header: "Wanted Date" },
    { field: "category", header: "Category" },
    { field: "dependencies", header: "Dependencies" },
    { field: "uid", header: "UID" },
  ];
  //data de las tareas
  const dataTasks = [];
  tasks.forEach((task) => {
    dataTasks.push(task.data);
  });
  // completar celda
  const onCellEditComplete = (e) => {
    let { rowData, newValue, field, originalEvent: event } = e;

    switch (field) {
      case "quantity":
      case "price":
        if (isPositiveInteger(newValue)) rowData[field] = newValue;
        else event.preventDefault();
        break;

      default:
        if (newValue.trim().length > 0) rowData[field] = newValue;
        else event.preventDefault();
        break;
    }
  };
  //define el tipo de editor
  const cellEditor = (options) => {
    switch (options.field) {
      case "price":
        return priceEditor(options);
      default:
        return textEditor(options);
    }
  };
  //editor de texto
  const textEditor = (options) => {
    return (
      <InputText
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        onKeyDown={(e) => e.stopPropagation()}
      />
    );
  };
  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(rowData.price);
  };
  return (
    <div className="w-full">
      <DataTable
        value={dataTasks}
        editMode="cell"
        tableStyle={{ minWidth: "50rem" }}
        className="table-auto border-collapse  "
      >
        {columns.map((col) => (
          <Column
            key={col.field}
            field={col.field}
            header={col.header}
            body={col.field === "price" && priceBodyTemplate}
            editor={(options) => cellEditor(options)}
            onCellEditComplete={onCellEditComplete}
          />
        ))}
      </DataTable>
    </div>
  );
};
export default TaskTable;
