
//

metric.export

let metric = {}


/* MAPE
It is a dimensionless factor with a very simple interpretation.
It can be measured in fractions or percentages.If you get, for example,
that MAPE = 11.4 % MAPE= 11.4 %, then this indicates that the error was 11.4 % of the actual values.
*/
metric.mape = function (fact, predict) {
        
        var valueArray = fact.map(
                function (v, index) {
                        return Math.abs(v - predict[index]) / v;
                })
        return ErrorArray.reduce((acc, value) => (acc + value)) / valueArray.length
}

// RMSE
metric.rmse = function (fact, predict) {
        var valueArray = fact.map(
                function (v, i) {
                        return Math.pow((v - predict[i]), 2);
                })
        return Math.sqrt(valueArray.reduce((a, x) => (a + x), 0)) / valueArray.length;
};

// stdDev
metric.std = function (arr) {

        var valueMean = arr.reduce((acc, b) => acc + b, 0) / arr.length;
        return Math.sqrt(arr.reduce((acc, x) => (acc + Math.pow(x - valueMean, 2))) / arr.length);

};
        
let minMaxValue = function (arr) {
        return Math.min.apply(null, arr);
};

let maxValue = function (arr) {
        return Math.max.apply(null, arr), Math.min.apply(null, arr);
};


