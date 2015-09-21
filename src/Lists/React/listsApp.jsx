﻿
var MainPane = React.createClass({
    getInitialState: function () {
        return { users: [], lists: [], selectedUser: "", selectedList: "" };
    },
    extractUsers: function () {
        var users = [];
        for (var user in this.props.usersAndLists) {
            users.push(user)
        }
        return users;
    },
    extractLists: function (userName) {
        var userLists = this.props.usersAndLists[userName];
        var lists = [];
        for (var list in userLists) {
            lists.push(userLists[list]);
        }
        return lists;
    },
    render: function () {
        var todoList = this.props.data.map(function (item) {
            return <Item ItemText={item.ItemText} Done={item.Done } />
        });
        return (
            <div className="container">
                <div className="row">
                    <h1>Todo List</h1>
                </div>
                <div className="row">
                    <Dropdown list={this.extractUsers()} />
                    &nbsp;
                    <Dropdown list={this.extractLists(this.extractUsers()[0])} />
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

var Dropdown = React.createClass({
    render: function() {
        return ( <select>{this.renderListItems()}</select> );
    },
    renderListItems: function() {
        var items = [];
        for (var i = 0; i < this.props.list.length; i++) {
            var item = this.props.list[i];
            items.push( <option>{item}</option> );
        }
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

var App = React.createClass({
    getInitialState: function () {
        return { data: [], usersAndLists: {} };
    },
    componentWillMount: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var webAPIData = JSON.parse(xhr.responseText);
            var allUsers = {};
            webAPIData.map(function (item) {
                if (undefined == allUsers[item.UserName]) {
                    allUsers[item.UserName] = [item.ListName];
                } else {
                    if ($.inArray(item.ListName, allUsers[item.UserName]) < 0) {
                        allUsers[item.UserName].push(item.ListName);
                    }
                }
            });
            this.setState({ data: webAPIData });
            this.setState({ usersAndLists: allUsers });
        }.bind(this);
        xhr.send();
    },
    render: function () {
        return (
           <MainPane data={this.state.data} usersAndLists={this.state.usersAndLists} />
        );
    }
});


React.render(<App url="/api/items/" />, document.getElementById('content'));