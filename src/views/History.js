import React, { useState } from "react";
import SearchComponent from "../components/SearchComponent";
import classes from "./History.module.css";
import { StyledHeading } from "../utils/styledComponents";
import { queryDynamo } from "../services/queryDynamo";
import { queryDynamoForDates } from "../services/queryDynamoForDates";
import LotsOnRecord from "../components/LotsOnRecord";
import CollectedData from "../components/CollectedData";
import ZoneType from "./ZoneType";
import { formatDateToYYYY_MM_DD } from "../utils/dataHandling";
import ZonesOnRecord from "../components/ZonesOnRecord";
import Modal from "../components/Modal";

const History = ({ isOnline }) => {
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [responseIsEmpty, setResponseIsEmpty] = useState(null);
  const [currentLot, setCurrentLot] = useState("");
  const [zone, setZone] = useState("");
  const [availableDates, setAvailableDates] = useState([]);
  const [type, setType] = useState("");

  const handleSearch = async (selectedDate) => {
    if (!selectedDate) return;

    if (!isOnline) {
      alert("No tienes conexión a internet");
      return;
    }

    setResponseIsEmpty(null);

    setIsLoading(true); // Set loading state to true

    const data = {
      production: type,
      date: formatDateToYYYY_MM_DD(selectedDate),
    };

    try {
      // Performs data fetching based on user_email and date

      const response = await queryDynamo(data);
      setResponse(response);
      setResponseIsEmpty(!response.allEntries.length);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Set loading state to false after response or error
    }
  };

  const handleReturn = (resetZone) => {
    if (resetZone) {
      setZone("");
    } else {
      setResponse(null);
      setResponseIsEmpty(null);
    }
  };

  const handleCurrentLot = (lotname) => {
    setCurrentLot(lotname);
  };

  const handleCurrentZone = (zone) => {
    setZone(zone);
  };

  const handleCheckbox = (type) => {
    //Query Dynamo by the production type

    if (!isOnline) return alert("No hay conexión a internet");

    setIsLoading(true);
    setType(type.toLowerCase());

    queryDynamoForDates(type.toLowerCase())
      .then((res) => {
        setAvailableDates(res);
        if (!res.length) alert(`No hay registros de tipo ${type}`);
        setIsLoading(null);
      })
      .catch((e) => {
        console.log(e);
        setIsLoading(null);
      });
  };

  return (
    <div>
      {!availableDates.length && (
        <>
          <div className={classes["type-container"]}>
            <ZoneType handleCheckbox={handleCheckbox} isLoading={isLoading}>
              Seleccione el tipo a buscar
            </ZoneType>

            <Modal
              open={isLoading}
              children="Cargando fechas disponibles..."
              isLoadingMessage={true}
            />
          </div>
        </>
      )}

      {availableDates.length ? (
        <div className={classes["history-container"]}>
          {responseIsEmpty !== false && (
            <div className={classes.date}>
              <StyledHeading level={4}>Ingrese la fecha a buscar</StyledHeading>
              <SearchComponent
                type={type}
                availableDates={availableDates}
                onSearch={handleSearch}
                handleReturn={() => setAvailableDates([])}
              />
            </div>
          )}
          <Modal
            open={isLoading}
            children="Cargando..."
            isLoadingMessage={true}
          />
          {!isLoading &&
            !zone &&
            (responseIsEmpty === false && response ? (
              <ZonesOnRecord
                data={response}
                handleReturn={handleReturn}
                handleCurrentZone={handleCurrentZone}
              />
            ) : (
              responseIsEmpty && (
                <div className={classes.message}>
                  No existen registros para la fecha seleccionada
                </div>
              )
            ))}
          {!isLoading &&
            zone &&
            !currentLot &&
            (responseIsEmpty === false && response ? (
              <LotsOnRecord
                zone={zone}
                data={response}
                handleReturn={handleReturn}
                handleCurrentLot={handleCurrentLot}
              />
            ) : (
              responseIsEmpty && (
                <div className={classes.message}>
                  No existen registros para la fecha seleccionada
                </div>
              )
            ))}
          {currentLot && (
            <CollectedData
              currentLot={currentLot}
              data={response.entriesByLot[currentLot]}
              handleReturn={handleCurrentLot}
            />
          )}
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default History;
