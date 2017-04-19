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
        IND: 1,
        SEM: 1,
        GRP: 1,
        OTH: 1
      }

    };

    this.codesDir = {};
    var i;
    for (i = 0; i < this.props.all_codes.length; i++) {
      this.codesDir[this.props.all_codes[i]] = null;
    }

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
    this.onFilterChange = this.onFilterChange.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.switchCourse = this.switchCourse.bind(this);
    this.clearField = this.clearField.bind(this);
    this.courseCircles = this.courseCircles.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $("#my-schedule").modal();

    $('input.autocomplete').autocomplete({
      data: this.codesDir,
      limit: 5
    });

    $('.modal').modal();

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
        this.setState({ loadingCourses: false });
        console.log("SHIZ");
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

  switchCourse(e) {
    e.preventDefault();
    var searchVal = $("#search").val().trim().toUpperCase();
    if (this.props.all_codes.indexOf(searchVal) >= 0) {
      window.location.pathname = "/course/" + this.props.dept + "/" + searchVal;
    }
    return;
  }

  courseCircles(code, i) {
    return (
      <a key={i} href={"/course/" + this.props.dept + "/" + code} id={this.props.short + "-" + code}>
        <div className="code-container col l3 m3 s4 teal lighten-2 white-text z-depth-1">
          <p>{code}</p>
        </div>
      </a>
    );
  }

  submitForm(e) {
    e.preventDefault();
    $("#search").blur();
  }

  clearField() {
    $('#search').val('');
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <h4 style={{flex: 1}}>{this.props.dept} {this.props.code} {this.state.title}</h4>
        </div>
        <div className="fixed-action-btn hide-on-med-and-up">
          <a href="#filters-modal" className="btn-floating btn-large teal darken-4">
            <i className="fa fa-bars"></i>
          </a>
        </div>
        <div id="filters-modal" className="modal">
          <div className="modal-content">
            <h5>Filters</h5>
            <i className="modal-action modal-close fa fa-close fa-2x close-modal-x"></i>
            <div className="container">
              {["LEC", "DIS", "LAB", "SEM", "IND", "GRP", "OTH"].map((comp, i) => {
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
            <h6>Switch {this.props.dept} Course</h6>
            <nav id="class-search" className="">
              <div className="nav-wrapper">
                <form onSubmit={this.switchCourse}>
                  <div className="input-field">
                    <input placeholder="Search" className="autocomplete" id="search" type="search" autoComplete="off" required maxLength="8"/>
                    <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                    <i onClick={this.switchCourse} className="material-icons">send</i>
                  </div>
                </form>
              </div>
            </nav>
          </div>
        </div>
        <div className="row">
          <div className="col m5 l4 hide-on-small-only">
            <div className="card white fixed">
              <div className="card-content">
                <span className="card-title">Filters</span>
                <div className="container">
                    {["LEC", "DIS", "LAB", "SEM", "IND", "GRP", "OTH"].map((comp, i) => {
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
              <div className="card-action">
                <h6 className="activator btn-flat show-codes-button">Switch {this.props.dept} Course</h6>
              </div>
              <div className="card-reveal">
                <span className="card-title grey-text text-darken-4">{this.props.dept} Courses<i className="material-icons right">close</i></span>
                <div className="row all-codes-container">
                  {this.props.all_codes.map(this.courseCircles)}
                </div>
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