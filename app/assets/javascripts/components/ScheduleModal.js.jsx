class ScheduleModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      courses: this.props.courses,
      syncingClasses: false
    };

    this.loadSchedule = this.loadSchedule.bind(this);
    this.showSchedule = this.showSchedule.bind(this);
    this.syncClass = this.syncClass.bind(this);
    this.loadingSync = this.loadingSync.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    $("#my-schedule").modal({
      ready: ((modal, trigger) => {
        this.loadSchedule();
      })
    });
  }

  componentDidUpdate(prevProps, prevState) {
  }

  loadSchedule() {
    $.get('/my_schedule', {token: this.props.current_user.token})
    .done((data) => {
      this.setState({ courses: data.courses });
    })
    .fail((e) => {
      Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {
        this.setState({ courses: {} });
      });
    })
  }

  syncClass(e) {
    this.setState({ syncingClasses: true });
    var classDict = {
      token: this.props.current_user.token
    };
    $.post("/sync_classes", classDict)
      .done( (data) => {
        Materialize.toast('Your schedule has been synced with Google Calendar!', 2500, '', () => {
          this.setState({ syncingClasses: false });
          this.loadSchedule();
        });
      }).fail( (e) => {
        message = 'Oh no! An error has occurred (possibly with your connnection!). Please try again.'
        if (e.status == 401) {
          message = 'Oh no! Your session has expired. Please log out, log in, and try again.'
        }
        Materialize.toast(message, 2500, '', () => {
          this.setState({ syncingClasses: false });
        });
      });
  }

  loadingSync(icon) {
    var refreshClasses = "fa " + icon;
    if (this.state.syncingClasses) {
      refreshClasses += " fa-spin";
    }
    return refreshClasses;
  }

  showSchedule(course, i) {
    var startTime = course.start_time.split(":").slice(0, 2).join(":");
    var endTime = course.end_time.split(":").slice(0, 2).join(":");
    var timeString = "";
    var timeArray = [startTime, endTime];
    for (j = 0; j < timeArray.length; j++) {
      var elem = timeArray[j];
      var hour = parseInt(elem.split(':')[0]);
      if (hour < 12) {
        if (hour < 10) {
          timeString += (elem.substr(1) + " AM");
        } else {
          timeString += (elem + " AM");
        }
      } else if (hour == 12) {
        timeString += (elem + " PM");
      } else {
        var minute = elem.split(':')[1];
        timeString += ((hour - 12) + ":" + minute + " PM")
      }
      if (j == 0) {
        timeString += "-" 
      }
    }
    var meeting = [course.day, timeString].join(" ");
    var syncedStatus = <i className="fa fa-thumbs-down fa-lg"></i>;
    if (course.synced) {
      syncedStatus = <i className="fa fa-thumbs-up fa-lg"></i>;
    }
    return (
      <tr key={i}>
        <td>{course.dept} {course.code} {course.component} {course.number}</td>
        <td>{meeting}</td>
        <td>{syncedStatus}</td>
      </tr>
    );
  }

  render() {
    return (
      <div id="my-schedule" className="modal">
        <div className="modal-content black-text content">
          <h4>My Schedule</h4>
          <table className="bordered highlight centered">
            <thead>
              <tr>
                <th>Course</th>
                <th>Time</th>
                <th>Synced with Google</th>
              </tr>
            </thead>
            <tbody>
              {this.state.courses.map(this.showSchedule)}
            </tbody>
          </table>
        </div>
        <div className="modal-footer">
          <a className="modal-action modal-close waves-effect waves-red btn-flat">Close</a>
          {window.location.pathname != "/" &&
            <a onClick={this.syncClass} className="waves-effect waves-green btn-flat">
              <i className={this.loadingSync("fa-refresh left")}></i>
              Sync With Google
            </a>
          }
        </div>
      </div>
    );
  }
}