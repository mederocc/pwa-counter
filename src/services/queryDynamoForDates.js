import AWS from "aws-sdk";

export const queryDynamoForDates = async (production, lot_name) => {
  try {
    // Create an instance of the Lambda service
    const lambda = new AWS.Lambda();

    // Define the parameters for invoking the Lambda function
    const params = {
      FunctionName: "queryProdTypeHandler",
      Payload: JSON.stringify({
        production: production,
        lot_name: lot_name || "",
      }),
    };

    // Wrap the Lambda invocation in a Promise
    return new Promise((resolve, reject) => {
      // Invoke the Lambda function
      lambda.invoke(params, (err, data) => {
        if (err) {
          console.error("Error calling Lambda function:", err);
          reject(err); // Reject the promise with the error
        } else {
          const response = JSON.parse(data.Payload);

          resolve(response.body); // Resolve the promise with the response data
        }
      });
    });
  } catch (error) {
    console.error("Error in queryDynamoForDates function:", error);
  }
};
