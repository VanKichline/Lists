var Dropdown = React.createClass({
    render: function () {
        return (<select className="form-control">{this.renderListItems()}</select>);
    },
    renderListItems: function () {
        var items = [];
        this.props.list.map(function (item) {
            items.push(<option>{item}</option>);
        });
        return items;
    }
});

// Props: ItemText, Done
var Item = React.createClass({
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
            <tr>
                <td className="cbTD"><input type="checkbox" checked={isDone} onChange={this.handleChange} /></td>
                <td>{this.props.ItemText}</td>
            </tr>
        );
    }
});

// Props: dat, usersAndLists
var MainPane = React.createClass({
    getInitialState: function () {
        return { usersAndLists: {}, dataAvailable: false, users: [], lists: [], user: "", list: "" };
    },
    componentDidUpdate: function () {
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
        var users = this.extractUsers();
        var lists = this.extractLists(users[0])
        this.setState({ usersAndLists: uAndL });
        this.setState({ dataAvailable: true });
        this.setState({ users: users })
        this.setState({ lists: lists })
        if ("" === this.state.user && users.length > 0) {
            this.setState({ user: users[0] });
        }
        if ("" === this.state.list && lists.length > 0) {
            this.setState({ list: lists[0] })
        }
    },
    extractUsers: function () {
        var users = [];
        for (var user in this.state.usersAndLists) {
            users.push(user)
        }
        return users;
    },
    extractLists: function (userName) {
        var userLists = this.state.usersAndLists[userName];
        var lists = [];
        for (var list in userLists) {
            lists.push(userLists[list]);
        }
        return lists;
    },
    render: function () {
        var that = this;
        var todoList = this.props.data.map(function (item) {
            if (item.UserName == that.state.user && item.ListName == that.state.list) {
                return React.createElement(Item, { ItemText: item.ItemText, Done: item.Done })
            }
        });
        var formStyle = {
            visibility: this.state.dataAvailable ? "visible" : "hidden"
        };
        return (
            <div className="container">
                <div className="row">
                    <h1>Todo List</h1>
                </div>
                <div className="row">
                    <form className="form-inline selectLine" role="form" style={ formStyle }>
                        <div className="form-group">
                            <Dropdown list={this.state.users} />
                            <button className="btn btn-default">New User</button>
                        </div>
                        <div className="form-group">
                            <Dropdown list={this.state.lists} />
                            <button className="btn btn-default">New List</button>
                        </div>
                    </form>
                </div>
                <div className="row">
                    <table className="todoTable">
                        {todoList}
                    </table>
                </div>
            </div>
        );
    }
});

var App = React.createClass({
    getInitialState: function () {
        return { data: [], usersAndLists: {} };
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
           <MainPane data={this.state.data} />
        );
    }
});


React.render(<App url="/api/items/" />, document.getElementById('content'));
