class Search extends React.Component {
  
  constructor(props) {
    super(props);

    this.deptSearchOptions = {
      shouldSort: true,
      threshold: 0.2,
      location: 0,
      distance: 50,
      maxPatternLength: 16,
      minMatchCharLength: 1,
      keys: [
        "short",
        "long"
      ]
    };

    this.state = {
      activeDepartments: this.props.departments,
      loading: false,
      activeDept: null,
      activeDeptClasses: null,
      activeSearchClasses: null
    }

    this.handleDeptSearch = this.handleDeptSearch.bind(this);
    this.handleClassSearch = this.handleClassSearch.bind(this);
    this.showDepartments = this.showDepartments.bind(this);
    this.createDeptEntry = this.createDeptEntry.bind(this);
    this.createClassEntry = this.createClassEntry.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.clearField = this.clearField.bind(this);
    this.selectDepartment = this.selectDepartment.bind(this);
    this.deptLoadingScreen = this.deptLoadingScreen.bind(this);
    this.showClasses = this.showClasses.bind(this);
    this.backToDeptSearch = this.backToDeptSearch.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $('.tooltipped').tooltip({delay: 1000});

    this.deptFuse = new Fuse(this.props.departments, this.deptSearchOptions);
  }

  componentDidUpdate(prevProps, prevState) {
    $('.tooltipped').tooltip({delay: 1000});
  }

  handleDeptSearch() {
    var searchVal = $("#search").val().trim();
    if (searchVal.length == 0) {
      this.setState({ activeDepartments: this.props.departments });
    } else {
      var result = this.deptFuse.search(searchVal);
      this.setState({ activeDepartments: result });
    }
  }

  handleClassSearch() {
    var searchVal = $("#search").val().trim();
    if (searchVal.length == 0) {
      this.setState({ activeSearchClasses: this.state.activeDeptClasses });
    } else {
      var result = this.classFuse.search(searchVal);
      this.setState({ activeSearchClasses: result });
    }
  }

  createDeptEntry(course, i) {
    return (
      <DepartmentEntry
        key={i}
        {...course}
        selectDepartment={this.selectDepartment}
      />
    );
  }

  createClassEntry(course, i) {
    var courseName = course.class.displayName.substring(12);
    var meeting = course.meetings;
    var instructor;
    if (!meeting) {
      meeting = {
        meetsDays: "- TBD -",
        location: {
          description: "- TBD -"
        }
      };
      instructor = "TBD";
    } else {
      meeting = meeting[0];
      meeting.startTime = meeting.startTime.split(":").slice(0, 2).join(":");
      meeting.endTime = meeting.endTime.split(":").slice(0, 2).join(":");
      var time = meeting.startTime + "-" + meeting.endTime;
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
      if (!meeting.location.description) {
        meeting.location.description = "- TBD -";
      }
      if (!meeting.meetsDays) {
        meeting.meetsDays = "- TBD -";
        timeString = "";
      }
      instructor = meeting.assignedInstructors;
      if (!instructor) {
        instructor = "TBD";
      } else {
        instructor = instructor[0].instructor.names;
        if (!instructor) {
          instructor = "TBD";
        } else {
          instructor = instructor[0].formattedName;
        }
      }
    }
    return (
      <tr key={i} className="hoverable">
        <td><b>{courseName}</b></td>
        <td>{meeting.meetsDays} {timeString}</td>
        <td className="hide">{meeting.location.description}</td>
        <td>{instructor}</td>
      </tr>
    );
  }

  selectDepartment(dept) {
    this.setState({ loading: true, activeDept: dept });
    $.get("/classes_from_dept", {short: dept.short})
      .done( (data) => {
        console.log(data);
        var classSearchOptions = {
          shouldSort: true,
          threshold: 0.2,
          location: dept.short.length,
          distance: 50,
          maxPatternLength: 16,
          minMatchCharLength: 1,
          keys: [
            "class.course.displayName",
          ]
        };
        this.classFuse = new Fuse(data.classes, classSearchOptions);
        this.setState({ loading: false, activeDeptClasses: data.classes, activeSearchClasses: data.classes });
      }).fail( (e) => {
        this.setState({ loading: false });
        console.log("SHIZ");
      });
  }

  showDepartments() {
    if (this.state.activeDepartments.length == 0) {
      return (
        <tr><td><h3>No Results!</h3></td></tr>
      );
    }
    return this.state.activeDepartments.map(this.createDeptEntry);
  }

  showClasses() {
    if (this.state.activeSearchClasses.length == 0) {
      return (
        <tr>
          <td></td>
          <td><h3>No Results!</h3></td>
          <td></td>
        </tr>
      );
    }
    return this.state.activeSearchClasses.map(this.createClassEntry);
  }

  searchClick() {
    $('#search').focus();
  }

  clearField() {
    $('#search').val('');
    if (this.state.activeDept) {
      this.handleClassSearch();
    } else {
      this.handleDeptSearch();
    }
    
  }

  submitForm(e) {
    e.preventDefault();
    $('#search').blur();
  }

  backToDeptSearch() {
    this.classFuse = null;
    this.setState({
      activeDepartments: this.props.departments,
      activeDept: null,
      activeDeptClasses: null,
      activeSearchClasses: null
    });
  }

  deptLoadingScreen() {
    if (this.state.loading) {
      return (
        <div className="loading-screen">
          <div className="loading-info">
            <div className="content container">
              <h5>Loading Class Data for:</h5>
              <h4><b>{this.state.activeDept.short}</b> - {this.state.activeDept.long}</h4>
              <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
    
  }

  render() {
    if (!this.state.activeDeptClasses) {
      return (
        <div className="content container">
          {this.deptLoadingScreen()}
          <div className="header-container">
            <a href="/" data-position="right" data-delay="1000" data-tooltip="My Schedule" className="btn-floating btn waves-effect waves-light right tooltipped">
              <i className="material-icons">home</i>
            </a>
            <h4 style={{flex: 1}}>Search For Classes</h4>
            <a onClick={this.searchClick} className="btn-floating btn waves-effect waves-light right">
              <i className="material-icons">search</i>
            </a>
          </div>
          <nav id="class-search">
            <div className="nav-wrapper">
              <form onSubmit={this.submitForm}>
                <div className="input-field">
                  <input placeholder="Search for a Department" id="search" type="search" onChange={this.handleDeptSearch} autoComplete="off" required />
                  <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                  <i onClick={this.clearField} className="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
          <table className="highlight bordered centered">
            <tbody>
              {this.showDepartments()}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="content container">
          <div className="header-container">
            <a onClick={this.backToDeptSearch} data-position="right" data-tooltip="Search by Department" className="btn-floating btn waves-effect waves-light left">
              <i className="material-icons">arrow_back</i>
            </a>
            <h4 style={{flex: 1}}>Search For Classes</h4>
            <a onClick={this.searchClick} className="btn-floating btn waves-effect waves-light right">
              <i className="material-icons">search</i>
            </a>
          </div>
          <nav id="class-search">
            <div className="nav-wrapper">
              <form onSubmit={this.submitForm}>
                <div className="input-field">
                  <input placeholder={"Search in " + this.state.activeDept.short} id="search" type="search" onChange={this.handleClassSearch} autoComplete="off" required />
                  <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                  <i onClick={this.clearField} className="material-icons">close</i>
                </div>
              </form>
            </div>
          </nav>
          <table className="highlight bordered centered">
            <thead>
              <tr>
                <th>Course</th>
                <th>Meeting Time</th>
                <th>Instructor</th>
              </tr>
            </thead>
            <tbody>
              {this.showClasses()}
            </tbody>
          </table>
        </div>
      );
    }
    
  }
}