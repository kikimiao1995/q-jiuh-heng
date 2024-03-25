const fs = require("fs");
const data = require("./generate.js");

const jsonData = JSON.stringify(data);

// Output the JSON to a file
fs.writeFileSync("db.json", jsonData, "utf8", (err) => {
  if (err) {
    console.error("Error writing JSON file:", err);
    return;
  }
  console.log("JSON file saved successfully.");
});
