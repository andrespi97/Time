// components/Header.js
import React from "react";

const Header = ({ onSelectAll, onClearFilters, onFilter }) => {
  return (
    <div>
      <div className="flex gap-4 p-4">
        <button onClick={onSelectAll}>Select All Lists</button>
        <button onClick={onClearFilters}>Clear Filters</button>
      </div>
      <div className="flex gap-4 p-4">
        <button onClick={() => onFilter("today")}>Tasks Due Today</button>
        <button onClick={() => onFilter("tomorrow")}>
          Tasks Due Tomorrow or Earlier
        </button>
        <button onClick={() => onFilter("withinWeek")}>
          Tasks Due This Week or Earlier
        </button>
        <button onClick={() => onFilter("nextWeek")}>
          Tasks Due Next Week
        </button>
      </div>
    </div>
  );
};

export default Header;
