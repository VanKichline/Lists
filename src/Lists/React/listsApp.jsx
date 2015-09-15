var MainPane = React.createClass({
    render: function () {
        var todoList = this.props.data.map(function (item) {
            return <Item ItemText={item.ItemText} Done={item.Done} />
        });
        return (
            <div className="container">
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

// Props: ItemText, Done
var Item = React.createClass({
    render: function () {
        return (
            <tr>
                <td className="cbTD"><input type="checkbox" checked={this.props.Done} /></td>
                <td>{this.props.ItemText}</td>
            </tr>
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
           <MainPane data={this.state.data} />
        );
    }
});


React.render(<App url="/api/items/" />, document.getElementById('content'));
