class SpecificCourse extends React.Component {

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
        {this.props.dept} {this.props.code}
      </div>
    );
  }
}