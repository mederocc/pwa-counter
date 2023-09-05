import DataContext from "./data-context";
import { useReducer } from "react";
import { getGroupedCategories } from "../utils/dataHandling";

const defaultState = {
  tokens: JSON.parse(localStorage.getItem("tokens")) || {},

  username: JSON.parse(localStorage.getItem("username")) || "",

  lotsData: JSON.parse(localStorage.getItem("lotsData")) || [],

  questions: JSON.parse(localStorage.getItem("questions")) || [], // Guarda las preguntas correspondientes al lote seleccionado

  categoriesArr: JSON.parse(localStorage.getItem("categoriesArr")) || [],

  workflowToQuestions:
    JSON.parse(localStorage.getItem("workflowToQuestions")) || {}, // Guarda las preguntas correspondientes para cada workflow

  questionDictionary:
    JSON.parse(localStorage.getItem("questionDictionary")) || {},

  numberOfStations: JSON.parse(localStorage.getItem("numberOfStations")) || 0, // For current lot only

  lot: JSON.parse(localStorage.getItem("lot")) || null,

  submittedStations:
    JSON.parse(localStorage.getItem("submittedStations")) || [],

  station: JSON.parse(localStorage.getItem("station")) || null, // For current station only

  geolocation: {}, // For current station only

  comments: null, // For current station only
};

const reducer = (state, action) => {
  switch (action.type) {
    case "STORE_TOKENS": {
      localStorage.setItem("tokens", JSON.stringify(action.tokens));

      return { ...state, tokens: action.tokens };
    }

    case "STORE_USERNAME": {
      localStorage.setItem("username", JSON.stringify(action.username));
      return { ...state, username: action.username };
    }

    case "REMOVE_USER": {
      localStorage.clear();

      return { ...state, tokens: {}, username: "" };
    }

    case "ADD_TO_CATEGORY": {
      const updatedState = {
        ...state,
        [action.payload.gender]: {
          ...state[action.payload.gender],
          [action.payload.name]:
            state[action.payload.gender][action.payload.name] + 1,
        },
      };

      localStorage.setItem(
        action.payload.gender,
        JSON.stringify(updatedState[action.payload.gender])
      );
      return updatedState;
    }

    case "REMOVE_FROM_CATEGORY": {
      if (state[action.payload.gender][action.payload.name] === 0) return state;
      const updatedState = {
        ...state,
        [action.payload.gender]: {
          ...state[action.payload.gender],
          [action.payload.name]:
            state[action.payload.gender][action.payload.name] - 1,
        },
      };

      localStorage.setItem(
        action.payload.gender,
        JSON.stringify(updatedState[action.payload.gender])
      );

      return updatedState;
    }

    case "SET_GEOLOCATION": {
      return { ...state, geolocation: action.geolocation };
    }

    case "SET_BASE_VALUES": {
      const { lot, station_id, stationName } = action.values;

      if (lot) {
        let { areainhectares } = lot;
        areainhectares = parseFloat(areainhectares);
        const numberOfStations =
          60 < areainhectares && areainhectares <= 70
            ? 6
            : 70 < areainhectares && areainhectares <= 80
            ? 7
            : 80 < areainhectares && areainhectares <= 90
            ? 8
            : 90 < areainhectares && areainhectares <= 100
            ? 9
            : 100 < areainhectares && areainhectares <= 110
            ? 10
            : 110 < areainhectares && areainhectares <= 120
            ? 11
            : 120 < areainhectares && areainhectares <= 130
            ? 12
            : 5;

        localStorage.setItem("lot", JSON.stringify(lot));
        localStorage.setItem("numberOfStations", numberOfStations);

        return {
          ...state,
          lot,
          numberOfStations,
        };
      }

      if (station_id) {
        localStorage.setItem(
          "station",
          JSON.stringify({ station_id, stationName })
        );
        return {
          ...state,
          station: { station_id, stationName },
        };
      }
      break;
    }

    case "CLEAR_STATION_DATA": {
      /**
       * Resetea contadores a 0
       */
      const categoryArr = getGroupedCategories(state.questions);
      for (let key in categoryArr) {
        const categoryObj = {};
        categoryArr[key].forEach((entry) => {
          categoryObj[entry.questiontext_ARG] = 0;
        });

        state[key] = categoryObj;
        localStorage.setItem(key, JSON.stringify(categoryObj));
      }

      localStorage.removeItem("station");

      return {
        ...state,
        station: null,
        geolocation: {},
        comments: null,
      };
    }

    case "CLEAR_LOT_DATA": {
      state.categoriesArr.forEach((cat) => {
        localStorage.removeItem(cat);

        delete state[cat];
      });

      localStorage.removeItem("submittedStations");
      localStorage.removeItem("numberOfStations");
      localStorage.removeItem("lot");

      localStorage.removeItem("categoriesArr");
      localStorage.removeItem("questions");
      localStorage.removeItem("questionDictionary");

      return {
        ...state,
        numberOfStations: 0,
        lot: null,
        submittedStations: [],
        questions: [],
      };
    }

    case "SAVE_API_LOTS_DATA": {
      localStorage.setItem("lotsData", JSON.stringify(action.lotsData));
      return {
        ...state,
        lotsData: action.lotsData,
      };
    }

    case "SAVE_QUESTIONS_BY_WORKFLOWS": {
      localStorage.setItem(
        "workflowToQuestions",
        JSON.stringify(action.workflowToQuestions)
      );

      // Create a dictionary as well

      const newObject = {};

      for (const key in action.workflowToQuestions) {
        for (const item of action.workflowToQuestions[key]) {
          const questioncode = item["questioncode"];
          const questiontext_ARG = item["questiontext_ARG"];

          // Check if both questioncode and questiontext_ARG are not empty
          if (questioncode && questiontext_ARG) {
            newObject[questioncode] = questiontext_ARG;
          }
        }
      }

      localStorage.setItem("fullQuestionDictionary", JSON.stringify(newObject));

      return {
        ...state,
        workflowToQuestions: action.workflowToQuestions,
      };
    }

    case "SAVE_QUESTIONS": {
      //  En este case, se guardan las preguntas recibidas.
      //  También se crean keys con los criterios de búsqueda.

      //  Agrupa las preguntas según categoría

      const { workflowToQuestions } = state;

      const workflow = state.lot["workflow.name"];

      const currentSetofQuestions = workflowToQuestions[workflow];

      //  Creo un diccionario para las preguntas. Servirá cuando deba enviar los datos a la base de datos.
      const questionDictionary = {};

      currentSetofQuestions.forEach((q) => {
        if (q.questioncode) {
          questionDictionary[q.questiontext_ARG] = q.questioncode;
        }
      });

      //  Se agrupan las preguntas filtradas según la categoría de cada pregunta
      const groupedData = getGroupedCategories(currentSetofQuestions);

      //  Se guardan un array con los nombres de las categorías filtadas, esto servirá para seleccionarlas dinámicamente.
      let categoriesArr = Object.keys(groupedData);

      categoriesArr = categoriesArr.filter((cat) => cat.length);

      //  Crea contadores según las preguntas de cada categoría y los setea a 0

      for (let key in groupedData) {
        const storageValues = JSON.parse(localStorage.getItem(key));

        const categoryObj = {};

        groupedData[key].forEach((entry) => {
          categoryObj[entry.questiontext_ARG] =
            storageValues && storageValues[entry.questiontext_ARG]
              ? storageValues[entry.questiontext_ARG]
              : 0;
        });

        !storageValues &&
          localStorage.setItem(key, JSON.stringify(categoryObj));

        state[key] = categoryObj;
      }

      localStorage.setItem("categoriesArr", JSON.stringify(categoriesArr));
      localStorage.setItem("questions", JSON.stringify(currentSetofQuestions));
      localStorage.setItem(
        "questionDictionary",
        JSON.stringify(questionDictionary)
      );

      return {
        ...state,
        categoriesArr,
        questions: currentSetofQuestions,
        questionDictionary,
      };
    }

    case "SUBMIT_STATION": {
      // Resetea contadores a 0
      const groupedCategories = getGroupedCategories(state.questions);
      for (let key in groupedCategories) {
        const categoryObj = {};
        groupedCategories[key].forEach((entry) => {
          categoryObj[entry.questiontext_ARG] = 0;
        });

        state[key] = categoryObj;
      }

      localStorage.removeItem("station");

      const newState = {
        ...state,
        submittedStations: [...state.submittedStations, action.stationData],
        station: null,
        geolocation: {},
        comments: null,
      };

      localStorage.setItem(
        "submittedStations",
        JSON.stringify(newState.submittedStations)
      );

      return newState;
    }

    case "INCREASE_STATIONS": {
      return {
        ...state,
        numberOfStations: state.numberOfStations + 1,
      };
    }

    default:
      return state;
  }
};

const DataProvider = (props) => {
  const [state, dispatchAction] = useReducer(reducer, defaultState);

  const storeTokens = (tokens) => {
    dispatchAction({ type: "STORE_TOKENS", tokens });
  };

  const storeUsername = (username) => {
    dispatchAction({ type: "STORE_USERNAME", username });
  };

  const removeUser = () => {
    dispatchAction({ type: "REMOVE_USER" });
  };

  const addToCategory = (gender, name) => {
    dispatchAction({ type: "ADD_TO_CATEGORY", payload: { gender, name } });
  };

  const removeFromCategory = (gender, name) => {
    dispatchAction({ type: "REMOVE_FROM_CATEGORY", payload: { gender, name } });
  };

  const setGeolocation = (geolocation) => {
    dispatchAction({ type: "SET_GEOLOCATION", geolocation });
  };

  const setBaseValues = (values) => {
    dispatchAction({ type: "SET_BASE_VALUES", values });
  };

  const clearStationData = () => {
    dispatchAction({ type: "CLEAR_STATION_DATA" });
  };

  const clearLotData = () => {
    dispatchAction({ type: "CLEAR_LOT_DATA" });
  };

  const saveApiLotsData = (lotsData) => {
    dispatchAction({ type: "SAVE_API_LOTS_DATA", lotsData });
  };

  const saveQuestionsByWorkFlows = (workflowToQuestions) => {
    dispatchAction({
      type: "SAVE_QUESTIONS_BY_WORKFLOWS",
      workflowToQuestions,
    });
  };

  const saveQuestions = (payload) => {
    dispatchAction({ type: "SAVE_QUESTIONS", payload });
  };

  const submitStation = (stationData) => {
    dispatchAction({ type: "SUBMIT_STATION", stationData });
  };

  const increaseNumberOfStations = () => {
    dispatchAction({ type: "INCREASE_STATIONS" });
  };

  const dataContext = {
    ...state, // some values (counting criteria) are set dynamically.
    storeTokens,
    storeUsername,
    removeUser, // remove all stored data on user logout or invalid session
    addToCategory, // add 1 to count for a given question
    removeFromCategory, // take 1 from count for a given question
    setBaseValues, // save data of the selected lot, calculate number of stations
    clearStationData, // clears data for the current station
    clearLotData, // deselects lot and related data
    setGeolocation,
    saveApiLotsData, // fetches all available lots to choose from
    saveQuestionsByWorkFlows,
    saveQuestions, // fetches set of questions whose workflow matches the selected lot
    submitStation, // pushes station count object to the submittedStations array
    increaseNumberOfStations,
  };

  return (
    <DataContext.Provider value={dataContext}>
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
