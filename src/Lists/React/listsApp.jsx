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
    React.render(<App url="/api/items/" />, document.getElementById('content'));
});

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
    addUser: function () { alert("TBD: Add User"); },
    addList: function () { console.log("TBD: Add list for user " + this.getUser()); },
    itemChanged: function (item, state) { console.log("TBD: " + item.ListName + "/" + item.ItemText + "->" + state); },
    itemDeleted: function (item) { console.log("TBD: " + item.ListName + "/" + item.ItemText + " Deleted"); },
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
