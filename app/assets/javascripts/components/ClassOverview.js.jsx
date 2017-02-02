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
        <div className="">
          <h4>My Current Schedule</h4>
          <a href="/add" id="add-class-button" className="btn-floating btn waves-effect waves-light right">
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