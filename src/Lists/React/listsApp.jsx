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


////////////////////////////////////////////////////////////////////////////////
//
//  Dropdown Class
//
var Dropdown = React.createClass({
    propTypes: {
        listInfo: React.PropTypes.object.isRequired     // { list, selection, onChange }
    },
    handleChange: function (evt) {
        this.setState({ sel: evt.target.value })
        this.props.listInfo.onChange(evt);
    },
    render: function () {
        return (
            <select className="form-control" value={this.props.listInfo.selection} onChange={this.handleChange}>
                {this.renderListItems()}
            </select>
        );
    },
    renderListItems: function () {
        var items = [];
        this.props.listInfo.list.map(function (item) {
            items.push(<option key={item}>{item}</option>);
        });
        return items;
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Item Class
//
var Item = React.createClass({
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
            <tr>
                <td className="cbTD"><input type="checkbox" checked={isDone} onChange={this.handleChange} /></td>
                <td>{this.props.item.ItemText}</td>
                <td><span className="glyphicon glyphicon-remove-sign" onClick={this.handleDelete}></span></td>
            </tr>
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Selectors Class
//
var Selectors = React.createClass({
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
            <div className="row">
                <form className="form-inline selectLine" role="form">
                    <div className="form-group">
                        <Dropdown listInfo={userInfo} />
                        <button className="btn btn-default" onClick={this.addUser}>
                            <span className="glyphicon glyphicon-plus-sign" />
                        </button>
                    </div>
                    <div className="form-group">
                        <Dropdown listInfo={listInfo} />
                        <button className="btn btn-default" onClick={this.addList}>
                            <span className="glyphicon glyphicon-plus-sign" />
                        </button>
                    </div>
                </form>
            </div>
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  ItemList Class
//
var ItemList = React.createClass({
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
                return <Item item={item} key={item.id} onChange={that.itemChanged} onDelete={that.onDelete } />;
            }
        });
        return (
            <div className="row">
                <table className="todoTable">
                    {todoList}
                </table>
            </div>
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  Operators Class
//
var Operators = React.createClass({
    render: function () {
        return (
            <div className="row">
                <button className="btn btn-default button-spacing">
                    <span className="glyphicon glyphicon-plus-sign" />
                </button>
                <button className="btn btn-default button-spacing">
                    <span className="glyphicon glyphicon-remove-sign" /> Checked
                </button>
                <button className="btn btn-default">
                    Hide <span className="glyphicon glyphicon-ok-sign" />
                </button>
            </div>
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  MainPane Class
//
var MainPane = React.createClass({
    propTypes: {
        data:     React.PropTypes.array.isRequired,     // List items for this user/list selection
        userInfo: React.PropTypes.object.isRequired,    // { list, selection, onChange }
        listInfo: React.PropTypes.object.isRequired     // { list, selection, onChange }
    },
    addUser: function () {
        alert("TBD: Add User");
    },
    addList: function () {
        var user = this.getUser();
        alert("TBD: Add list for user " + user);    // TODO
    },
    itemChanged: function (item, state) {
        console.log(item.ListName + "/" + item.ItemText + "->" + state);    // TODO
    },
    itemDeleted: function (item) {
        console.log(item.ListName + "/" + item.ItemText + " Deleted");  //TODO
    },
    userChanged: function (user) { this.props.userInfo.onChange(user); },
    listChanged: function (list) { this.props.listInfo.onChange(list); },
    render: function () {
        return (
            <div>
                <Selectors userInfo = {this.props.userInfo}
                           listInfo = {this.props.listInfo}
                />
                <ItemList  data     = {this.props.data}
                           onChange = {this.itemChanged}
                           onDelete = {this.itemDeleted}
                />
                <hr />
                <Operators />
            </div>
        );
    }
});


////////////////////////////////////////////////////////////////////////////////
//
//  App Class
//
var App = React.createClass({
    getInitialState: function () {
        return {
            data: [],
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
            var user = this.getUser();
            this.setState({ user: user, list: this.getList(user) });
        }.bind(this);
        xhr.send();
    },
    getUser: function () {
        var selUser = this.state.user || getDefaultUser(this.state.data);
        return selUser;
    },
    getList: function (user) {
        var selList = this.state.list || getDefaultList(this.state.data, user);
        return selList;
    },
    userChanged: function (user) {
        list = getDefaultList(this.state.data, user);
        setCookie("defaultUser", user, 30);
        setCookie("defaultList", list, 0);
        this.setState({ user: user, list: list });
    },
    listChanged: function (list) {
        this.setState({ list: list });
        setCookie("defaultList", list, 30);
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
            list      : extractUsers(this.state.data),
            selection : this.state.user,
            onChange  : this.userChanged
        }
        var listInfo = {
            list      : extractLists(this.state.data, this.state.user),
            selection : this.state.list,
            onChange : this.listChanged
        };
        return (
            <div className="container">
                <div className="row">
                    <h1>Todo List</h1>
                </div>
                <MainPane data     = {todoList}
                          listInfo = {listInfo}
                          userInfo = {userInfo}
                />
            </div>
        );
    }
});


React.render(<App url="/api/items/" />, document.getElementById('content'));


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
