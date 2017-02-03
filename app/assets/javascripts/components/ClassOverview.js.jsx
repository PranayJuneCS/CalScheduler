class ClassOverview extends React.Component {

  componentDidMount() {
    $('.collapsible').collapsible({
      onOpen: function(el) {}
    });
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $('.tooltipped').tooltip({delay: 1000});
  }

  createClassInfo(course, i) {
    return (
      <ClassInfo
        key={i}
        {...course}
      />
    );
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <h4 style={{flex: 1}}>My Schedule</h4>
          <a href="/add" data-position="left" data-delay="1000" data-tooltip="Add Classes" className="btn-floating btn waves-effect waves-light right tooltipped">
            <i className="material-icons">add</i>
          </a>
        </div>
        <ul className="collapsible popout" data-collapsible="accordion">
          {this.props.courses.map(this.createClassInfo)}
        </ul>
      </div>
    );
  }
}