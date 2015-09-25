var Dropdown = React.createClass({
    propTypes: {
        list: React.PropTypes.array.isRequired,
        onChange: React.PropTypes.func.isRequired
    },
    handleChange: function (evt) {
        this.props.onChange(evt);
    },
    render: function () {
        return (<select className="form-control" onChange={this.handleChange}>
            {this.renderListItems()}
        </select>);
    },
    renderListItems: function () {
        var items = [];
        this.props.list.map(function (item) {
            items.push(<option>{item}</option>);
        });
        return items;
    }
});


    var Item = React.createClass({
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
            <tr>
                <td className="cbTD"><input type="checkbox" checked={isDone} onChange={this.handleChange} /></td>
                <td>{this.props.item.ItemText}</td>
                <td><span className="glyphicon glyphicon-remove-sign"></span></td>
            </tr>
        );
        }
    });


var MainPane = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },
    getInitialState: function () {
        return { user: "", list: "" };
    },
    userChanged: function (evt) {
        this.setState({ user: evt.target.value });
        this.setState({ list: "" });    // An appropriate default will be selected automatically.
    },
    listChanged: function (evt) {
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
                return React.createElement(Item, { item: item, onChange: that.itemChanged });
            }
        });
        return (
            <div>
                <div className="row">
                    <form className="form-inline selectLine" role="form">
                        <div className="form-group">
                            <Dropdown list={extractUsers(this.props.data)} onChange={this.userChanged} />
                            <button className="btn btn-default" onClick={this.addUser}>
                                <span className="glyphicon glyphicon-plus-sign" />
                            </button>
                        </div>
                        <div className="form-group">
                            <Dropdown list={extractLists(this.props.data, user)} onChange={this.listChanged} />
                            <button className="btn btn-default" onClick={this.addList}>
                                <span className="glyphicon glyphicon-plus-sign" />
                            </button>
                        </div>
                    </form>
                </div>
                <div className="row">
                    <table className="todoTable">
                        {todoList}
                    </table>
                </div>
                <hr />
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
            </div>
        );
    }
});


var App = React.createClass({
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
            <div className="container">
                <div className="row">
                    <h1>Todo List</h1>
                </div>
                <MainPane data={this.state.data} />
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

// #endregion
