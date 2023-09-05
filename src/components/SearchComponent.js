import React, { useState } from "react";
import styles from "./SearchComponent.module.css";
import { ActionButton } from "../utils/styledComponents";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const SearchComponent = ({ onSearch, availableDates, handleReturn }) => {
  const [date, setDate] = useState("");

  const handleSearch = () => {
    // Call the onSearch function with the selected date
    if (date instanceof Date) onSearch(date);
  };

  const handleChange = (date) => setDate(date);

  const newDates = availableDates.length
    ? availableDates.map((date) => {
        const newDate = new Date(date);

        // Add 3 hours to the newDate
        newDate.setHours(newDate.getHours() + 3);

        if (newDate.getDate() !== parseInt(date.split("-")[2])) {
          newDate.setDate(newDate.getDate() - 1);
        }

        return newDate;
      })
    : null;

  return (
    <div className={styles["search-container"]}>
      <DatePicker
        selected={date}
        onChange={handleChange}
        placeholderText="Seleccionar fecha..."
        includeDates={newDates}
      />
      <div className={styles["button-container"]}>
        <ActionButton variation="primary" onClick={handleSearch}>
          Buscar
        </ActionButton>
        <ActionButton onClick={handleReturn}>Regresar</ActionButton>
      </div>
    </div>
  );
};

export default SearchComponent;
