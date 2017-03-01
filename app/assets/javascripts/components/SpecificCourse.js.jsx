class SpecificCourse extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loadingCourses: true,
      courses: false,
      ccns: this.props.ccns

    };

    this.translateDict = {
      LEC: "Lectures",
      DIS: "Discussions",
      LAB: "Labs",
      IND: "Independent Study",
      SEM: "Seminars",
      GRP: "Group Study",
      OTH: "Other"
    };

    this.loadingCourses = this.loadingCourses.bind(this);
    this.loadCourses = this.loadCourses.bind(this);
    this.displayCourses = this.displayCourses.bind(this);
    this.updateCCNs = this.updateCCNs.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });

    this.loadCourses();
  }

  loadingCourses() {
    return (
      <div className="content container">
        <h6>Loading...</h6>
        <div className="sk-folding-cube">
          <div className="sk-cube1 sk-cube load"></div>
          <div className="sk-cube2 sk-cube load"></div>
          <div className="sk-cube4 sk-cube load"></div>
          <div className="sk-cube3 sk-cube load"></div>
        </div>
      </div>
    );
  }

  loadCourses() {
    $.get('/all_courses', { dept: this.props.dept, code: this.props.code })
    .done((data) => {
      if (data.code != "200") {
        this.setState({ loadingCourses: false });
        console.log("SHIZ");
      } else {
        setTimeout(() => {
          this.setState({
            ...data.sections,
            courses: true,
            loadingCourses: false
          });
        }, 500);
      }
    })
    .fail((e) => {
      this.setState({ loadingCourses: false });
      console.log("SHIZ");
    })
  }

  updateCCNs(ccn) {
    var currCCNs = this.state.ccns;
    currCCNs.push(ccn);
    this.setState({ ccns: currCCNs });
  }

  displayCourses() {
    return (
      <div>
        {["LEC", "DIS", "LAB", "SEM", "IND", "GRP", "OTH"].map((component, i) => {
          return (
            <CourseComponent
              comp={component}
              component={this.translateDict[component]}
              key={i}
              courses={this.state[component]}
              ccns={this.state.ccns}
              updateCCNs={this.updateCCNs}
            />
          );
        })}
      </div>
    );
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <h4 style={{flex: 1}}>{this.props.dept} {this.props.code}</h4>
        </div>
        <div className="row">
          <div className="col m5 l4 hide-on-small-only">
            <div className="card white">
              <div className="card-content">
                <span className="card-title">Filters</span>
                <p>I am a very simple card. I am good at containing small bits of information.
                I am convenient because I require little markup to use effectively.</p>
              </div>
              <div className="card-action">
                <h6>Switch {this.props.dept} Course</h6> 
                <nav id="class-search" className="">
                  <div className="nav-wrapper">
                    <form>
                      <div className="input-field">
                        <input placeholder="Search" id="search" type="search" autoComplete="off" required maxLength="8"/>
                        <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                        <i className="material-icons">close</i>
                      </div>
                    </form>
                  </div>
                </nav>
              </div>
            </div>
          </div>
          <div className="col s12 m7 l8">
            <div className="card teal lighten-1">
              <div className="card-content white-text">
                <span className="card-title">All <b>{this.props.dept} {this.props.code}</b> Courses</span>
                {this.state.loadingCourses && this.loadingCourses()}
                {this.state.courses && this.displayCourses()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}