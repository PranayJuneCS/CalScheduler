class Select extends React.Component {

  constructor(props) {
    super(props);

    this.allClasses = [
     {
        code: "CS61A",
        dept: "COMPSCI",
        title: "Structure and Interpretation of Computer Programs",
        day: "mo,we,fr",
        time: "14:00-15:00"
     },
     {
        code: "CS61B",
        dept: "COMPSCI",
        title: "Data Structures",
        day: "tu,th",
        time: "08:00-09:00"
     },
     {
        code: "CS61C",
        dept: "COMPSCI",
        title: "Great Ideas in Computer Architecture",
        day: "mo,we",
        time: "17:00-18:30"
     },
     {
        code: "PSYCH160",
        dept: "PSYCHOLOGY",
        title: "Social Psychology",
        day: "tu,th",
        time: "14:00-15:30"
     },
     {
        code: "BIOE100",
        dept: "BIOE",
        title: "Ethics and Science in Engineering",
        day: "mo,we,fr",
        time: "09:00-10:00"
     },
     {
        code: "EE16B",
        dept: "ELENG",
        title: "Designing Information Devices and Systems II",
        day: "tu,th",
        time: "18:30-20:00"
     }
    ];

    this.state = {
      activeClasses: this.allClasses,
      showMyClasses: false
    };

    this.codes = [];
    var i;
    var coursesLength = this.props.courses.length;
    for (i = 0; i < coursesLength; i++) {
      this.codes.push(this.props.courses[i].code);
    }

    this.searchOptions = {
      shouldSort: true,
      threshold: 0.35,
      location: 0,
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 1,
      keys: [
        "code",
        "dept"
      ]
    };

    this.inCodeArray = this.inCodeArray.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.createTableEntry = this.createTableEntry.bind(this);
    this.refreshCodes = this.refreshCodes.bind(this);
    this.showClasses = this.showClasses.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $('.tooltipped').tooltip({delay: 1000});

    this.fuse = new Fuse(this.allClasses, this.searchOptions);
  }

  inCodeArray(code) {
    return this.codes.indexOf(code) >= 0;
  }

  handleSearch(e) {
    if (e.target.value.length == 0) {
      this.setState({ activeClasses: this.allClasses });
    } else {
      var result = this.fuse.search(e.target.value.trim());
      this.setState({ activeClasses: result });
    }
  }

  refreshCodes(code) {
    this.codes.push(code);
    this.forceUpdate();
  }

  createTableEntry(course, i) {
    if (!this.state.showMyClasses) {
      if (this.inCodeArray(course.code)) {
        return null;
      }
    }
    return (
      <ClassesTableEntry
        key={i}
        code={course.code}
        title={course.title}
        day={course.day}
        time={course.time}
        inSchedule={this.inCodeArray(course.code)}
        refreshCodes={this.refreshCodes}
      />
    );
  }

  showClasses() {
    if (this.state.activeClasses.length == 0) {
      return (
        <tr><td><h3>No Results!</h3></td></tr>
      );
    }
    return this.state.activeClasses.map(this.createTableEntry);
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <h4 style={{flex: 1}}>Select Your Classes</h4>
          <a href="/" data-position="left" data-delay="1000" data-tooltip="My Schedule" className="btn-floating btn waves-effect waves-light right tooltipped">
            <i className="material-icons">home</i>
          </a>
        </div>
        <nav id="class-search">
          <div className="nav-wrapper">
            <form>
              <div className="input-field">
                <input placeholder="Search..." id="search" type="search" onChange={this.handleSearch} autoComplete="off" required />
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                <i className="material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
        <div className="switch show-my-classes">
          <label>
            <input type="checkbox" onChange={() => this.setState({ showMyClasses: !this.state.showMyClasses })}/>
            <span className="lever"></span>
          </label>
          Show Classes In Your Schedule
        </div>
        <table className="highlight bordered centered">
          <tbody>
            {this.showClasses()}
          </tbody>
        </table>
      </div>
    );
  }
}