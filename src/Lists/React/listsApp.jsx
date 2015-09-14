var MainPane = React.createClass({
    render: function () {
        return (
            <div className="container">
                <div>This is the main container.</div>
            </div>
        );
    }
});

React.render(<MainPane />, document.getElementById('content'));
