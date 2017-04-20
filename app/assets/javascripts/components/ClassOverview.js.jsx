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
    this.showClasses = this.showClasses.bind(this);
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
    $("#my-schedule").modal();
  }

  componentDidUpdate(prevProps, prevState) {
    $("#my-schedule").modal();
  }

  componentWillUnmount() {
    $(".calendar-icon").removeClass("hide");
  }

  refreshStatus(data) {
    window.location.href += ''
  }

  loadingSync(icon) {
    var refreshClasses = "fa " + icon;
    if (this.state.syncingClasses) {
      refreshClasses += " fa-spin";
    }
    return refreshClasses;
  }

  showClasses() {
    if (this.state.courses.length == 0) {
      return (
        <div className="content">
          <h6>There are no courses in your schedule!</h6>
          <a href="/choose" className="btn btn-flat margin-top-bottom-10">Add a Course</a>
        </div>
      );
    } else {
      return (
        <ul className="collapsible popout" data-collapsible="accordion">
          {this.state.courses.map(this.createClassInfo)}
        </ul>
      );
    }
  }

  syncClass(e) {
    this.setState({ syncingClasses: true });
    var classDict = {
      token: this.props.user.token
    };
    $.post("/sync_classes", classDict)
      .done( (data) => {
        Materialize.toast('Your schedule has been synced with Google Calendar!', 2000, '', () => {
          this.setState({ syncingClasses: false, courses: data });
          window.location.href += ''
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
        current_user={this.props.user}
      />
    );
  }

  showCalendar() {
    return {
      __html: '<iframe id="cal-iframe" src="https://calendar.google.com/calendar/embed?mode=MONTH&amp;title=Your%20Calendar&amp;showTitle=0&amp;showPrint=0&amp;showCalendars=0&amp;wkst=1&amp;bgcolor=%231976d2&amp;src=' + encodeURIComponent(this.props.user.email) + '&amp;color=%23691426&amp;ctz=America%2FLos_Angeles&amp;dates=20170801%2F20170831" style="border:solid 1px #777" height="600" frameborder="0" scrolling="yes"></iframe>'
    }
  }

  render() {
    return (
      <div className="row">
        <div className="col m5 l4 s12 content">
          <div className="sync-container">
            <h4 className="current-schedule">Current Schedule</h4>
            <a onClick={this.syncClass} className="btn btn-floating waves-effect waves-light">
              <i className={this.loadingSync("fa-refresh")}></i>
            </a>
          </div>
          {this.showClasses()}
        </div>
        <div className="col iframe margin-top-15 m7 push-m5 l8 push-l4 s12" dangerouslySetInnerHTML={this.showCalendar()} />
      </div>
    );
  }
}