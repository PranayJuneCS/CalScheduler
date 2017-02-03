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

  showCalendar() {
    return {
      __html: '<iframe src="https://calendar.google.com/calendar/embed?title=Your%20Calendar&amp;showTitle=0&amp;showPrint=0&amp;showCalendars=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23336666&amp;src=' + encodeURIComponent(this.props.user.email) + '&amp;color=%23691426&amp;ctz=America%2FLos_Angeles" style="border:solid 1px #777" height="600" frameborder="0" scrolling="yes"></iframe>'
    }
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
        <div>
          <div dangerouslySetInnerHTML={this.showCalendar()} />
        </div>
      </div>
    );
  }
}