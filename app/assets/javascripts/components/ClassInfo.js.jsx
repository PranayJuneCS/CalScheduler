class ClassInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      removingClass: false
    }

    this.dayDict = {
      mo: 'M',
      tu: 'Tu',
      we: 'W',
      th: 'Th',
      fr: 'F'
    };

    this.unsyncClass = this.unsyncClass.bind(this);
    this.formatDayTime = this.formatDayTime.bind(this);
    this.loadingSync = this.loadingSync.bind(this);
  }

  componentDidMount() {
    $('.modal').modal();
  }

  unsyncClass(e) {
    this.setState({ removingClass: true });
    var classDict = {
      code: this.props.code
    };
    $.post("/delete_class", classDict)
      .done( (data) => {
        Materialize.toast(classDict.code + ' has been removed from Google Calendar and your schedule.', 2000, '', () => {
          this.setState({ removingClass: false });
          this.props.refreshStatus(data);
        });
      }).fail( function(e) {
        console.log("Failed unsyncing with Google Calendar.");
      });
  }

  syncedBadge() {
    if (this.props.synced) {
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
    var dayString = "";
    var i;
    var dayArray = this.props.day.split(',');
    for (i = 0; i < dayArray.length; i++) {
      dayString += this.dayDict[dayArray[i]];
    }

    var timeString = "";
    var timeArray = this.props.time.split('-');
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
        <div id="removeModal" className="modal">
          <div className="modal-content">
            <h4>Delete {this.props.code}?</h4>
            <p>Once you delete {this.props.code}, it will no longer be present in your schedule or in Google Calendar.</p>
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
            <span className="course-title">{this.props.code}</span>
            <span className="course-time">{this.formatDayTime()}</span>
          </div>
        </div>
        <div className="collapsible-body">
          <div className="container class-container">
            <h5>{this.props.title}</h5>
            <div className="divider"></div>
            <div className="row">
              <div className="col s6">
                <h6>Discussion Section</h6>
                <span>Th 3-4</span>
              </div>
              <div className="col s6">
                <a href="#removeModal" className="sync-button waves-effect waves-light btn">
                  <i className={this.loadingSync("fa-times")}></i>
                  Remove
                </a>
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}