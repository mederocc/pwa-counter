// getValuesByKey will set a single format for the usergroupnames key. It's used by the getMappedLotArr function.
function getValuesByKey(array, key) {
  const values = array.map((item) => item[key]);

  const dictionary = {};

  values.forEach((value) => {
    const lowercaseValue = value.toLowerCase();
    if (lowercaseValue.includes("zona ") && lowercaseValue.includes("lotes")) {
      const startIndex = value.indexOf(" ", value.indexOf(" ") + 1) + 1;
      let endIndex = value.indexOf(" ", startIndex);
      if (endIndex === -1 || value[endIndex + 1] === "_") {
        endIndex = value.indexOf("_", startIndex);
      }
      const letter = lowercaseValue
        .substring(startIndex, endIndex)
        .toLowerCase();

      const transformedValue = `zone_${letter.toLowerCase()}`;

      dictionary[value] = transformedValue;
    } else if (lowercaseValue.startsWith("zone_")) {
      const index = lowercaseValue.indexOf(
        "_",
        lowercaseValue.indexOf("_") + 1
      );
      if (index !== -1) {
        dictionary[value] = lowercaseValue.substring(0, index);
      }
    } else {
      const letter = lowercaseValue.charAt(lowercaseValue.indexOf("zona ") + 5);
      const transformedValue = `zone_${letter.toLowerCase()}`;

      dictionary[value] = transformedValue;
    }
  });

  const mappedDictionary = {};

  for (let key in dictionary) {
    mappedDictionary[key] = dictionary[key].replace(
      /zone_([a-zA-Z])/,
      (_, letter) => `Zona ${letter.toUpperCase()}`
    );
  }

  return mappedDictionary;
}

// getMappedLotArr generates a mapped array with a single-format value for usergroupnames in an additional 'zone' key.

const getMappedLotArr = (lotArr) => {
  const filteredArr = lotArr.filter((entry) => "usergroupnames" in entry);

  const mappedArr = filteredArr.map((entry) => {
    return {
      ...entry,
      zone: getValuesByKey(filteredArr, "usergroupnames")[entry.usergroupnames],
      lot_id: entry.year,
    };
  });

  return mappedArr;
};

function getStations(iterations) {
  const stations = [];

  for (let i = 1; i <= iterations; i++) {
    const station = {
      station_id: i,
      stationName: `Estación ${i}`,
    };
    stations.push(station);
  }

  return stations;
}

// getGroupedCategories groups questions according to their "workflow" property
const getGroupedCategories = (questionsObj) => {
  const groupedData = {};

  questionsObj.forEach((item) => {
    const category = item.category;
    if (groupedData[category]) {
      groupedData[category].push(item);
    } else {
      groupedData[category] = [item];
    }
  });

  return groupedData;
};

// extractWorkflowSet returns the available workflows
function extractWorkflowSet(arrayOfObjects) {
  const workflowSet = new Set();

  for (const obj of arrayOfObjects) {
    if (obj.hasOwnProperty("workflow.name") && obj["workflow.name"].length) {
      workflowSet.add(obj["workflow.name"]);
    }
  }

  return workflowSet;
}

function generateRandomNumberSeries(length) {
  let randomNumberSeries = "";
  for (let i = 0; i < length; i++) {
    const randomDigit = Math.floor(Math.random() * 10); // Generates a random digit from 0 to 9
    randomNumberSeries += randomDigit;
  }
  return randomNumberSeries;
}

function formatDateToYYYY_MM_DD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function mergeObjectsByStation(data) {
  // Merges values for a repeating stations for a single lot on the same day

  const mergedData = {};

  data.forEach((item) => {
    const station = item.station;

    if (station !== undefined) {
      if (!mergedData[station]) {
        mergedData[station] = {
          ...item,
          comments: item.comments ? [wrapInDiv(item.comments)] : [],
        };
      } else {
        for (const key in item) {
          if (key !== "station") {
            if (key === "comments") {
              if (item[key]) {
                mergedData[station][key].push(wrapInDiv(item[key]));
              }
            } else {
              mergedData[station][key] =
                (mergedData[station][key] || 0) + item[key];
            }
          }
        }
      }
    }
  });

  return Object.values(mergedData);
}

function wrapInDiv(content) {
  return <div key={Math.random()}>{content}</div>;
}

export {
  getMappedLotArr,
  getStations,
  getGroupedCategories,
  extractWorkflowSet,
  generateRandomNumberSeries,
  formatDateToYYYY_MM_DD,
  mergeObjectsByStation,
};
