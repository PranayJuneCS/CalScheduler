class CCN extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      inputError: false,
      searching: false,
      searchError: null,
      course: null,
      ccnState: "down",
      addingClass: false,
      ccns: this.props.ccns
    }
    
    this.submitForm = this.submitForm.bind(this);
    this.clearField = this.clearField.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.loading = this.loading.bind(this);
    this.inputError = this.inputError.bind(this);
    this.searchError = this.searchError.bind(this);
    this.courseInfo = this.courseInfo.bind(this);
    this.toggleCCNInfo = this.toggleCCNInfo.bind(this);
    this.formatClassTime = this.formatClassTime.bind(this);
    this.addClass = this.addClass.bind(this);
    this.scheduleStatus = this.scheduleStatus.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $("#my-schedule").modal();
  }

  handleSearch() {
    var searchVal = $("#search").val().trim();
    var ccnNum = parseInt(searchVal);
    if (!ccnNum || ccnNum.toString().length != 5 || searchVal.length != 5) {
      this.setState({ inputError: true, searching: false, searchError: null, course: null });
    } else {
      this.setState({ inputError: false, searching: true, searchError: null, course: null });
      $.get('/ccn_search', {ccn: ccnNum.toString(), token: this.props.current_user.token})
      .done( (data) => {
        setTimeout(() => {
          if (data.code != "200") {
            this.setState({ searchError: data.message, searching: false });
          } else {
            this.setState({ course: data.course, searching: false });
          }
        }, 1800);
      }).fail( (e) => {
        this.setState({ searching: false });
        console.log("SHIZ");
      });
    }
  }

  clearField() {
    $('#search').val('');
    this.setState({ inputError: false, searching: false });
  }

  submitForm(e) {
    e.preventDefault();
    $('#search').blur();
    this.handleSearch();
  }

  searchClick() {
    $('#search').focus();
  }

  loading() {
    if (this.state.searching) {
      return (
        <div>
          <h4>Searching...</h4>
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
        </div>
      );
    }
    return null;
  }

  inputError() {
    if (this.state.inputError) {
      return (
        <div>
          <h4>Invalid CCN!</h4>
          <h6>A <b>CCN</b> must be a 5 digit number. Try Again.</h6>
        </div>
      );
    }
    return null;
  }

  searchError() {
    if (this.state.searchError) {
      return (
        <div>
          <h5>{this.state.searchError}</h5>
        </div>
      );
    }
    return null;
  }

  toggleCCNInfo() {
    $("#ccn-action").slideToggle("slow");
    if (this.state.ccnState == "up") {
      this.setState({ ccnState: "down" });
    } else {
      this.setState({ ccnState: "up" });
    }
  }

  formatClassTime(start, end) {
    start = start.split(":").slice(0, 2).join(":");
    end = end.split(":").slice(0, 2).join(":");
    var time = start + "-" + end;
    var timeString = "";
    var timeArray = time.split('-');
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
    return timeString;
  }

  addClass(e) {
    this.setState({ addingClass: true });
    var classDict = {
      title: this.state.course.title,
      day: this.state.course.meetsDays || "TBD",
      ccn: this.state.course.ccn,
      component: this.state.course.component,
      start_time: this.state.course.startTime,
      end_time: this.state.course.endTime,
      location: this.state.course.location || "TBD",
      instructor: this.state.course.instructor || "No Specified Instructor",
      dept: this.state.course.subject_area,
      code: this.state.course.catalog_number,
      number: this.state.course.number,
      token: this.props.current_user.token
    };
    $.post("/add_class", classDict)
      .done( (data) => {
        var displayName = [classDict.dept, classDict.code, classDict.component, classDict.number].join(' ')
        Materialize.toast(displayName + ' has been added to your schedule!', 2000, '', () => {
          var currCCNs = this.state.ccns;
          currCCNs.push(this.state.course.ccn);
          this.setState({ addingClass: false, ccns: currCCNs });
        });
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  scheduleStatus() {
    if (this.state.ccns.indexOf(this.state.course.ccn) >= 0) {
      return (
        <div>
          <div className="col s4 hide-on-large-only">
            <p><i className="fa fa-check fa-2x"></i></p>
          </div>
          <div className="col s4 hide-on-med-and-down">
            <p>Already In Your Schedule!</p>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className="col s4 hide-on-large-only">
            <p>
              <a onClick={this.addClass} className="btn btn-floating waves-effect waves-light">
                {!this.state.addingClass && <i className="material-icons">add</i>}
                {this.state.addingClass && <i className="fa fa-spinner fa-pulse fa-fw"></i>}
              </a>
            </p>
          </div>
          <div className="col s4 hide-on-med-and-down">
            <p>
              <a onClick={this.addClass} className="waves-effect waves-light btn">
                {!this.state.addingClass && <i className="fa fa-plus left"></i>}
                {this.state.addingClass && <i className="fa fa-spinner fa-pulse fa-fw left"></i>}
                Add To Schedule
              </a>
            </p>
          </div>
        </div>
      );
    }
  }

  courseInfo() {
    if (this.state.course) {
      var course = this.state.course;
      var displayName = [course.subject_area, course.catalog_number, course.component, course.number].join(' ')
      var timeString = this.formatClassTime(course.startTime, course.endTime);
      return (
        <div className="animated zoomIn">
          <h5>Here is CCN <b>{course.ccn}</b>:</h5>
          <div className="z-depth-1 ccn-class-info">
            <div className="content">
              <div className="row no-margin-bottom">
                <div className="col s12 hide-on-small-only">
                  <p><b>{displayName}</b>: {course.title}</p>
                </div>
                <div className="col s6 hide-on-med-and-up">
                  <p><b>{displayName}</b></p>
                </div>
                <div className="col s6 hide-on-med-and-up">
                  <p>{course.instructor}</p>
                </div>
              </div>
              <div id="ccn-action" className="row no-margin-bottom">
                <div className="col s12 hide-on-med-and-up">
                  <h6>{course.title}</h6>
                </div>
                <div className="col s4 hide-on-med-and-up">
                  <p className="one-line-height"><b>Location</b>:</p>
                  <p className="one-line-height">{course.location}</p>
                </div>
                <div className="col s4 hide-on-small-only">
                  <p className="one-line-height"><b>Instructor</b>: {course.instructor}</p>
                  <p className="one-line-height"><b>Location</b>: {course.location}</p>
                </div>
                <div className="col s4">
                  <p className="one-line-height"><b>{course.meetsDays}</b></p>
                  <p className="one-line-height">{timeString}</p>
                </div>
                {this.scheduleStatus()}
              </div>
              <div onClick={this.toggleCCNInfo} className="ccn-more-container">
                <i className={"fa fa-chevron-" + this.state.ccnState + " fa-lg"}></i>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <div className="content container">
        <div className="search-container">
          <h4 className="smaller-header">Add a Course by CCN</h4>
          <div className="hide-on-small-only">
            <a href="/course" className="btn btn-flat">Course Info Search</a>
          </div>
        </div>
        <nav id="class-search" className="">
          <div className="nav-wrapper">
            <form onSubmit={this.submitForm}>
              <div className="input-field">
                <input placeholder="Search by CCN" id="search" type="search" autoComplete="off" required maxLength="8"/>
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                <i onClick={this.submitForm} className="material-icons">send</i>
                <i onClick={this.clearField} className="clear-field material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
        {this.inputError()}
        {this.searchError()}
        {this.loading()}
        {this.courseInfo()}
        <a href="/course" className="alt-search black-text hide-on-med-and-up waves-effect waves-light btn">Course Info Search</a>
      </div>
    );
  }
}