import React from "react";
import Dropdown from "../components/Dropdown";
import styles from "./FormContainer.module.css";
import DataContext from "../store/data-context";
import { useContext, useState, useEffect } from "react";
import {
  StyledText,
  ActionButton,
  OuterScrollView,
} from "../utils/styledComponents";
import CommentComponent from "../components/CommentComponent";
import Modal from "../components/Modal";
import getLocation from "../utils/getLocation";

function FormContainer(props) {
  const dataContext = useContext(DataContext);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [comments, setComments] = useState("");
  const [isModalOpen, setIsModalOpen] = useState({
    exit: false,
    submit: false,
  });

  useEffect(() => {
    dataContext.saveQuestions();
    getLocation()
      .then((coordinates) => {
        dataContext.setGeolocation({
          lat: coordinates.lat,
          lon: coordinates.lon,
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        dataContext.setGeolocation({
          lat: -1,
          lon: -1,
        });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { categoriesArr } = dataContext;
  const { lat, lon } = dataContext.geolocation;

  const handleComments = (e) => {
    setComments(e.target.value);
  };

  const handleDropdownOpen = (dropdownId) => {
    setOpenDropdown((prevOpenDropdown) =>
      prevOpenDropdown === dropdownId ? null : dropdownId
    );
  };

  const handleConfirmed = () => {
    const submittedStation = {
      lot: dataContext.lot,
      stationName: dataContext.station.stationName,
      station_id: dataContext.station.station_id,
      geolocation: dataContext.geolocation,
      comments: comments,
      date: new Date(), // stores value as number. Will make querying easier.
    };

    dataContext.categoriesArr.forEach((category) => {
      submittedStation[category] = dataContext[category];
    });

    dataContext.submitStation(submittedStation); // pushes station data to staations array.
    setIsModalOpen((prevState) => ({ ...prevState, submit: false })); // closes modal.
    props.handleReset("station_id"); // removes station from current selection.
  };

  const showEllipsis = (value) => {
    return `${Math.round((value + Number.EPSILON) * 1000000) / 1000000}...`;
  };

  return (
    <div className={styles["form-container"]}>
      <div className={styles.top}>
        <StyledText fontSize="1.5rem" fontWeight="800">
          {dataContext.lot.name}
        </StyledText>
        <StyledText fontSize="1.3rem" fontWeight="600">
          {dataContext.station.stationName}
        </StyledText>
        {
          <StyledText fontSize="1.3rem" fontWeight="600">
            {lat
              ? `${showEllipsis(lat)}, ${showEllipsis(lon)}`
              : "Obteniendo geolocalización"}
          </StyledText>
        }
      </div>

      <OuterScrollView>
        {categoriesArr.length
          ? categoriesArr.map((category, index) => (
              <Dropdown
                key={`${category} ${index}`}
                gender={category}
                isOpen={openDropdown === index}
                onOpen={() => handleDropdownOpen(index)}
              />
            ))
          : ""}

        <CommentComponent
          handleComments={handleComments}
          comments={comments}
          isOpen={openDropdown === "comments"}
          onOpen={() => handleDropdownOpen("comments")}
        />
      </OuterScrollView>

      <div className={styles["button-container"]}>
        <ActionButton
          variation="primary"
          onClick={() => {
            if (!Object.keys(dataContext.geolocation).length) {
              alert("Espere a que se obtenga la geolocalización");
              return;
            }
            setIsModalOpen((prevState) => ({ ...prevState, submit: true }));
          }}
        >
          Guardar
        </ActionButton>
        <ActionButton
          onClick={() => {
            setIsModalOpen((prevState) => ({ ...prevState, exit: true }));
          }}
        >
          Cancelar
        </ActionButton>
      </div>

      {isModalOpen.submit && (
        <Modal
          open={isModalOpen.submit}
          onClose={() => {
            setIsModalOpen((prevState) => ({ ...prevState, submit: false }));
          }}
          onConfirm={handleConfirmed}
        >
          ¿Está seguro de guardar el conteo? No podrá ser editado.
        </Modal>
      )}

      {isModalOpen.exit && (
        <Modal
          open={isModalOpen.exit}
          onClose={() => {
            setIsModalOpen((prevState) => ({ ...prevState, exit: false }));
          }}
          onConfirm={() => {
            props.handleReset("station_id");
          }}
        >
          ¿Está seguro de salir de la página sin guardar la información?
        </Modal>
      )}
    </div>
  );
}

export default FormContainer;
