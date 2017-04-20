class CourseComponent extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      addingCourse: null,
      ccns: this.props.ccns,
      visible: this.props.visible
    }

    this.showCourse = this.showCourse.bind(this);
    this.showMoreInfo = this.showMoreInfo.bind(this);
    this.courseInScheduleStatus = this.courseInScheduleStatus.bind(this);
    this.visible = this.visible.bind(this); 
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ visible: nextProps.visible });
  }

  showMoreInfo(course) {
    this.setState({ addingCourse: course });
    var startTime = "00:00:00";
    var endTime = "00:00:00";
    var meetsDays = "TBD";
    var location = "TBD";
    var instructor = "No Specified Instructor";
    if (course.meetings) {
      var meeting = course.meetings[0];
      startTime = meeting.startTime;
      endTime = meeting.endTime;
      meetsDays = meeting.meetsDays || "TBD";
      if (meeting.location) {
        location = meeting.location.description || "TBD";
      }
      if (meeting.assignedInstructors) {
        if (meeting.assignedInstructors[0].instructor) {
          var y = meeting.assignedInstructors[0].instructor;
          if (y.names) {
            instructor = y.names[0].formattedName;
          }
        }
      }
    }
    var classDict = {
      title: course.class.course.title,
      ccn: course.id.toString(),
      component: course.component.code,
      dept: course.class.course.subjectArea.code,
      code: course.class.course.catalogNumber.formatted,
      number: course.number,
      day: meetsDays || "TBD",
      start_time: startTime,
      end_time: endTime,
      instructor: instructor || "No Specified Instructor",
      location: location || "TBD",
      token: this.props.current_user.token
    };
    $.post("/add_class", classDict)
      .done( (data) => {
        var displayName = [classDict.dept, classDict.code, classDict.component, classDict.number].join(' ')
        Materialize.toast(displayName + ' has been added to your schedule!', 2000, '', () => {
          this.props.updateCCNs(classDict.ccn);
          this.setState({ addingCourse: null });
        });
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  showCourse(course, i) {
    var meeting = "TBD";
    var location = "TBD";
    if (course.meetings) {
      meeting = course.meetings[0];
      if (meeting.location) {
        location = meeting.location.description;
      }
      var startTime = meeting.startTime.split(":").slice(0, 2).join(":");
      var endTime = meeting.endTime.split(":").slice(0, 2).join(":");
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
      meeting = [meeting.meetsDays, timeString].join(" ");
    }
    return (
      <div key={i} className="">
        <div className="row course-row">
          <div className="col s3">
            <p><b>{course.id}</b> - {this.props.comp} {course.number}</p>
          </div>
          <div className="col s3">
            <p>{meeting}</p>
          </div>
          <div className="col s3">
            <p>{location}</p>
          </div>
          {this.courseInScheduleStatus(course)}
        </div>
        <div className="divider"></div>
      </div>
    );
  }

  courseInScheduleStatus(course) {
    var courseID = course.id.toString();
    if (this.props.ccns.indexOf(courseID) >= 0) {
      return (
        <div className="col s3">
          <p>
            <i className="fa fa-check fa-2x"></i>
          </p>
        </div>
      );
    } else {
      if (this.state.addingCourse === course) {
        return (
          <div className="col s3">
            <p>
              <i className="fa fa-spinner fa-spin fa-2x"></i>
            </p>
          </div>
        );
      } else {
        return (
          <div className="col s3">
            <p>
              <i onClick={() => this.showMoreInfo(course)} className="add-course-plus material-icons">add</i>
            </p>
          </div>
        );
      }
    }
  }

  visible() {
    if (this.state.visible == 0) {
      return "hide";
    }
    return "";
  }

  render() {
    return (
      <div className={this.visible()}>
        <div className="section">
          <h5 className="text-left">{this.props.component}</h5>
          {this.props.courses.map(this.showCourse)}
        </div>
      </div>
    );
  }
}