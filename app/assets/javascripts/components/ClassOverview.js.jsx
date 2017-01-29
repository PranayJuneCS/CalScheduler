class ClassOverview extends React.Component {

  componentDidMount() {
    $('.collapsible').collapsible({
      onOpen: function(el) {}
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
        <h4>Signed in as {this.props.user.name}.</h4>
        <h4>My Current Schedule</h4>
        <ul className="collapsible popout" data-collapsible="accordion">
          {this.props.courses.map(this.createClassInfo)}
        </ul>
        <a href="/signout" className="waves-effect waves-light btn">
          <i className="fa fa-sign-out left"></i>
          Sign Out
        </a>
      </div>
    );
  }
}