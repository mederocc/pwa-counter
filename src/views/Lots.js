import React, { useState, useContext, useEffect } from "react";
import Lot from "../components/Lot";
import { SearchField } from "@aws-amplify/ui-react";
import {
  StyledScrollView,
  StyledHeading,
  ReturnButton,
} from "../utils/styledComponents";
import classes from "./Lots.module.css";
import DataContext from "../store/data-context";

function Lots(props) {
  const [value, setValue] = useState("");
  const dataContext = useContext(DataContext);
  let lots = dataContext.lotsData.filter(
    (entry) =>
      entry.zone === props.zone &&
      entry.monorg_text.toLowerCase() === props.type.toLowerCase()
  );
  lots = lots.sort((a, b) => a.name.localeCompare(b.name));
  const [filteredLots, setFilteredLots] = useState(lots); // los lotes luego son filtrados por el search bar

  useEffect(() => {
    if (value) {
      const filteredData = lots.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLots(filteredData);
    } else {
      setFilteredLots(lots);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const onChange = (e) => {
    if (e.target.name === "Search") {
      setValue(e.target.value);
    }
  };

  const onClear = () => {
    setValue("");
    setFilteredLots(lots);
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
      <StyledHeading level={4}>Seleccione un lote</StyledHeading>
      <span className={classes.spacing} />

      <SearchField
        label="Search"
        placeholder="Buscar..."
        hasSearchButton={false}
        hasSearchIcon={true}
        onChange={onChange}
        value={value}
        onClear={onClear}
        name="Search"
      />

      <StyledScrollView height="20rem">
        {filteredLots.map((lot) => (
          <Lot key={lot.feature_id} lot={lot} handleClick={props.handleClick} />
        ))}
      </StyledScrollView>
      <div className={classes["bottom-buttons"]}>
        {" "}
        <ReturnButton
          isFullWidth={true}
          onClick={() => {
            props.handleReset("zone");
          }}
        >
          Volver
        </ReturnButton>
      </div>
    </div>
  );
}

export default Lots;
