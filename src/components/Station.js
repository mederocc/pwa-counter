import React, { useState } from "react";
import { StyledButton, SentButton } from "../utils/styledComponents";
import DataContext from "../store/data-context";
import { useContext } from "react";
import getLocation from "../utils/getLocation";
import Modal from "../components/Modal";

function Station(props) {
  const dataContext = useContext(DataContext);
  const { handleClick, station } = props;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleGetLocation = () => {
    getLocation()
      .then((coordinates) => {
        dataContext.setGeolocation({
          lat: coordinates.lat,
          lon: coordinates.lon,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
      }); // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const handleSelection = () => {
    handleClick("station_id", station.station_id);
    dataContext.setBaseValues({
      station_id: station.station_id,
      stationName: station.stationName,
    });

    handleGetLocation();
  };

  return (
    <>
      {!props.station.isDisabled ? (
        <StyledButton
          variation="primary"
          onClick={() => {
            setIsModalOpen(true);
          }}
        >
          {station.stationName}
        </StyledButton>
      ) : (
        <SentButton variation="primary" isDisabled={props.station.isDisabled}>
          {station.stationName}
        </SentButton>
      )}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => {
            setIsModalOpen((prevState) => !prevState);
          }}
          onConfirm={handleSelection}
        >
          <div>¿Ya está en la estación?</div>
          <div>Se fijará su ubicación.</div>
        </Modal>
      )}
    </>
  );
}

export default Station;
