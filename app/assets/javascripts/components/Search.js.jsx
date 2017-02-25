class Search extends React.Component {
  
  constructor(props) {
    super(props);

    this.searchOptions = {
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
      searchFor: 'department',
      activeDepartments: this.props.departments
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.showDepartments = this.showDepartments.bind(this);
    this.createTableEntry = this.createTableEntry.bind(this);
    this.searchClick = this.searchClick.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.clearField = this.clearField.bind(this);
    this.proceedToClasses = this.proceedToClasses.bind(this);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });

    this.fuse = new Fuse(this.props.departments, this.searchOptions);
  }

  handleSearch() {
    var searchVal = $("#search").val().trim();
    if (searchVal.length == 0) {
      this.setState({ activeDepartments: this.props.departments });
    } else {
      var result = this.fuse.search(searchVal);
      this.setState({ activeDepartments: result });
    }
  }

  createTableEntry(course, i) {
    return (
      <DepartmentEntry
        key={i}
        {...course}
        proceedToClasses={this.proceedToClasses}
      />
    );
  }

  proceedToClasses(courses) {
    console.log(courses);
  }

  showDepartments() {
    if (this.state.activeDepartments.length == 0) {
      return (
        <tr><td><h3>No Results!</h3></td></tr>
      );
    }
    return this.state.activeDepartments.map(this.createTableEntry);
  }

  searchClick() {
    $('#search').focus();
  }

  clearField() {
    $('#search').val('');
    this.handleSearch();
  }

  submitForm(e) {
    e.preventDefault();
    $('#search').blur();
  }

  render() {
    return (
      <div className="content container">
        <div className="header-container">
          <a data-position="right" data-delay="1000" data-tooltip="My Schedule" className="btn-floating btn waves-effect waves-light right tooltipped">
            <i className="material-icons">arrow_back</i>
          </a>
          <h4 style={{flex: 1}}>Search For Classes</h4>
          <a className="btn-floating btn waves-effect waves-light right">
            <i className="material-icons">search</i>
          </a>
        </div>
        <nav id="class-search">
          <div className="nav-wrapper">
            <form onSubmit={this.submitForm}>
              <div className="input-field">
                <input placeholder="Search for a Department" id="search" type="search" onChange={this.handleSearch} autoComplete="off" required />
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
  }
}