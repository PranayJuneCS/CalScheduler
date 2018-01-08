class ClassInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      removingClass: false,
      ...this.props
    }

    this.unsyncClass = this.unsyncClass.bind(this);
    this.formatDayTime = this.formatDayTime.bind(this);
    this.loadingSync = this.loadingSync.bind(this);
  }

  componentDidMount() {
    $("." + this.state.dept + this.state.code + this.state.component + this.state.number + "-modal").modal();
  }

  componentDidUpdate() {
    $("." + this.state.dept + this.state.code + this.state.component + this.state.number + "-modal").modal();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      this.setState(nextProps);
    }
  }

  unsyncClass(e) {
    this.setState({ removingClass: true });
    var classDict = {
      ccn: this.state.ccn,
      token: this.props.current_user.token
    };
    $.post("/delete_class", classDict)
      .done( (data) => {
        var displayName = [this.state.dept, this.state.code, this.state.component, this.state.number].join(" ");
        Materialize.toast(displayName + ' has been removed from Google Calendar and your schedule.', 2500, '', () => {
          this.setState({ removingClass: false });
          this.props.refreshStatus(data);
        });
      }).fail( (e) => {
        Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {
          this.setState({ removingClass: false });
        });
      });
  }

  syncedBadge() {
    bar = this.state.synced ? 'sync-bar green darken-1' : 'sync-bar red';
    return (
      <div className={bar}></div>
    );
  }

  loadingSync(icon) {
    var refreshClasses = "fa left " + icon;
    if (this.state.removingClass) {
      refreshClasses += " fa-spin";
    }
    return refreshClasses;
  }

  formatDayTime() {
    var i;
    var dayString = this.state.day;
    if (this.state.day != "TBD") {
      var dayArray = this.state.day.match(/.{2}/g);
      var dayString = dayArray.join('');
    }

    var timeString = "";
    var start = this.state.start_time.split(":").slice(0, 2).join(":");
    var end = this.state.end_time.split(":").slice(0, 2).join(":");
    var timeArray = [start, end];
    for (i = 0; i < timeArray.length; i++) {
      var elem = timeArray[i];
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
      if (i == 0) {
        timeString += " - " 
      }
    }

    return dayString + " " + timeString;
  }

  render() {
    return (
      <li>
        <div id={this.state.dept + this.state.code + this.state.component + this.state.number + "-removeModal"} className={"modal " + this.state.dept + this.state.code + this.state.component + this.state.number + "-modal"}>
          <div className="modal-content">
            <h4>Delete {this.state.dept} {this.state.code} {this.state.component} {this.state.number}?</h4>
            <p>Once you delete <b>{this.state.dept} {this.state.code} {this.state.component} {this.state.number}</b>, it will no longer be present in your schedule or in Google Calendar.</p>
          </div>
          <div className="divider"></div>
          <div className="modal-footer">
            <a className="modal-action modal-close waves-effect waves-red btn-flat">Cancel</a>
            <a onClick={this.unsyncClass} className="modal-action modal-close waves-effect waves-green btn-flat">OK</a>
          </div>
        </div>
        {this.syncedBadge()}
        <div className="collapsible-header">
          <div>
            <span className="">{this.state.dept} {this.state.code} {this.state.component} {this.state.number}</span>
          </div>
        </div>
        <a href={"#" + this.state.dept + this.state.code + this.state.component + this.state.number + "-removeModal"} className="delete-class-x">
          <i className={this.loadingSync("fa-trash")}></i>
        </a>
        <div className="collapsible-body">
          <div className="container class-container">
            <h5>{this.state.title}</h5>
            <div className="divider"></div>
            <div className="row collapsible-row-info">
              <div className="col s6">
                <h6>{this.formatDayTime()}</h6>
              </div>
              <div className="col s6">
                <h6>{this.state.instructor}</h6>
                <span>Location: {this.state.location}</span>
              </div>
            </div>
            <div className="final-time">{this.state.final_exam_string}</div>
          </div>
        </div>
      </li>
    );
  }
}