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
        return { user: "", list: "" };
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
    extractLists: function (userName) {
        var userLists = this.extractUsersAndLists()[userName];
        var lists = [];
        if (userLists) {
            userLists.map(function (list) {
                lists.push(list);
            });
        }
        return lists;
    },
    render: function () {
        var that = this;
        var todoList = this.props.data.map(function (item) {
            //if (item.UserName == that.state.user && item.ListName == that.state.list) {
                return React.createElement(Item, { ItemText: item.ItemText, Done: item.Done })
            //}
        });
        return (
            <div className="container">
                <div className="row">
                    <h1>Todo List</h1>
                </div>
                <div className="row">
                    <form className="form-inline selectLine" role="form">
                        <div className="form-group">
                            <Dropdown list={this.extractUsers()} />
                            <button className="btn btn-default">New User</button>
                        </div>
                        <div className="form-group">
                            <Dropdown list={this.extractLists("Van")} />
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
