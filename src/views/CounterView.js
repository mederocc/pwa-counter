import React, { useEffect, useContext, useState } from "react";
import DataContext from "../store/data-context";
import classes from "./CounterView.module.css";
import { getMappedLotArr, extractWorkflowSet } from "../utils/dataHandling";
import Zones from "./Zones";
import Lots from "./Lots";
import Stations from "./Stations";
import FormContainer from "./FormContainer";

import ZoneType from "./ZoneType";
import { fetchFromS3 } from "../services/fetchFromS3";

function CounterView({ isOnline }) {
  const dataContext = useContext(DataContext);
  const [selection, setSelection] = useState({
    zone: "",
    lot_id: null,
    station_id: null,
  });

  const [typeFilter, setTypeFilter] = useState("");

  const handleCheckbox = (type) => {
    if (!dataContext.lotsData.length) return;

    setTypeFilter(type);
  };

  const resetType = () => {
    setTypeFilter("");
  };

  useEffect(() => {
    // Fetches data, if lots are either not available in localStorage or they have not been fetched and stored yet

    if (isOnline) {
      if (!dataContext.lotsData.length) {
        fetchFromS3()
          .then((res) =>
            dataContext.saveApiLotsData(
              getMappedLotArr(JSON.parse(JSON.stringify(res.data)))
            )
          )
          .catch((e) => console.log(e));
      }

      if (
        dataContext.lotsData &&
        !Object.keys(dataContext.workflowToQuestions).length
      ) {
        const workflows = extractWorkflowSet(dataContext.lotsData);
        const promises = Array.from(workflows).map((workflow) => {
          return fetchFromS3(
            `${process.env.REACT_APP_FILE_PATH ?? ""}${workflow}.csv`
          );
        });
        Promise.all(promises)
          .then((res) => {
            const workflowToQuestions = Object.assign({}, ...res);
            dataContext.saveQuestionsByWorkFlows(workflowToQuestions);
          })
          .catch((e) => console.log(e));
      }
    }

    if (dataContext.lot && !dataContext.questions.length) {
      dataContext.saveQuestions();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataContext.lotsData, dataContext.lot]);

  //Handles the selected lot and station.
  const handleClick = (key, value) => {
    setSelection((prevSelection) => ({
      ...prevSelection,
      [key]: value,
    }));
  };

  // Allows user to reselect values.
  const handleReset = (value) => {
    if (value === "zone") {
      setSelection({
        zone: "",
        lot_id: null,
        station_id: null,
      });
    }

    if (value === "lot_id") {
      setSelection((prevState) => ({
        ...prevState,
        lot_id: null,
        station_id: null,
      }));
      dataContext.clearLotData();
    }

    if (value === "station_id") {
      setSelection((prevState) => ({
        ...prevState,
        station_id: null,
      }));
      dataContext.clearStationData();
    }
  };

  const handleResetAllSelection = () => {
    setSelection({
      zone: "",
      lot_id: null,
      station_id: null,
    });
  };

  return (
    <>
      <div className={classes["component-container"]}>
        {!typeFilter && !dataContext.lot ? (
          <ZoneType handleCheckbox={handleCheckbox}>
            Seleccione el tipo a contar
          </ZoneType>
        ) : (
          ""
        )}
        {dataContext.lotsData.length && typeFilter && !selection.zone ? (
          <Zones
            handleReset={resetType}
            type={typeFilter}
            handleClick={handleClick}
          />
        ) : (
          ""
        )}
        {selection.zone && !dataContext.lot && (
          <Lots
            zone={selection.zone}
            type={typeFilter}
            handleClick={handleClick}
            handleReset={handleReset}
          />
        )}
        {dataContext.lot && !dataContext.station && (
          <Stations
            isOnline={isOnline}
            handleClick={handleClick}
            lot_id={dataContext.lot.feature_id}
            handleReset={handleReset}
            handleResetAllSelection={handleResetAllSelection}
          />
        )}
        {dataContext.lot && dataContext.station && (
          <FormContainer handleReset={handleReset} />
        )}
      </div>
    </>
  );
}

export default CounterView;
