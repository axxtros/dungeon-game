"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webLabelDAO = require("../modules/webPageLabelsDAO");
var express = require("express");
var router = express.session();
var app = require('../app');
var async = require('async');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
exports.map = function (req, res, next) {
    res.render('map.ejs', {
        program_name: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_NAME,
        program_version: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_VERSION,
        program_developer: webLabelDAO.WebpageLabelsNameSpace.WebPageLabels.PROGRAM_DEVELOPER
    });
};
//# sourceMappingURL=map.js.map