import React from "react";
import { StackedButton, SmallerScrollView } from "../utils/styledComponents";
import DataContext from "../store/data-context";
import { useContext } from "react";
import Counter from "./Counter";

const Dropdown = ({ gender, isOpen, onOpen }) => {
  const dataContext = useContext(DataContext);

  const keys = Object.keys(
    dataContext[gender] || JSON.parse(localStorage.getItem(gender))
  );

  const counters = keys.map((key, index) => {
    return <Counter key={key} gender={gender} name={key} index={index} />;
  });

  return (
    <>
      <StackedButton variation="primary" onClick={onOpen}>
        {gender}
      </StackedButton>
      {isOpen && <SmallerScrollView>{counters}</SmallerScrollView>}
    </>
  );
};

export default Dropdown;
