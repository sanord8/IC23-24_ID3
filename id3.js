//ID3 Decision Tree Algorithm


//main algorithm and prediction functions
/**
 * Generates a decision tree using the ID3 algorithm.
 * @param {Array<Object>} data - The dataset.
 * @param {string} target - The target variable to predict.
 * @param {Array<string>} features - The list of feature variables.
 * @returns {Object} - The decision tree node.
 */
let id3 = function (data, target, features) {
    let targets = _.unique(data.pluck(target));
    if (targets.length == 1) {
        return { type: "result", val: targets[0], name: targets[0], alias: targets[0] + randomTag() };
    }
    if (features.length == 0) {
        let topTarget = mostCommon(data.pluck(target));
        return { type: "result", val: topTarget, name: topTarget, alias: topTarget + randomTag() };
    }
    let bestFeature = maxGain(data, target, features);
    let remainingFeatures = _.without(features, bestFeature);
    let possibleValues = _.unique(data.pluck(bestFeature));
    let node = { name: bestFeature, alias: bestFeature + randomTag() };
    node.type = "feature";
    node.vals = _.map(possibleValues, function (v) {
        let _newS = _(data.filter(function (x) { return x[bestFeature] == v }));
        let child_node = { name: v, alias: v + randomTag(), type: "feature_value" };
        child_node.child = id3(_newS, target, remainingFeatures);
        return child_node;

    });
    return node;
}

let predict = function (id3Model, sample) {
    let root = id3Model;
    while (root.type != "result") {
        let attr = root.name;
        let sampleVal = sample[attr];
        let childNode = _.detect(root.vals, function (x) { return x.name == sampleVal });
        root = childNode.child;
    }
    return root.val;
}



//necessary math functions

let entropy = function (vals) {
    let uniqueVals = _.unique(vals);
    let probs = uniqueVals.map(function (x) { return prob(x, vals) });
    let logVals = probs.map(function (p) { return -p * log2(p) });
    return logVals.reduce(function (a, b) { return a + b }, 0);
}

let gain = function (data, target, feature) {
    let attrVals = _.unique(data.pluck(feature));
    let setEntropy = entropy(data.pluck(target));
    let setSize = data.size();
    let entropies = attrVals.map(function (n) {
        let subset = data.filter(function (x) { return x[feature] === n });
        return (subset.length / setSize) * entropy(_.pluck(subset, target));
    });
    let sumOfEntropies = entropies.reduce(function (a, b) { return a + b }, 0);
    return setEntropy - sumOfEntropies;
}

let maxGain = function (data, target, features) {
    return _.max(features, function (e) { return gain(data, target, e) });
}

let prob = function (val, vals) {
    let instances = _.filter(vals, function (x) { return x === val }).length;
    let total = vals.length;
    return instances / total;
}

let log2 = function (n) {
    return Math.log(n) / Math.log(2);
}


let mostCommon = function (l) {
    return _.sortBy(l, function (a) {
        return count(a, l);
    }).reverse()[0];
}

let count = function (a, l) {
    return _.filter(l, function (b) { return b === a }).length
}

let randomTag = function () {
    return "_r" + Math.round(Math.random() * 1000000).toString();
}

//Display logic
let drawGraph = function (id3Model, divId) {
    let g = new Array();
    g = addEdges(id3Model, g).reverse();
    window.g = g;
    let data = google.visualization.arrayToDataTable(g.concat(g));
    let chart = new google.visualization.OrgChart(document.getElementById(divId));
    google.visualization.events.addListener(chart, 'ready', function () {
        _.each($('.google-visualization-orgchart-node'), function (x) {
            let oldVal = $(x).html();
            if (oldVal) {
                let cleanVal = oldVal.replace(/_r[0-9]+/, '');
                $(x).html(cleanVal);
            }
        });
    });
    chart.draw(data, { allowHtml: true });

}

let addEdges = function (node, g) {
    if (node.type == 'feature') {
        _.each(node.vals, function (m) {
            g.push([m.alias, node.alias, '']);
            g = addEdges(m, g);
        });
        return g;
    }
    if (node.type == 'feature_value') {

        g.push([node.child.alias, node.alias, '']);
        if (node.child.type != 'result') {
            g = addEdges(node.child, g);
        }
        return g;
    }
    return g;
}

let renderTrainingData = function (_training, $el, target, features) {
    _training.each(function (s) {
        $el.append("<tr><td>" + _.map(features, function (x) { return s[x] }).join('</td><td>') + "</td><td>" + s[target] + "</td></tr>");
    })
}