import React, { useContext, useEffect, useState } from "react";
import Station from "../components/Station";
import {
  StyledScrollView,
  StyledHeading,
  ActionButton,
  AddStationButton,
} from "../utils/styledComponents";
import DataContext from "../store/data-context";
import Modal from "../components/Modal";
import { getStations } from "../utils/dataHandling";
import styles from "./Stations.module.css";
import { writeToDynamoDB } from "../services/writeToDynamoDB";
import {
  generateRandomNumberSeries,
  formatDateToYYYY_MM_DD,
} from "../utils/dataHandling";

// This component renders stations.
// It also sends the request to write to the DynamoDB table once all sations have been saved.

function Stations(props) {
  const { isOnline, handleResetAllSelection } = props;
  const dataContext = useContext(DataContext);
  const stations = getStations(dataContext.numberOfStations);
  const { submittedStations } = dataContext;
  const [isModalOpen, setIsModalOpen] = useState({
    exit: false,
    submit: false,
    newStationRequest: false,
  });
  const [didSendTotalCount, setDidSetTotalCount] = useState(false);
  const [dynamoResponse, setDynamoResponse] = useState("");
  const [isLoading, setIsLoading] = useState(null);

  const stationIds = [];

  submittedStations.forEach((station) => {
    stationIds.push(station.station_id);
  });
  const filteredStations = stations.map((station) => {
    return { ...station, isDisabled: stationIds.includes(station.station_id) };
  });

  const handleConfirmationModal = () => {
    if (!isOnline) {
      alert("No tienes conexión a internet");
      return;
    }

    setIsModalOpen((prevState) => ({ ...prevState, submit: true }));
  };

  const handleSend = () => {
    setIsLoading(true);
    const data = [];

    dataContext.submittedStations.forEach((station) => {
      const lot_name = `${station.lot.monorg_text.toLowerCase()}-${
        station.lot.zone.toLowerCase().split(" ")[1]
      }-${generateRandomNumberSeries(10)}-${station.lot.name}`;
      const stationObj = {
        station: station.station_id,
        latitude: station.geolocation.lat,
        longitude: station.geolocation.lon,
        feature_id: station.lot.feature_id || "NOT_DEFINED",
        lot_name,
        production: station.lot.monorg_text.toLowerCase(),
        comments: station.comments,
        user_email: localStorage.getItem("userEmail"),
        date: formatDateToYYYY_MM_DD(station.date), // stores value as number. Will make querying easier.
      };

      dataContext.categoriesArr.forEach((category) => {
        for (let key in station[category]) {
          stationObj[dataContext.questionDictionary[key]] =
            station[category][key];
        }
      });

      data.push(stationObj);
    });

    // Ejecuta función para enviar los datos a la tabla de DynamoDB
    writeToDynamoDB(data)
      .then((res) => {
        console.log(res);
        setIsModalOpen((prevState) => ({ ...prevState, submit: false }));
        setDidSetTotalCount(true);
        setDynamoResponse(
          res.statusCode === 200
            ? "Los datos fueron enviados con éxito"
            : res.error
        );
        localStorage.removeItem("availableDates");
        setIsLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setIsModalOpen((prevState) => ({ ...prevState, submit: false }));
        setDidSetTotalCount(true);
        setDynamoResponse(e.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (dynamoResponse) {
      // SET A TIMEOUT TO REDERICT (CLEAR DATA, ACTUALLY) AFTER DATE IS SENT
      // setTimeout()

      setTimeout(() => {
        handleResetAllSelection();
        dataContext.clearLotData();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamoResponse]);

  const handleReturn = () => {
    // Hace una advertencia antes de regresar si hay datos en submittedStations
    if (dataContext.submittedStations.length) {
      setIsModalOpen((prevState) => ({ ...prevState, exit: true }));
    } else {
      props.handleReset("lot_id");
    }
  };

  const isDisabled =
    dataContext.submittedStations.length < filteredStations.length;

  const myStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    magin: "1rem 0px",
    width: "22rem",
    alignSelf: "center",
  };

  return (
    <>
      <div style={myStyle}>
        <StyledHeading level={4}>Seleccione una estación</StyledHeading>
        <span className={styles.spacing} />

        <StyledScrollView height="20rem" width="100%">
          {filteredStations.map((station) => (
            <Station
              key={station.station_id}
              station={station}
              handleClick={props.handleClick}
            />
          ))}
          <AddStationButton
            onClick={() => {
              setIsModalOpen((prevState) => ({
                ...prevState,
                newStationRequest: !prevState.newStationRequest,
              }));
            }}
          >
            +
          </AddStationButton>
        </StyledScrollView>
        {isModalOpen.exit && (
          <Modal
            open={isModalOpen.exit}
            onClose={() => {
              setIsModalOpen((prevState) => ({ ...prevState, exit: false }));
            }}
            onConfirm={() => {
              props.handleReset("lot_id");
            }}
          >
            <div>¿Está seguro de volver?</div>
            <div>Se perderán los datos recogidos.</div>
          </Modal>
        )}
        {isModalOpen.newStationRequest && (
          <Modal
            open={isModalOpen.newStationRequest}
            onClose={() => {
              setIsModalOpen((prevState) => ({
                ...prevState,
                newStationRequest: false,
              }));
            }}
            onConfirm={() => {
              dataContext.increaseNumberOfStations();
              setIsModalOpen((prevState) => ({
                ...prevState,
                newStationRequest: false,
              }));
            }}
          >
            ¿Quiere crear otra estación?
          </Modal>
        )}
        {!isLoading && (
          <Modal
            open={isModalOpen.submit}
            onClose={() => {
              setIsModalOpen((prevState) => ({ ...prevState, submit: false }));
            }}
            onConfirm={handleSend}
          >
            ¿Seguro quiere enviar los datos del lote?
          </Modal>
        )}
        {dynamoResponse && (
          <Modal open={didSendTotalCount} isConfirmationMessage={true}>
            {dynamoResponse}
          </Modal>
        )}
        <Modal
          open={isLoading}
          children="Cargando..."
          isLoadingMessage={true}
        />
        <div className={styles["button-container"]}>
          <ActionButton
            isDisabled={isDisabled}
            variation="primary"
            onClick={handleConfirmationModal}
          >
            Enviar
          </ActionButton>

          <ActionButton onClick={handleReturn}>Volver</ActionButton>
        </div>
      </div>
    </>
  );
}

export default Stations;
