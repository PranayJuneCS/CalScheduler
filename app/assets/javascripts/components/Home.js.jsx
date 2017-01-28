class Home extends React.Component {
  
  loggedIn() {
    if (this.props.current_user) {
      return (
        <div className="content container">
          <h4>Signed in as {this.props.current_user.name}.</h4>
          <div className="row">
            <div className="col s10">
              <div className="row">
                <div className="input-field col s12">
                  <input type="text" id="autocomplete-input" className="autocomplete" />
                  <label htmlFor="autocomplete-input">Select Your Classes</label>
                </div>
              </div>
            </div>
            <div className="col s2">
              <a className="send-button btn-floating waves-effect waves-light"><i className="material-icons">send</i></a>
            </div>
          </div>
          <a href="/signout" className="waves-effect waves-light btn">
            <i className="fa fa-sign-out left"></i>
            Sign Out
          </a>
        </div>
      );
    } else {
      return (
        <Login />
      );
    }
  }

  render() {
    return (
      <div className="container">
        {this.loggedIn()}
      </div>
    );
  }
}
