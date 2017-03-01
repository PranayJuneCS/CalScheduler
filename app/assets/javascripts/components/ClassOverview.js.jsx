class ClassOverview extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      courses: this.props.courses,
      syncingClasses: false
    };
    
    this.refreshStatus = this.refreshStatus.bind(this);
    this.createClassInfo = this.createClassInfo.bind(this);
    this.syncClass = this.syncClass.bind(this);
    this.loadingSync = this.loadingSync.bind(this);
  }

  componentDidMount() {
    $('.collapsible').collapsible({
      onOpen: function(el) {}
    });
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $(".calendar-icon").addClass("hide");
    $('.tooltipped').tooltip({delay: 1000});
  }

  componentWillUnmount() {
    $(".calendar-icon").removeClass("hide");
  }

  refreshStatus(data) {
    this.setState({ courses: data });
    $("#cal-iframe").attr("src", $("#cal-iframe").attr("src"));
  }

  loadingSync(icon) {
    var refreshClasses = "fa " + icon;
    if (this.state.syncingClasses) {
      refreshClasses += " fa-spin";
    }
    return refreshClasses;
  }

  syncClass(e) {
    this.setState({ syncingClasses: true });
    var classDict = {};
    $.post("/sync_classes", classDict)
      .done( (data) => {
        Materialize.toast('Your schedule has been synced with Google Calendar!', 2000, '', () => {
          this.setState({ syncingClasses: false, courses: data });
          $("#cal-iframe").attr("src", $("#cal-iframe").attr("src"));
        });
      }).fail( function(e) {
        console.log("Failed syncing with Google Calendar.");
      });
  }

  createClassInfo(course, i) {
    return (
      <ClassInfo
        key={i}
        refreshStatus={this.refreshStatus}
        {...course}
      />
    );
  }

  showCalendar() {
    return {
      __html: '<iframe id="cal-iframe" src="https://calendar.google.com/calendar/embed?title=Your%20Calendar&amp;showTitle=0&amp;showPrint=0&amp;showCalendars=0&amp;height=600&amp;wkst=1&amp;bgcolor=%23336666&amp;src=' + encodeURIComponent(this.props.user.email) + '&amp;color=%23691426&amp;ctz=America%2FLos_Angeles" style="border:solid 1px #777" height="600" frameborder="0" scrolling="yes"></iframe>'
    }
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <a onClick={this.syncClass} data-position="right" data-delay="1000" data-tooltip="Sync With Google" className="btn-floating btn waves-effect waves-light left tooltipped">
            <i className={this.loadingSync("fa-refresh")}></i>
          </a>
          <h4 style={{flex: 1}}>My Schedule</h4>
          <a href="/choose" data-position="left" data-delay="1000" data-tooltip="Add Courses" className="btn-floating btn waves-effect waves-light right tooltipped">
            <i className="material-icons">add</i>
          </a>
        </div>
        <ul className="collapsible popout" data-collapsible="accordion">
          {this.state.courses.map(this.createClassInfo)}
        </ul>
        <div className="animated fadeIn">
          <div dangerouslySetInnerHTML={this.showCalendar()} />
        </div>
      </div>
    );
  }
}