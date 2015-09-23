var Dropdown = React.createClass({displayName: "Dropdown",
    propTypes:  {
        list: React.PropTypes.array.isRequired
    },
    render: function () {
        return (React.createElement("select", {className: "form-control"}, this.renderListItems()));
    },
    renderListItems: function () {
        var items = [];
        this.props.list.map(function (item) {
            items.push(React.createElement("option", null, item));
        });
        return items;
    }
});


var Item = React.createClass({displayName: "Item",
    propTypes: {
        ItemText: React.PropTypes.string.isRequired,
        Done: React.PropTypes.bool.isRequired
    },
    getInitialState: function () {
        return { isDone: this.props.Done };
    },
    handleChange: function (e) {
        var done = !this.state.isDone;
        this.setState({ isDone: done });
    },
    render: function () {
        var isDone = this.state.isDone;
        return (
        React.createElement("tr", null, 
            React.createElement("td", {className: "cbTD"}, React.createElement("input", {type: "checkbox", checked: isDone, onChange: this.handleChange})), 
            React.createElement("td", null, this.props.ItemText)
        )
    );
    }
});


var MainPane = React.createClass({displayName: "MainPane",
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getUserAndList: function () {
        var selUser = "";
        var selList = "";
        if (this.props.data && this.props.data.length > 0) {
            var users = this.extractUsers();
            if (users.length > 0) {
                selUser = users[0];
                var lists = this.extractLists(users[0]);
                if (lists.length > 0) {
                    selList = lists[0];
                }
            }
        }
        return { user: selUser, list: selList };
    },
    extractUsersAndLists: function () {
        var uAndL = {};
        this.props.data.map(function (item) {
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
    extractUsers: function () {
        var users = [];
        var uAndL = this.extractUsersAndLists();
        for (user in uAndL) {
            users.push(user);
        }
        return users;
    },
    extractLists: function (user) {
        var lists = [];
        if (user) {
            var userLists = this.extractUsersAndLists()[user];
            if (userLists) {
                userLists.map(function (list) {
                    lists.push(list);
                });
            }
        }
        return lists;
    },
    render: function () {
        var userAndList = this.getUserAndList();
        var todoList = this.props.data.map(function (item) {
            if (item.UserName == userAndList.user && item.ListName == userAndList.list) {
                return React.createElement(Item, { ItemText: item.ItemText, Done: item.Done })
            }
        });
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("h1", null, "Todo List")
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("form", {className: "form-inline selectLine", role: "form"}, 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement(Dropdown, {list: this.extractUsers()}), 
                            React.createElement("button", {className: "btn btn-default"}, "New User")
                        ), 
                        React.createElement("div", {className: "form-group"}, 
                            React.createElement(Dropdown, {list: this.extractLists(userAndList.user)}), 
                            React.createElement("button", {className: "btn btn-default"}, "New List")
                        )
                    )
                ), 
                React.createElement("div", {className: "row"}, 
                    React.createElement("table", {className: "todoTable"}, todoList
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
           React.createElement(MainPane, {data: this.state.data})
        );
}
});


React.render(React.createElement(App, {url: "/api/items/"}), document.getElementById('content'));
