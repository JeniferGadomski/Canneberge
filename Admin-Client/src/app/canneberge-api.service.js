"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
require('rxjs/add/operator/map');
var UsersService = (function () {
    function UsersService(_http) {
        this._http = _http;
        this.serverUrl = "http://localhost:8080/api";
    }
    UsersService.prototype.getUsers = function () {
        return this._http.get(this.serverUrl + '/users')
            .map(function (res) { return res.json(); });
    };
    UsersService.prototype.getUser = function (id) {
        return this._http.get(this.serverUrl + '/users/' + id)
            .map(function (res) {
            return res.json().user;
        });
    };
    UsersService.prototype.save = function (id, userValue) {
        return this._http.put(this.serverUrl + '/users/' + id, userValue);
    };
    UsersService.prototype.saveNewUser = function (userValue) {
        console.log(userValue);
        return this._http.post(this.serverUrl + '/users', userValue)
            .map(function (res) { return res.json(); });
    };
    UsersService = __decorate([
        core_1.Injectable()
    ], UsersService);
    return UsersService;
}());
exports.UsersService = UsersService;
