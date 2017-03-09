"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
require('rxjs/add/operator/switchMap');
var core_1 = require('@angular/core');
var UsersDetailComponent = (function () {
    function UsersDetailComponent(route, router, service) {
        this.route = route;
        this.router = router;
        this.service = service;
    }
    UsersDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.currentId = params['id'];
            // Retrieve Pet with Id route param
            _this.service.getUser(_this.currentId).subscribe(function (user) { return _this.user = user; });
            console.log(_this.user);
        });
    };
    UsersDetailComponent.prototype.returnUsersList = function () {
        this.router.navigate(['/users']);
    };
    UsersDetailComponent.prototype.saveUser = function (user) {
        this.service.save(this.currentId, user).subscribe(function (res) { console.log('success'); });
        this.returnUsersList();
    };
    UsersDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'users-detail.component.html',
            styleUrls: ['users.component.css']
        })
    ], UsersDetailComponent);
    return UsersDetailComponent;
}());
exports.UsersDetailComponent = UsersDetailComponent;
