var Dropdown = React.createClass({displayName: "Dropdown",
    propTypes: {
        list: React.PropTypes.array.isRequired,
        selection: React.PropTypes.string,
        onChange: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return { sel: this.props.selection };
    },
    handleChange: function (evt) {
        this.setState({ sel: evt.target.value })
        this.props.onChange(evt);
    },
    render: function () {
        return (React.createElement("select", {className: "form-control", value: this.state.sel, onChange: this.handleChange}, 
            this.renderListItems()
        ));
    },
    renderListItems: function () {
        var items = [];
        this.props.list.map(function (item) {
            items.push(React.createElement("option", {key: item}, item));
        });
        return items;
    }
});


    var Item = React.createClass({displayName: "Item",
        propTypes: {
            item: React.PropTypes.object.isRequired,
            onChange: React.PropTypes.func.isRequired
        },
        getInitialState: function () {
            return { isDone: this.props.item.Done };
        },
        handleChange: function (evt) {
            var done = !this.state.isDone;
            this.setState({ isDone: done });
            this.props.onChange(this.props.item, done);
        },
        render: function () {
            var isDone = this.state.isDone;
            return (
            React.createElement("tr", null, 
                React.createElement("td", {className: "cbTD"}, React.createElement("input", {type: "checkbox", checked: isDone, onChange: this.handleChange})), 
                React.createElement("td", null, this.props.item.ItemText), 
                React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-remove-sign"}))
            )
        );
        }
    });


var MainPane = React.createClass({displayName: "MainPane",
    propTypes: {
        data: React.PropTypes.array.isRequired,
        defaultUser: React.PropTypes.string,
        defaultList: React.PropTypes.string
    },
    getInitialState: function () {
        return { user: this.props.defaultUser, list: this.props.defaultList };
    },
    userChanged: function (evt) {
        this.setState({ user: evt.target.value });
        setCookie("defaultUser", evt.target.value, 30);
        this.setState({ list: "" });    // An appropriate default will be selected automatically.
        setCookie("defaultList", "", 0);
    },
    listChanged: function (evt) {
        setCookie("defaultList", evt.target.value, 30);
        this.setState({ list: evt.target.value });
    },
    addUser: function () {
        alert("TBD: Add User");
    },
    addList: function () {
        var user = this.getUser();
        alert("TBD: Add list for user " + user);
    },
    getUser: function () {
        var selUser = this.state.user || getDefaultUser(this.props.data);
        return selUser;
    },
    getList: function (user) {
        var selList = this.state.list || getDefaultList(this.props.data, user);
        return selList;
    },
    toggleHide: function () {
        this.setState({ hideCompleted: !this.state.hideCompleted });
    },
    itemChanged: function (item, state) {
        console.log(item.ListName + "/" + item.ItemText + "->" + state);
    },
    render: function () {
        var user = this.getUser();
        var list = this.getList(user);
        var that = this;
        var todoList = this.props.data.map(function (item) {
            if (item.UserName == user && item.ListName == list) {
                return React.createElement(Item, {item: item, key: item.id, onChange: that.itemChanged});
            }
        });
        return (
            React.createElement("div", null, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("form", {className: "form-inline selectLine", role: "form"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement(Dropdown, {list: extractUsers(this.props.data), selection: this.state.user, onChange: this.userChanged}), 
                            React.createElement("button", {className: "btn btn-default", onClick: this.addUser}, 
                                React.createElement("span", {className: "glyphicon glyphicon-plus-sign"})
                            )
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement(Dropdown, {list: extractLists(this.props.data, user), selection: this.state.list, onChange: this.listChanged}), 
                            React.createElement("button", {className: "btn btn-default", onClick: this.addList}, 
                                React.createElement("span", {className: "glyphicon glyphicon-plus-sign"})
                            )
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("table", {className: "todoTable"}, 
                        todoList
                    )
                ), 
                React.createElement("hr", null), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("button", {className: "btn btn-default button-spacing"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-plus-sign"})
                    ), 
                    React.createElement("button", {className: "btn btn-default button-spacing"}, 
                        React.createElement("span", {className: "glyphicon glyphicon-remove-sign"}), " Checked"
                    ), 
                    React.createElement("button", {className: "btn btn-default"}, 
                        "Hide ", React.createElement("span", {className: "glyphicon glyphicon-ok-sign"})
                    )
                )
            )
        );
    }
});


var App = React.createClass({displayName: "App",
    getInitialState: function () {
        return { data: [] };
    },
    getDefaultProps: function () {
        return {
            user: getCookie('defaultUser'),
            list: getCookie('defaultList')
        };
    },
    componentWillMount: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var webAPIData = JSON.parse(xhr.responseText);
            this.setState({ data: webAPIData });
        }.bind(this);
        xhr.send();
    },
    render: function () {
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("h1", null, "Todo List")
                ), 
                React.createElement(MainPane, {data: this.state.data, defaultUser: this.props.user, defaultList: this.props.list})
            )
        );
    }
});


React.render(React.createElement(App, {url: "/api/items/"}), document.getElementById('content'));


// #region Utility Functions

function extractUsersAndLists(data) {
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
}

function extractUsers(data) {
    var users = [];
    var uAndL = extractUsersAndLists(data);
    for (user in uAndL) {
        users.push(user);
    }
    return users;
}

function extractLists(data, user) {
    var lists = [];
    if (user) {
        var userLists = extractUsersAndLists(data)[user];
        if (userLists) {
            userLists.map(function (list) {
                lists.push(list);
            });
        }
    }
    return lists;
}

function getDefaultUser(data) {
    var selUser = "";
    if (data && data.length > 0) {
        var users = extractUsers(data);
        if (users.length > 0) {
            selUser = users[0];
        }
    }
    return selUser;
}

function getDefaultList(data, user) {
    var selList = "";
    if (data && data.length > 0) {
        if (user.length > 0) {
            var lists = extractLists(data, user);
            if (lists.length > 0) {
                selList = lists[0];
            }
        }
    }
    return selList;
}

// Cookie functions: http://www.w3schools.com/js/js_cookies.asp
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ')
            c = c.substring(1);
        if (c.indexOf(name) == 0)
            return c.substring(name.length, c.length);
    }
    return "";
}

// #endregion
