class SpecificCourse extends React.Component {

  constructor(props) {
    super(props);
    
    this.state = {
      loadingCourses: true,
      courses: false,
      ccns: this.props.ccns,
      checked: {
        LEC: 1,
        DIS: 1,
        LAB: 1,
        SEM: 1,
        REC: 1,
        OTHER: 1
      }

    };

    this.translateDict = {
      LEC: "Lectures",
      DIS: "Discussions",
      LAB: "Labs",
      SEM: "Seminars",
      REC: "Recitation",
      OTHER: "Other"
    };

    this.loadingCourses = this.loadingCourses.bind(this);
    this.loadCourses = this.loadCourses.bind(this);
    this.displayCourses = this.displayCourses.bind(this);
    this.updateCCNs = this.updateCCNs.bind(this);
    this.onFilterChange = this.onFilterChange.bind(this);
    this.courseCircles = this.courseCircles.bind(this);
    this.filterSwitches = this.filterSwitches.bind(this);
    this.otherDeptCodes = this.otherDeptCodes.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });

    $('.tooltipped').tooltip({delay: 10});
    $('#filters-modal').modal();

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
    $.get('/all_courses', { dept: this.props.dept,
                            code: this.props.code,
                            token: this.props.current_user.token
                          })
    .done((data) => {
      if (data.code != "200") {
        if (data.message == "Not Found") {
          Materialize.toast('Oh no! There is no data for this course. Try a different course.', 2500, '', () => {
            this.setState({ loadingCourses: false });
          });
        } else {
          Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {
            this.setState({ loadingCourses: false });
          });
        }
      } else {
        setTimeout(() => {
          this.setState({
            ...data.sections,
            courses: true,
            loadingCourses: false,
            title: ": " + data.title
          });
        }, 500);
      }
    })
    .fail((e) => {
      Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {
          this.setState({ loadingCourses: false });
        });
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
        {["LEC", "DIS", "LAB", "SEM", "REC", "OTHER"].map((component, i) => {
          return (
            <CourseComponent
              component={this.translateDict[component]}
              key={i}
              courses={this.state[component]}
              ccns={this.state.ccns}
              updateCCNs={this.updateCCNs}
              current_user={this.props.current_user}
              visible={this.state.checked[component]}
            />
          );
        })}
      </div>
    );
  }

  onFilterChange(comp) {
    var checkedState = this.state.checked;
    checkedState[comp] = 1 - checkedState[comp];
    this.setState({ checked: checkedState });
  }

  courseCircles(code, i) {
    return (
      <a key={i} href={"/course/" + this.props.dept + "/" + code} id={this.props.short + "-" + code}>
        <div className="code-container col l3 m3 s4 white-text z-depth-1">
          <p>{code}</p>
        </div>
      </a>
    );
  }

  filterSwitches() {
    return (
      <div className="card-content">
        <span className="card-title">Filters</span>
        <div className="container">
            {["LEC", "DIS", "LAB", "SEM", "REC", "OTHER"].map((comp, i) => {
              return (
                <div key={i} className="row">
                  <div className="switch col s12">
                    <label>
                      {comp}
                      <input checked={this.state.checked[comp]} onChange={() => this.onFilterChange(comp)} type="checkbox" />
                      <span className="lever"></span>
                    </label>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    );
  }

  otherDeptCodes() {
    return (
      <div className="card-reveal">
        <span className="card-title grey-text text-darken-4">{this.props.dept} Courses<i className="material-icons right">close</i></span>
        <div className="row all-codes-container">
          {this.props.all_codes.map(this.courseCircles)}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <a href="/course" className=""><i className="material-icons back-course">chevron_left</i></a>
          <h4 className="small-header" style={{flex: 1}}>{this.props.dept} {this.props.code} {this.state.title}</h4>
        </div>
        <div id="filters-modal" className="modal">
          <div className="card zero-margin">
            <i className="modal-action modal-close fa fa-close fa-2x close-modal-x"></i>
            {this.filterSwitches()}
            <div className="card-action">
              <h6 className="activator btn-flat show-codes-button">Switch {this.props.dept} Course</h6>
            </div>
            {this.otherDeptCodes()}
          </div>
        </div>
        <div className="row">
          <div className="col m5 l4 hide-on-small-only">
            <div className="card white fixed">
              {this.filterSwitches()}
              <div className="card-action">
                <h6 className="activator btn-flat show-codes-button">Switch {this.props.dept} Course</h6>
              </div>
              {this.otherDeptCodes()}
            </div>
          </div>
          <div className="col s12 m7 l8">
            <div className="card spec-course-card">
              <div className="card-content white-text">
                {this.state.loadingCourses && this.loadingCourses()}
                {this.state.courses && this.displayCourses()}
              </div>
            </div>
          </div>
        </div>
        <div className="fixed-action-btn hide-on-med-and-up">
          <a href="#filters-modal" className="btn-floating btn btn-large">
            <i className="fa fa-sliders"></i>
          </a>
        </div>
      </div>
    );
  }
}