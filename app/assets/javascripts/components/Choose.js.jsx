class Choose extends React.Component {
  
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
  }

  render() {
    return (
      <div className="content container">
        <h4>Add a Course</h4>
        <div className="row search-choice-container">
          <div className="col s12 m6">
            <a href="/ccn">
              <div className="choice z-depth-1">
                <i className="fa fa-id-badge fa-5x"></i>
                <h5>Search by CCN (Course ID)</h5>
              </div>
            </a>
          </div>
          <div className="col s12 divider or hide-on-med-and-up">
          </div>
          <div className="col s12 m6">
            <div className="choice z-depth-1">
              <i className="fa fa-info-circle fa-5x"></i>
              <h5>Search by Course Info</h5>
            </div>
          </div>
        </div>
      </div>
    );
  }
}