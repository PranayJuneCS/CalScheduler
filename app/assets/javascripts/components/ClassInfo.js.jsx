class ClassInfo extends React.Component {
  render() {
    return (
      <li>
        <div className="collapsible-header">
          <div>
            <span className="course-title">{this.props.code}</span>
            <span className="course-time">{this.props.day} {this.props.time}</span>
          </div>
        </div>
        <div className="collapsible-body">
          <span>{this.props.title}</span>
        </div>
      </li>
    );
  }
}