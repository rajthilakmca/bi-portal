/*
 ** Copyright [2013] [Megam Systems]
 **
 ** Licensed under the Apache License, Version 2.0 (the "License");
 ** you may not use this file except in compliance with the License.
 ** You may obtain a copy of the License at
 **
 ** http://www.apache.org/licenses/LICENSE-2.0
 **
 ** Unless required by applicable law or agreed to in writing, software
 ** distributed under the License is distributed on an "AS IS" BASIS,
 ** WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ** See the License for the specific language governing permissions and
 ** limitations under the License.
 */

var express = require('express');
var util = require('util');
var crypto = require('crypto');
var fs = require("fs");
var app = express();
var events = require("./events");
var connectors = require("./connectors/connector")
var path = require("path");
var icon_paths = [path.resolve(__dirname + '/../public/icons')];

events.on("node-icon-dir", function(dir) {
	icon_paths.push(path.resolve(dir));
});

// TODO: nothing here uses settings... so does this need to be a function?
function setupUI(settings) {

	// Need to ensure the url ends with a '/' so the static serving works
	// with relative paths
	app.get("/", function(req, res) {
		req.next();
	});

	app.get("/mconnect", function(req, res) {
		res.sendFile(path.resolve(__dirname + '/../public/mconnect.html'));
	});

	app.get("/connectors", function(req, res) {
		connectors.init(req.query);
		connectors.getConnection(req.query);
		connectors.getData().then(function() {
			var result = connectors.getResult();
			res.send(result);
		}).otherwise(function(err) {
			console.log("error");
		});
		//connectors.getData();
		//console.log(connectors.getResult());
		//console.log(req.query);
		
	});

	var iconCache = {};
	//TODO: create a default icon
	var defaultIcon = path.resolve(__dirname + '/../public/icons/arrow-in.png');

	app.use("/", express.static(__dirname + '/../public'));

	return app;
}

module.exports = setupUI;

