﻿define(function () {
    return {
        requestData: function (url, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('get', url, true);
            xhr.onload = function () {
                var webAPIData = JSON.parse(xhr.responseText);
                callback(webAPIData);
            }.bind(this);
            xhr.send();
        },
        deleteData: function(url, id) {
            var xhr = new XMLHttpRequest();
            url += "/" + id;
            xhr.open('delete', url, true);
            xhr.send();
        },
        changeItem: function (id, doneValue, items) {
            for (var i in items) {
                if (items[i].ID === id) {
                    items[i].Done = doneValue;
                    break;
                }
            }
            return items;
        },
        deleteItem: function (id, items) {
            var i = 0, found = false;
            for (i = 0; i < items.length; i++) {
                if (items[i].ID === id) {
                    found = true;
                    break;
                }
            }
            if (found) {
                items.splice(i, 1);
            }
            return items;
        },
        extractUsersAndLists: function (data) {
            var uAndL = {};
            data.map(function (item) {
                if (undefined == uAndL[item.UserName]) {
                    uAndL[item.UserName] = [item.ListName];
                } else {
                    if ($.inArray(item.ListName, uAndL[item.UserName]) < 0) {
                        uAndL[item.UserName].push(item.ListName);
                    }
                }
            });
            return uAndL;
        },
        extractUsers: function (data) {
            var users = [];
            var uAndL = this.extractUsersAndLists(data);
            for (user in uAndL) {
                users.push(user);
            }
            return users;
        },
        extractLists: function (data, user) {
            var lists = [];
            if (user) {
                var userLists = this.extractUsersAndLists(data)[user];
                if (userLists) {
                    userLists.map(function (list) {
                        lists.push(list);
                    });
                }
            }
            return lists;
        },
        getDefaultUser: function (data) {
            var selUser = "";
            if (data && data.length > 0) {
                var users = this.extractUsers(data);
                if (users.length > 0) {
                    selUser = users[0];
                }
            }
            return selUser;
        },
        getDefaultList: function (data, user) {
            var selList = "";
            if (data && data.length > 0) {
                if (user.length > 0) {
                    var lists = this.extractLists(data, user);
                    if (lists.length > 0) {
                        selList = lists[0];
                    }
                }
            }
            return selList;
        }
    }
});
