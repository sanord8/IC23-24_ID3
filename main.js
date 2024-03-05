const demoData = [
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
];

function paintDecisionTree(decisionTree) {
    document.getElementById('displayTree').innerHTML = treeToHtml(decisionTree.root);
}

// Recursive (DFS) function for displaying inner structure of decision tree
function treeToHtml(tree) {
    // only leafs containing category
    if (tree.category) {
        return `<ul>
                    <li>
                        <a href="#">
                            <b>${tree.category}</b>
                        </a>
                    </li>
                </ul>`;
    }

    let x = `<ul>
                <li>`
    return ['<ul>',
        '<li>',
        '<a href="#">',
        '<b>', tree.attribute, ' ', tree.predicateName, ' ', tree.pivot, ' ?</b>',
        '</a>',
        '<ul>',
        '<li>',
        '<a href="#">yes</a>',
        treeToHtml(tree.match),
        '</li>',
        '<li>',
        '<a href="#">no</a>',
        treeToHtml(tree.notMatch),
        '</li>',
        '</ul>',
        '</li>',
        '</ul>'].join('');
}

(function init() {
    // Load demo data tree
    const config = {
        trainingSet: demoData,
        categoryAttr: 'Jugar',
        ignoredAttributes: []
    };
    const decisionTree = new dt.DecisionTree(config);
    paintDecisionTree(decisionTree);

    document.getElementById("defaultSimulationForm").addEventListener("submit", (e) => {
        e.preventDefault();

        const attributeFile = document.getElementById("attributeFile").files[0];
        const valuesFile = document.getElementById("valuesFile").files[0];

        console.log(attributeFile);
        console.log(valuesFile);
    });
})();