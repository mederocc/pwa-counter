import {
  Heading,
  ScrollView,
  Button,
  Text,
  CheckboxField,
} from "@aws-amplify/ui-react";
import styled from "styled-components";

export const StyledHeading = styled(Heading)`
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 1rem;
  margin-bottom: 0.5rem;
`;

export const SimpleHeading = styled(Heading)`
  margin-top: 6vh;
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StyledSubHeading = styled(Text)`
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.5rem;
`;

export const StyledText = styled(Text)`
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 0.25rem;
  background-color: #cccccc;
  height: 2rem;
  font-size: ${(props) => props.fontSize || "1rem"};
  font-weight: ${(props) => props.fontWeight || "400"};
`;

export const Title = styled(Text)`
  white-space: nowrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;

  margin-bottom: 0.5rem;
  background-color: #cccccc;
  height: 2rem;
  font-size: ${(props) => props.fontSize || "1rem"};
  font-weight: ${(props) => props.fontWeight || "400"};
`;

export const WrappedHeading = styled(Heading)`
  white-space: wrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: whitesmoke;
`;

export const WrappedText = styled(Text)`
  white-space: wrap;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background-color: whitesmoke;
  font-size: ${(props) => props.fontSize || "1rem"};
  font-weight: ${(props) => props.fontWeight || "400"};
`;

export const StyledScrollView = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  padding: 0.25rem 0px;

  margin-top: 1rem;
  box-shadow: inset 0px -50px 68px -29px rgba(0, 0, 0, 0.1);
  border-radius: 2%;

  // border: red solid 3px;
`;

export const SmallerScrollView = styled(ScrollView)`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;

  // border: blue solid 3px;
  // max-height: 60vh;
`;

export const OuterScrollView = styled(ScrollView)`
  display: flex;
  flex-direction: column;
  height: 50vh;
  // border: green solid 3px;
  padding: 1rem 0px;
  width: 22rem;

  // box-shadow: inset 0px -50px 68px -29px rgba(0, 0, 0, 0.1);
  border-radius: 2%;
`;

export const StyledButton = styled(Button)`
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  height: 3rem;
  cursor: default;
  padding: 2rem;

  &:disabled {
    cursor: default;
    border-color: darkgray;
  }
`;

export const ActionButton = styled(Button)`
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  min-height: 3rem;
  cursor: default;
  width: 22rem;

  &:disabled {
    cursor: default;
    border-color: darkgray;
  }
`;

export const AddStationButton = styled(Button)`
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  width: 50px;
  height: 50px;
  line-height: 50px;
  border-radius: 50%;
  background-color: whitesmoke;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  outline: none;
  align-self: center;
  border: 1px solid gray;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const StackedButton = styled(Button)`
  border-radius: 0px;
  margin-bottom: 0.1rem;
  cursor: default;
`;

export const ReturnButton = styled(Button)`
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  cursor: default;
  width: 22rem;
`;

export const ModalButton = styled(Button)`
  min-height: 3rem;
  width: 8rem;
  margin: 0.8rem;
  cursor: default;
`;

export const SentButton = styled(Button)`
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
  min-height: 3rem;
  background-color: rgb(4, 149, 97);
  color: white;
  padding: 2rem;

  // border-color: darkgray;
  &:hover {
    // border-color: darkgray;
    background-color: rgb(4, 149, 97);
    color: white;
  }

  &:disabled {
    cursor: default;
  }
`;

export const NavButton = styled(Button)`
  min-height: 3rem;
  width: 8rem;
  margin: 0.8rem;
  cursor: default;
  white-space: nowrap;
`;

export const StyledCheckboxField = styled(CheckboxField)`
  margin-left: 0.5rem;
  margin-right: 1rem;
`;
