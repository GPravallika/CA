/*
 * Version		: 0.0.1
 * Description	: Utility to generate export json
 *
 */

var _ = require("lodash");
var exportJson =  function exportJson() {}
// Create swagger file
exportJson.prototype.createSwagger = function(obj, reqProtocol, reqHost) {
    var swaggerDefinition = {
        info : {
            title : 'Rapido API',
            version : '1.0.0',
            description: 'Develop new apis',
        },
        schemes : [reqProtocol],
        host : reqHost,
        basePath : '/',
        swagger : '2.0'
    };
    var swaggerSpec = swaggerDefinition;
    var paths= {};
    var outerDefinitions = {};
    _.each(obj, function(data, fullPath) {
        var methods = {};
        var definitions = {};
        var properties = {};
        var parameters = {};
        var responses = {};

        var lastParm = fullPath.substr(fullPath.lastIndexOf('/') + 1);
        _.each (obj[fullPath], function (innerData, method) {
            _.each (innerData.request, function (value, index) {
                properties[index] = {"type": typeof value};
            });
            parameters['name'] = lastParm;
            parameters['in'] = "body";
            parameters['description'] = "";
            parameters['required'] = true;
            parameters["schema"] = { "type": "array","items": {"$ref": "#/definitions/" + lastParm}};
            responses=innerData.responses;
            methods[method.toLowerCase()] = {
                "tags" : ["api"],
                "summary" : innerData.summary,
                "description" :"",
                "consumes": [
                    "application/json",
                    "application/xml"
                ],
                "parameters" : [ parameters ],
                responses
            }
            definitions["type"] = "object";
            definitions["properties"] = properties;
            outerDefinitions[lastParm] = definitions;
        });
        paths[fullPath.toLowerCase()]  = methods;
        swaggerSpec["paths"] = paths;
        swaggerSpec["definitions"] = outerDefinitions;

    });
    return swaggerSpec;
}

// Create postmancollection file
exportJson.prototype.createPostmanCollection = function(obj, baseUrl) {
    var date = new Date();
    var timeStamp = date.getTime();
    var baseId = Math.random().toString(36).slice(2);
    var postmanSpec = {
        "id": baseId,
        "name": "RapidoApi",
        "description": "",
        "orders":[],
        "folders": [],
        "timestamp": timeStamp,
        "owner": "RapidoApi",
        "public": false,
        "requests":[]
    };
    _.each(obj, function(pathData, fullPath) {
        _.each(pathData, function(data, method) {
            var incVal = Math.random().toString(36).slice(2);
            postmanSpec.orders.push(incVal);
            var url="";
            var queryString="";
            if(method.toLowerCase() == "get" || method.toLowerCase() == "delete") {
                _.each (data.request, function (value, index) {
                    queryString += index+"="+value+"&"
                });
                var lastIndex = queryString.lastIndexOf("&");
                queryString = queryString.substring(0, lastIndex);
                url= baseUrl+fullPath+"?"+queryString;
            } else {
                url= baseUrl+fullPath;
            }
            postmanSpec.requests.push({
                "id" : incVal,
                "headers": "Content-Type: application/json",
                "url" : url,
                "pathVariables" : {},
                "preRequestScript" : null,
                "method" : method,
                "collectionId" : baseId,
                "data" : [],
                "dataMode" : "raw",
                "name" : url,
                "description" : data.description ? data.description  :  "",
                "descriptionFormat": "html",
                "time" : timeStamp,
                "version" : 2,
                "responses" : [data.responses],
                "tests" : null,
                "currentHelper": "normal",
                "helperAttributes": {},
                "rawModeData": JSON.stringify(data.request)
            });
        });
    });
    return  postmanSpec;
}

module.exports = exportJson;
