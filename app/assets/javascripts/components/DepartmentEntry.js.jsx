class DepartmentEntry extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      codesState: "down",
      codes: null
    };
    
    this.onPress = this.onPress.bind(this); 
    this.toggleCodesInfo = this.toggleCodesInfo.bind(this);
    this.courseCircles = this.courseCircles.bind(this);
    this.codePressed = this.codePressed.bind(this);
  }

  toggleCodesInfo() {
    $("#" + this.props.short + "-codes").slideToggle("slow");
    if (this.state.codesState == "up") {
      this.setState({ codesState: "down" });
    } else {
      this.setState({ codesState: "up" });
    }
  }

  codePressed(e) {
    e.preventDefault();
    console.log(this.props.short);
  }

  courseCircles(code, i) {
    return (
      <a key={i} onClick={this.codePressed}>
        <div className="code-container col l2 m3 s4 teal lighten-2 white-text z-depth-1">
          <p>{code}</p>
        </div>
      </a>
    );
  }

  onPress() {
    if (!this.state.codes) {
      $.get('/codes_from_dept', {short: this.props.short})
      .done((data) => {
        if (data.code == "200") {
          this.setState({ codes: data.codes });
          this.toggleCodesInfo();
        } else {
          console.log(data.message);
        }
      })
      .fail((e) => {
        console.log("SHIZ");
      })
    } else {
      this.toggleCodesInfo();
    }
    
  }

  render() {
    return (
      <tr className="hoverable dept-entry">
        <td>
          <div>
            <h6 className="one-line-height"><b>{this.props.short}</b>: {this.props.long}</h6>
            <div id={this.props.short + "-codes"} className="dept-codes">
              <div className="container">
                <h5>Select a Specific {this.props.short} Course</h5>
                <div className="row">
                  {this.state.codes && this.state.codes.map(this.courseCircles)}
                </div>
              </div>
            </div>
            <div onClick={this.onPress} className="more-info">
              <i className={"fa fa-chevron-" + this.state.codesState + " fa-lg"}></i>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}