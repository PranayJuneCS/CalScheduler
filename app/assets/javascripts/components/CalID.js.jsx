class CalID extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sid: '',
      submitting: false
    }

    this.submitForm = this.submitForm.bind(this);
    
  }
  
  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $(".calendar-icon").addClass("hide");
  }

  componentWillUnmount() {
    $(".calendar-icon").removeClass("hide");
  }

  submitForm() {
    this.setState({ submitting: true });
  }

  render() {
    return (
      <div className="content container">
        <div className="col s12">
          <div className="card">
            <div className="card-content">
              <span className="card-title">Enter Your Cal SID</span>
              <p>With your Cal Student ID Number, you can import your class schedule directly
                from CalCentral!
              </p>
              <div className="row">
                <div className="input-field col s12 m8 push-m2">
                  <input
                    id="sid"
                    disabled={this.state.submitting ? true : false}
                    className=""
                    placeholder="Student ID"
                    onChange={() => this.setState({sid: $("#sid").val().trim()})}/>
                </div>
              </div>
              {!this.state.submitting && 
                <a onClick={this.submitForm} className="waves-effect waves-light btn">Submit!</a>
              }
              {this.state.submitting &&
                <div className="container">
                  <p>Validating...</p>
                  <div className="progress">
                    <div className="indeterminate"></div>
                  </div>
                </div>
              }
              
            </div>
          </div>
        </div>
        <a href="/" className="alt-search waves-effect waves-teal btn-flat">Proceed Without SID</a>
      </div>
    );
  }

}