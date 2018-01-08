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
  }

  toggleCodesInfo() {
    $("#" + this.props.short + "-codes").slideToggle("slow");
    if (this.state.codesState == "up") {
      this.setState({ codesState: "down" });
      $(".alt-ccn-search").removeClass("hide");
    } else {
      this.setState({ codesState: "up" });
      $(".alt-ccn-search").addClass("hide");
    }
  }

  courseCircles(code, i) {
    return (
      <a key={i} href={"/course/" + this.props.short + "/" + code} id={this.props.short + "-" + code}>
        <div className="code-container col l2 m3 s4 white-text z-depth-1">
          <p>{code}</p>
        </div>
      </a>
    );
  }

  onPress() {
    if (!this.state.codes) {
      $.get('/codes_from_dept', {short: this.props.short, token: this.props.current_user.token})
      .done((data) => {
        if (data.code == "200") {
          this.setState({ codes: data.codes });
          this.toggleCodesInfo();
        } else {
          Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {});
        }
      })
      .fail((e) => {
        Materialize.toast('Oh no! An error has occurred (possibly with your connnection!). Please try again.', 2500, '', () => {});
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