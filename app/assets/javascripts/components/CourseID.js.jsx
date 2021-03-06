class CourseID extends React.Component {
  
  constructor(props) {
    super(props);

    this.state = {
      activeDepartments: this.props.departments
    };

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
    
    this.showDepartments = this.showDepartments.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.clearField = this.clearField.bind(this);
    this.handleDeptSearch = this.handleDeptSearch.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.createDeptEntry = this.createDeptEntry.bind(this);
    this.blurred = this.blurred.bind(this);
    this.focused = this.focused.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });

    this.deptFuse = new Fuse(this.props.departments, this.deptSearchOptions);
  }

  showDepartments() {
    if (this.state.activeDepartments.length == 0) {
      return (
        <tr><td><h3>No Results!</h3></td></tr>
      );
    }
    return this.state.activeDepartments.map(this.createDeptEntry);
  }

  createDeptEntry(course, i) {
    return (
      <DepartmentEntry
        key={i}
        {...course}
        current_user={this.props.current_user}
      />
    );
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

  searchClick() {
    $('#search').focus();
  }

  clearField() {
    $('#search').val('');
    this.handleDeptSearch();
    
  }

  submitForm(e) {
    e.preventDefault();
    $('#search').blur();
  }

  blurred(e) {
    $(".alt-ccn-search").removeClass('hide');
  }

  focused(e) {
    $(".alt-ccn-search").addClass('hide');
  }

  render() {
    return (
      <div className="container content">
        <div className="search-container">
          <h4 className="smaller-header">Add a Course</h4>
          <div className="hide-on-small-only">
            <a href="/ccn" className="btn btn-flat">Search by CCN</a>
          </div>
        </div>
        <nav className="" id="class-search">
          <div className="nav-wrapper">
            <form onSubmit={this.submitForm}>
              <div className="input-field">
                <input onBlur={this.blurred} onFocus={this.focused} placeholder="Search for a Department" id="search" type="search" onChange={this.handleDeptSearch} autoComplete="off" required />
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
        <a href="/ccn" className="alt-ccn-search black-text hide-on-med-and-up waves-effect waves-light btn">CCN Search</a>
      </div>
    );
  }
}