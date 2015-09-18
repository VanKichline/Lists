var MainPane = React.createClass({
    render: function () {
        var todoList = this.props.data.map(function (item) {
            return <Item ItemText={item.ItemText} Done={item.Done} />
        });
        return (
            <div className="container">
                <div className="row">
                    <Dropdown list={this.props.users} />
                </div>
                <div className="row">
                    <h1>Todo List</h1>
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
        return { data: [], users: [] };
    },
    componentWillMount: function () {
        var xhr = new XMLHttpRequest();
        xhr.open('get', this.props.url, true);
        xhr.onload = function () {
            var webAPIData = JSON.parse(xhr.responseText);
            var userList = [];
            webAPIData.map(function (item) {
                if ($.inArray(item.UserName, userList) < 0) {
                    userList.push(item.UserName);
                }
            });
            this.setState({ data: webAPIData });
            this.setState({ users: userList });
        }.bind(this);
        xhr.send();
    },
    render: function () {
        return (
           <MainPane data={this.state.data} users={this.state.users} />
        );
    }
});


React.render(<App url="/api/items/" />, document.getElementById('content'));
