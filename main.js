const demoData = _([
    { TiempoExterior: "soleado", Temperatura: "caluroso", Humedad: "alta", Viento: "falso", Jugar: "no" },
    { TiempoExterior: "soleado", Temperatura: "caluroso", Humedad: "alta", Viento: "verdad", Jugar: "no" },
    { TiempoExterior: "nublado", Temperatura: "caluroso", Humedad: "alta", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "lluvioso", Temperatura: "templado", Humedad: "alta", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "lluvioso", Temperatura: "frio", Humedad: "normal", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "lluvioso", Temperatura: "frio", Humedad: "normal", Viento: "verdad", Jugar: "no" },
    { TiempoExterior: "nublado", Temperatura: "frio", Humedad: "normal", Viento: "verdad", Jugar: "si" },
    { TiempoExterior: "soleado", Temperatura: "templado", Humedad: "alta", Viento: "falso", Jugar: "no" },
    { TiempoExterior: "soleado", Temperatura: "frio", Humedad: "normal", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "lluvioso", Temperatura: "templado", Humedad: "normal", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "soleado", Temperatura: "templado", Humedad: "normal", Viento: "verdad", Jugar: "si" },
    { TiempoExterior: "nublado", Temperatura: "templado", Humedad: "alta", Viento: "verdad", Jugar: "si" },
    { TiempoExterior: "nublado", Temperatura: "caluroso", Humedad: "normal", Viento: "falso", Jugar: "si" },
    { TiempoExterior: "lluvioso", Temperatura: "templado", Humedad: "alta", Viento: "verdad", Jugar: "no" }
]);

const demoAttributes = ['TiempoExterior', 'Temperatura', 'caluroso', 'Humedad', 'Viento'];
let currentModel;
let currentTarget;
let currentAttributes;

function csvToArray(str, delimiter = ",") {
    // slice from start of text to the first \n index
    // use split to create an array from string by delimiter
    const headers = str.slice(0, str.indexOf("\n")).replace(/\r/g, "").split(delimiter);

    // slice from \n index + 1 to the end of the text
    // use split to create an array of each csv value row
    const rows = str.slice(str.indexOf("\n") + 1).replace(/\r/g, "").split("\n");

    // Map the rows
    // split values from each row into an array
    // use headers.reduce to create an object
    // object properties derived from headers:values
    // the object passed as an element of the array
    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (object, header, index) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return the array
    return arr;
}

function createSelectorValues(data) {
    let values = '';
    for(let val of data) {
        values += `<option value="${val}">${val}</opt1ion>`
    }
    return values;
}

function createSelectors(data) {
    let selectors = '';
    for (let key in data) {
        if(key !== currentTarget) {
            selectors += `<div class="row mt-3">
                            <div class="col">${key}:</div>
                            <div class="col">
                                <select class="form-select" attribute="${key}">
                                    ${createSelectorValues(data[key])}
                                </select>
                            </div>
                        </div>`
        }
    }
    return selectors + `<!-- Start prediction -->
                        <button type="submit" class="btn btn-primary w-100 mt-3">Predict</button>`;
}

async function loadFiles(e) {
    e.preventDefault();

    $("#samples").html("");
    $("#predictionForm").html("");

    const attributeFile = document.getElementById("attributeFile").files[0];
    const valuesFile = document.getElementById("valuesFile").files[0];

    let attributes = await attributeFile.text();
    let values = await valuesFile.text();

    attributes = attributes.replace("\r\n", "").split(",");
    values = csvToArray(values);

    currentTarget = attributes[attributes.length - 1];
    currentAttributes = attributes.slice(0, attributes.length - 1);

    currentModel = id3(_(values), currentTarget, currentAttributes);

    drawGraph(currentModel, 'canvas');

    // Prediction
    const uniqueValues = {};
    values.forEach(obj => {
        // Iterate through each key in the object
        Object.keys(obj).forEach(key => {
            // Initialize an array for the key if it doesn't exist
            if (!uniqueValues[key]) {
                uniqueValues[key] = [];
            }
            // Add the value to the array if it's not already present
            if (!uniqueValues[key].includes(obj[key])) {
                uniqueValues[key].push(obj[key]);
            }
        });
    });

    $("#predictionForm").html(createSelectors(uniqueValues));
}

async function predictData(e) {
    e.preventDefault();
    let predictionData = document.getElementsByClassName('form-select');

    let sample = {};
    for (let selector of predictionData) {
        const attribute = selector.getAttribute("attribute");
        const value = selector.value;
        sample[attribute] = value;
    }

    //PREDICTION BASED ON SAMPLE
    try{
        $("#samples").html(predict(currentModel, sample));
    }
    catch(e) {
        $("#samples").html("Insufficient data");
    }
   
};

function init() {
    // Load demo data tree
    currentTarget = 'Jugar'
    currentAttributes = demoAttributes;

    currentModel = id3(demoData, currentTarget, currentAttributes);
    drawGraph(currentModel, 'canvas');

    document.getElementById("startSimulationForm").addEventListener("submit", loadFiles);
    document.getElementById("predictionForm").addEventListener('submit', predictData);
}

window.addEventListener("load", init);