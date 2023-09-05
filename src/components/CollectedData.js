import React, { useState } from "react";
import classes from "./CollectedData.module.css";
import { SimpleHeading, ActionButton } from "../utils/styledComponents";
import Modal from "./Modal";
import { downloadAsXLSX } from "../utils/convertToXLSX";
import { mergeObjectsByStation } from "../utils/dataHandling";

const CollectedData = ({ currentLot, data, handleReturn }) => {
  const [comments, setComments] = useState("");
  const [scrollTop, setScrollTop] = useState();
  const [scrollLeft, setScrollLeft] = useState();
  const [direction, setDirection] = useState("");

  // The dictionary will render the textorg_ARG value instead the questioncode
  const dictionary = JSON.parse(localStorage.getItem("fullQuestionDictionary"));

  // These values will be ignored
  const leftoverValues = [
    "station_id",
    "user_email",
    "date",
    "latitude",
    "longitude",
    "feature_id",
    "zone",
  ];

  // Data is mapped to ignore values
  const mappedLot = data.map((station) => {
    const mappedObj = {};
    for (let key in station) {
      if (!leftoverValues.includes(key)) {
        mappedObj[key] = station[key];
      }
    }
    return mappedObj;
  });

  mappedLot.sort((a, b) => {
    const stationA = a.station;
    const stationB = b.station;

    if (stationA < stationB) {
      return -1;
    }
    if (stationA > stationB) {
      return 1;
    }
    return 0;
  });

  // Values corresponding to one field are grouped as a single row
  const aggregatedObject = mergeObjectsByStation(mappedLot).reduce(
    (result, current) => {
      for (const key in current) {
        if (result.hasOwnProperty(key)) {
          result[key].push(current[key]);
        } else {
          result[key] = [current[key]];
        }
      }
      return result;
    },
    {}
  );

  // First letter in all field names will be capitalized
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const questionNames = Object.keys(mappedLot[0]).filter(
    (fieldName) => fieldName !== "station" && fieldName !== "comments"
  );

  questionNames.sort((a, b) => {
    const aValue = dictionary[a] || a; // Use the value if in dictionary, else use the key
    const bValue = dictionary[b] || b;
    return aValue.localeCompare(bValue);
  });

  const sortedFieldNames = [
    "station", // Place "station" column first
    ...questionNames, // Sort other columns
    "comments", // Place "comments" column last
  ];

  const handleDownload = () => {
    downloadAsXLSX(data, currentLot);
  };

  const handleComments = (value) => {
    setComments(value);
  };

  const handleClose = () => {
    setComments("");
  };

  const values = [];

  // jsx for each row is stored in "row"
  sortedFieldNames.forEach((fieldName, rowIndex) => {
    const row = aggregatedObject[fieldName].map((value, colIndex) => {
      return (
        <div
          key={colIndex}
          className={`${classes["value"]} ${
            rowIndex % 2 ? classes["dark"] : classes["light"]
          }  ${fieldName === "comments" && value && classes["clickable-text"]}`}
          value={value}
          onClick={() =>
            fieldName === "comments" && value.length
              ? handleComments(value)
              : null
          }
        >
          {fieldName === "comments" && value.length ? "Ver" : value}
        </div>
      );
    });

    // jsx for each row is pushed into values array
    values.push(
      <div
        key={rowIndex}
        className={`${classes["grid-column-values"]} ${
          rowIndex === 0 && classes["first-row"]
        }
        ${
          rowIndex === 0 &&
          scrollTop &&
          direction === "vertical" &&
          classes["bottom-shadow"]
        }`}
      >
        {row}
      </div>
    );
  });

  // Handling dynamic box-shadow

  const handleScroll = (event) => {
    const verticalDelta = Math.abs(event.currentTarget.scrollTop - scrollTop);
    const horizontalDelta = Math.abs(
      event.currentTarget.scrollLeft - scrollLeft
    );

    if (verticalDelta > horizontalDelta) {
      setDirection("vertical");
    } else if (horizontalDelta > verticalDelta) {
      setDirection("horizontal");
    }
    setScrollLeft(event.currentTarget.scrollLeft);
    setScrollTop(event.currentTarget.scrollTop);
  };

  let headers = sortedFieldNames.map((fieldName, index) => (
    <div
      key={index}
      className={`${classes["grid-cell"]} ${
        index % 2 ? classes["dark"] : classes["light"]
      } ${index === 0 && classes["first-row"]}
      ${
        index === 0 &&
        scrollTop &&
        direction === "vertical" &&
        classes["bottom-shadow"]
      } ${dictionary[fieldName] && classes["smaller-font"]} 
      ${fieldName === "comments" && classes["smaller-font"]}`}
    >
      {capitalizeFirstLetter(
        dictionary[fieldName]
          ? dictionary[fieldName]
          : fieldName === "comments"
          ? "comentarios"
          : fieldName
      )}
    </div>
  ));

  return (
    <>
      <div className={classes["records-container"]}>
        <SimpleHeading level={5}>Lote {currentLot}</SimpleHeading>
        <div onScroll={handleScroll} className={classes["grid-container"]}>
          <div
            className={`${classes["grid-column"]} ${
              scrollLeft &&
              direction === "horizontal" &&
              classes["right-shadow"]
            }`}
          >
            {headers}
          </div>
          <div className={`${classes.scroll}  `}>
            <div className={classes["values-container"]}>{values}</div>
          </div>
        </div>
        <div className={classes["button-container"]}>
          <ActionButton variation="primary" onClick={handleDownload}>
            Descargar
          </ActionButton>
          <ActionButton
            onClick={() => {
              handleReturn("");
            }}
          >
            Regresar
          </ActionButton>
        </div>
      </div>
      <Modal
        open={!!comments}
        onClose={handleClose}
        onConfirm={null}
        hideConfirm={true}
      >
        <div style={{ fontWeight: "bold" }}>Comentarios:</div>
        <div>{comments}</div>
      </Modal>
    </>
  );
};
export default CollectedData;
