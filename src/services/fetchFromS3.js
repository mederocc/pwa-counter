import S3 from "aws-sdk/clients/s3";
import Papa from "papaparse";

const bucketName = process.env.REACT_APP_BUCKET_NAME;
const keyPrefix = process.env.REACT_APP_KEY_PREFIX;

// const bucketName = "nonb-bucket";
// const keyPrefix = "2023-lotes.csv";

export const fetchFromS3 = async (key) => {
  const s3 = new S3();

  return new Promise((resolve, reject) => {
    s3.getObject({ Bucket: bucketName, Key: key ?? keyPrefix }, (err, data) => {
      if (err) {
        console.log("Error", err);
        reject(err);
      } else {
        const csvData = data.Body;
        // Convert Uint8Array to a regular string
        const csvString = new TextDecoder().decode(csvData);

        // Parse the CSV data using Papa.parse
        const parsedData = Papa.parse(csvString, {
          header: true,
        });

        // Now 'parsedData' will be an object containing the CSV data in JSON format

        if (key) {
          const questionsByCategory = parsedData.data.filter((question) =>
            question.hasOwnProperty("workflow.name")
          );

          resolve({
            [parsedData.data[0]["workflow.name"]]: questionsByCategory,
          });
        } else {
          resolve(parsedData);
        }
      }
    });
  });
};
