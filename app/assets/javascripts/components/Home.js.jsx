class Home extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <h4>Import Your Class Schedule To Your Google Calendar.</h4>
        </div>
        <div className="container">
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
        </div>
      </div>
    );
  }
}
