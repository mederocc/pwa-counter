import React, { useState, useContext, useEffect } from "react";
import DataContext from "../store/data-context";
import Zone from "../components/Zone";
import { SearchField } from "@aws-amplify/ui-react";
import {
  StyledScrollView,
  StyledHeading,
  ReturnButton,
} from "../utils/styledComponents";
import classes from "./Zones.module.css";

function Zones(props) {
  const dataContext = useContext(DataContext);
  const [availableZones, setAvailableZones] = useState([]);
  const [value, setValue] = useState("");
  const [filteredZones, setFilteredZones] = useState(availableZones);

  useEffect(() => {
    if (dataContext.lotsData.length) {
      let zones = [];

      dataContext.lotsData.forEach((lot) => {
        if (lot.monorg_text.toLowerCase() === props.type.toLowerCase()) {
          zones.push(lot.zone);
        }
      });

      zones = [...new Set(zones)];

      setAvailableZones(zones);
    }
  }, [dataContext.lotsData, props.type]);

  useEffect(() => {
    setFilteredZones(availableZones.sort());
  }, [availableZones]);

  const onChange = (event) => {
    setValue(event.target.value);
    if (event.target.value) {
      const filteredData = availableZones.filter((item) =>
        item.toLowerCase().includes(event.target.value.toLowerCase())
      );
      setFilteredZones(filteredData);
    } else {
      setFilteredZones(availableZones);
    }
  };

  const onClear = () => {
    setValue("");
    setFilteredZones(availableZones);
  };

  const myStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    margin: "1rem 0px 2rem 0px",
    width: "22rem",
    alignSelf: "center",
  };

  return (
    <div style={myStyle}>
      <StyledHeading level={4}>Seleccione una zona</StyledHeading>
      <span className={classes.spacing} />
      <SearchField
        label="Search"
        placeholder="Buscar..."
        hasSearchButton={false}
        hasSearchIcon={true}
        onChange={onChange}
        value={value}
        onClear={onClear}
      />
      <StyledScrollView height="20rem">
        {filteredZones.map((zone) => (
          <Zone key={zone} zone={zone} handleClick={props.handleClick} />
        ))}
      </StyledScrollView>
      <div className={classes["bottom-buttons"]}>
        <ReturnButton
          alignSelf="center"
          isFullWidth={true}
          onClick={() => {
            props.handleReset();
          }}
        >
          Volver
        </ReturnButton>
      </div>
    </div>
  );
}

export default Zones;
