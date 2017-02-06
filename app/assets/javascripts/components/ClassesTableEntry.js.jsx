class ClassesTableEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addingClass: false
    }
    this.addClass = this.addClass.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
    this.formatDayTime = this.formatDayTime.bind(this);

    this.dayDict = {
      mo: 'M',
      tu: 'Tu',
      we: 'W',
      th: 'Th',
      fr: 'F'
    };
  }

  addClass(e) {
    this.setState({ addingClass: true });
    var classDict = {
      code: this.props.code,
      title: this.props.title,
      day: this.props.day,
      time: this.props.time
    };
    $.post("/add_class", classDict)
      .done( (data) => {
        Materialize.toast(classDict.code + ' has been added to your schedule!', 2000, '', () => {
          this.setState({ addingClass: false });
          this.props.refreshCodes(classDict.code);
        });
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  renderStatus() {
    if (this.props.inSchedule) {
      return (
        <td>
          <i className="fa fa-check fa-2x hide-on-med-and-up"></i>
          <div className="hide-on-small-only" style={{fontWeight: 'bold'}}>Already In Your Schedule!</div>
        </td>
      );
    } else {
      if (this.state.addingClass) {
        return (
          <td>
            <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
          </td>
        );
      } else {
        return (
          <td>
            <a className="add-specific-class" onClick={this.addClass}>
              <i className="fa fa-plus-circle fa-2x"></i>
            </a>
          </td>
        );
      }
    }
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
      <tr>
        <td>{this.props.code}</td>
        <td className="hide">{this.props.title}</td>
        <td>{this.formatDayTime()}</td>
        {this.renderStatus()}
      </tr>
    );
  }
}