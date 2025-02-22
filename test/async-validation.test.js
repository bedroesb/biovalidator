const fs = require("fs");
const runValidation = require("../src/validator");

test(" -> isChildTermOf Schema", () => {
  let inputSchema = fs.readFileSync("examples/schemas/isChildTerm-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/isChildTerm.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data[0]).toBeDefined();
    expect(data[0].dataPath).toBe("/attributes/age/0/terms/0/url");
  });
});

test("FAANG Schema - FAANG \'organism\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-organism-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("FAANG Schema - \'specimen\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-specimen-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("FAANG Schema - \'pool of specimens\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-poolOfSpecimens-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("FAANG Schema - \'cell specimen\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellSpecimen-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("FAANG Schema - \'cell culture\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellCulture-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});

test("FAANG Schema - \'cell line\' sample", () => {
  let inputSchema = fs.readFileSync("examples/schemas/faang-schema.json", "utf-8");
  let jsonSchema = JSON.parse(inputSchema);

  let inputObj = fs.readFileSync("examples/objects/faang-cellLine-sample.json", "utf-8");
  let jsonObj = JSON.parse(inputObj);

  return runValidation(jsonSchema, jsonObj).then( (data) => {
    expect(data).toBeDefined();
    expect(data.length).toBe(0);
  });
});
