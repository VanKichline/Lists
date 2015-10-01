////////////////////////////////////////////////////////////////////////////////
//
// Lists, a JSX/WebAPI example by Van Kichline: Sep - Oct 2015
// Design:
//  App gets data from WebAPI.  Data is an array of Items.
//      Also gets user and list from cookies.
//  App creates a MainFrame and passes it only the data for the selected user and list.
//  MainFrame creates Selectors, ItemList and Operators
//  Selectors selects a list or adds a new one
//  ItemList displays items for current user and list.  It also deletes items.
//  Operators adds an item, hides all checked items, or deletes all checked items.
//  Item renders a single item a a tr
//  DropDown renders a select element with contents and selection.
//
////////////////////////////////////////////////////////////////////////////////

var DataLib, CookieLib;
require(["DataLib", "CookieLib"], function (dataLib, cookieLib) {
    DataLib   = dataLib;
    CookieLib = cookieLib;
    React.render(React.createElement(App, {url: "/api/items/"}), document.getElementById('content'));
});

////////////////////////////////////////////////////////////////////////////////
//
//  Dropdown Class
//
var Dropdown = React.createClass({displayName: "Dropdown",
    propTypes: {
        listInfo: React.PropTypes.object.isRequired     // { list, selection, onChange }
    },
    handleChange: function (evt) {
        this.setState({ sel: evt.target.value })
        this.props.listInfo.onChange(evt);
    },
    render: function () {
        return (
            React.createElement("select", {className: "form-control", value: this.props.listInfo.selection, onChange: this.handleChange}, 
                this.renderListItems()
            )
        );
    },
    renderListItems: function () {
        var items = [];
        this.props.listInfo.list.map(function (item) {
            items.push(React.createElement("option", {key: item}, item));
        });
        return items;
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Item Class
//
var Item = React.createClass({displayName: "Item",
    propTypes: {
        item:     React.PropTypes.object.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    getInitialState: function () {
        return { isDone: this.props.item.Done };
    },
    handleChange: function (evt) {
        var done = !this.state.isDone;
        this.setState({ isDone: done });
        this.props.onChange(this.props.item, done);
    },
    handleDelete: function () {
        this.props.onDelete(this.props.item);
    },
    render: function () {
        var isDone = this.state.isDone;
        return (
            React.createElement("tr", null, 
                React.createElement("td", {className: "cbTD"}, React.createElement("input", {type: "checkbox", checked: isDone, onChange: this.handleChange})), 
                React.createElement("td", null, this.props.item.ItemText), 
                React.createElement("td", null, React.createElement("span", {className: "glyphicon glyphicon-remove-sign", onClick: this.handleDelete}))
            )
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Selectors Class
//
var Selectors = React.createClass({displayName: "Selectors",
    propTypes: {
        userInfo: React.PropTypes.object.isRequired,    // { list, selection, onChange }
        listInfo: React.PropTypes.object.isRequired     // { list, selection, onChange }
    },
    userChanged: function (evt) {
        this.props.userInfo.onChange(evt.target.value);
    },
    listChanged: function (evt) {
        this.props.listInfo.onChange(evt.target.value);
    },
    render: function () {
        var userInfo = { list: this.props.userInfo.list, selection: this.props.userInfo.selection, onChange: this.userChanged };
        var listInfo = { list: this.props.listInfo.list, selection: this.props.listInfo.selection, onChange: this.listChanged };
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("form", {className: "form-inline selectLine", role: "form"}, 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement(Dropdown, {listInfo: userInfo}), 
                        React.createElement("button", {className: "btn btn-default", onClick: this.addUser}, 
                            React.createElement("span", {className: "glyphicon glyphicon-plus-sign"})
                        )
                    ), 
                    React.createElement("div", {className: "form-group"}, 
                        React.createElement(Dropdown, {listInfo: listInfo}), 
                        React.createElement("button", {className: "btn btn-default", onClick: this.addList}, 
                            React.createElement("span", {className: "glyphicon glyphicon-plus-sign"})
                        )
                    )
                )
            )
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  ItemList Class
//
var ItemList = React.createClass({displayName: "ItemList",
    propTypes: {
        data: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    itemChanged: function () {
        this.props.onChange(item);
    },
    onDelete: function () {
        this.props.onDelete(item);
    },
    render: function () {
        var that = this;
        var todoList = this.props.data.map(function (item) {
            if (item) {
                return React.createElement(Item, {item: item, key: item.id, onChange: that.itemChanged, onDelete: that.onDelete});
            }
        });
        return (
            React.createElement("div", {className: "row"}, 
                React.createElement("table", {className: "todoTable"}, 
                    todoList
                )
            )
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Operators Class
//
var Operators = React.createClass({displayName: "Operators",
    render: function () {
        return (
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
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  MainPane Class
//
var MainPane = React.createClass({displayName: "MainPane",
    propTypes: {
        data:     React.PropTypes.array.isRequired,     // List items for this user/list selection
        userInfo: React.PropTypes.object.isRequired,    // { list, selection, onChange }
        listInfo: React.PropTypes.object.isRequired     // { list, selection, onChange }
    },
    addUser: function () { alert("TBD: Add User"); },
    addList: function () { console.log("TBD: Add list for user " + this.getUser()); },
    itemChanged: function (item, state) { console.log("TBD: " + item.ListName + "/" + item.ItemText + "->" + state); },
    itemDeleted: function (item) { console.log("TBD: " + item.ListName + "/" + item.ItemText + " Deleted"); },
    userChanged: function (user) { this.props.userInfo.onChange(user); },
    listChanged: function (list) { this.props.listInfo.onChange(list); },
    render: function () {
        return (
            React.createElement("div", null, 
                React.createElement(Selectors, {userInfo: this.props.userInfo, 
                           listInfo: this.props.listInfo}
                ), 
                React.createElement(ItemList, {data: this.props.data, 
                           onChange: this.itemChanged, 
                           onDelete: this.itemDeleted}
                ), 
                React.createElement("hr", null), 
                React.createElement(Operators, null)
            )
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  App Class
//
var App = React.createClass({displayName: "App",
    getInitialState: function () {
        return {
            data: [],
            user: CookieLib.getCookie('defaultUser'),
            list: CookieLib.getCookie('defaultList')
        };
    },
    componentWillMount: function () {
        DataLib.requestData(this.props.url, this.requestDataCallback);
    },
    requestDataCallback: function (data) {
        this.setState({ data: data });
        var user = this.getUser();
        this.setState({ user: user, list: this.getList(user) });
    },
    getUser: function () {
        var selUser = this.state.user || DataLib.getDefaultUser(this.state.data);
        return selUser;
    },
    getList: function (user) {
        var selList = this.state.list || DataLib.getDefaultList(this.state.data, user);
        return selList;
    },
    userChanged: function (user) {
        var list = DataLib.getDefaultList(this.state.data, user);
        CookieLib.setCookie("defaultUser", user, 30);
        CookieLib.setCookie("defaultList", list, 0);
        this.setState({ user: user, list: list });
    },
    listChanged: function (list) {
        this.setState({ list: list });
        CookieLib.setCookie("defaultList", list, 30);
    },
    render: function () {
        var user = this.getUser();
        var list = this.getList(user);
        var that = this;
        var todoList = this.state.data.map(function (item) {
            if (item && item.UserName == that.state.user && item.ListName == that.state.list) {
                return item;
            }
        });
        var userInfo = {
            list      : DataLib.extractUsers(this.state.data),
            selection : this.state.user,
            onChange  : this.userChanged
        }
        var listInfo = {
            list      : DataLib.extractLists(this.state.data, this.state.user),
            selection : this.state.list,
            onChange  : this.listChanged
        };
        return (
            React.createElement("div", {className: "container"}, 
                React.createElement("div", {className: "row"}, 
                    React.createElement("h1", null, "Todo List")
                ), 
                React.createElement(MainPane, {data: todoList, 
                          listInfo: listInfo, 
                          userInfo: userInfo}
                )
            )
        );
    }
});
