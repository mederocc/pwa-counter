import React from "react";

const DataContext = React.createContext({
  tokens: {},
  username: "",
  lotsData: [],
  questions: [],
  categoriesArr: [],
  workflowToQuestions: {},
  questionDictionary: {},
  numberOfStations: 0,
  lot: null,
  submittedStations: [],
  station: null,
  geolocation: {},
  comments: null,
  storeTokens: (tokens) => {},
  removeUser: () => {},
  addToCategory: (category, name) => {},
  removeFromCategory: (category, name) => {},
  setGeolocation: (geolocation) => {},
  setBaseValues: (values) => {}, // Can set values for either the current lot or current station
  clearStationData: () => {}, // Clears all values when a user exits their chosen station.
  clearLotData: () => {},
  saveApiLotsData: (lotsData) => {}, // Stores the fetched lot data.
  saveQuestionsByWorkFlows: (payload) => {}, // Guarda las preguntas disponibles, separadas según los diferentes workflows
  saveQuestions: (payload) => {},
  submitStation: (stationData) => {}, // Pushes station data into submittedStations array.
  storeUsername: (username) => {},
  storeUserEmail: (userEmail) => {},
  increaseNumberOfStations: () => {},
});

export default DataContext;
