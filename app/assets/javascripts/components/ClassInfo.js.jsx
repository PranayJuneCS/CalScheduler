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
      ccn: this.state.ccn
    };
    $.post("/delete_class", classDict)
      .done( (data) => {
        var displayName = [this.state.dept, this.state.code, this.state.component, this.state.number].join(" ");
        Materialize.toast(displayName + ' has been removed from Google Calendar and your schedule.', 2000, '', () => {
          this.setState({ removingClass: false });
          this.state.refreshStatus(data);
        });
      }).fail( function(e) {
        console.log("Failed unsyncing with Google Calendar.");
      });
  }

  syncedBadge() {
    if (this.state.synced) {
      return (
        <div>
          <span className="hide-on-small-only sync-badge new badge blue" data-badge-caption="Synced!"></span>
          <div className="hide-on-med-and-up blue-bar"></div>
        </div>
      );
    } else {
      return (
        <div>
          <span className="hide-on-small-only sync-badge new badge red" data-badge-caption="Unsynced!"></span>
          <div className="hide-on-med-and-up red-bar"></div>
        </div>
      );
    }
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
    var dayArray = this.state.day.match(/.{2}/g);
    var dayString = dayArray.join('');

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
            <span className="course-title">{this.state.dept} {this.state.code} {this.state.component} {this.state.number}</span>
            <span className="course-time">{this.state.instructor}</span>
          </div>
        </div>
        <div className="collapsible-body">
          <div className="container class-container">
            <h5>{this.state.title}</h5>
            <div className="divider"></div>
            <div className="row">
              <div className="col s6">
                <h6>{this.formatDayTime()}</h6>
                <span>{this.state.location}</span>
              </div>
              <div className="col s6">
                <a href={"#" + this.state.dept + this.state.code + this.state.component + this.state.number + "-removeModal"} className="sync-button waves-effect waves-light btn">
                  <i className={this.loadingSync("fa-times")}></i>
                  Delete
                </a>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}