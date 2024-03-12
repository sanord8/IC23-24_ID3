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

async function loadFiles(e) {
    e.preventDefault();

    const attributeFile = document.getElementById("attributeFile").files[0];
    const valuesFile = document.getElementById("valuesFile").files[0];

    let attributes = await attributeFile.text();
    let values = await valuesFile.text();

    attributes = attributes.replace("\r\n", "").split(",");
    values = csvToArray(values);

    let model = id3(_(values), attributes[attributes.length - 1], attributes.slice(0, attributes.length - 1));
    drawGraph(model, 'canvas');
}

function init() {
    // Load demo data tree
    const demoModel = id3(demoData, 'Jugar', demoAttributes);
    drawGraph(demoModel, 'canvas');

    document.getElementById("startSimulationForm").addEventListener("submit", loadFiles);
}

window.addEventListener("load", init);