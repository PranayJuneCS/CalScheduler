class ClassesTableEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addingClass: false
    }
    this.addClass = this.addClass.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }

  addClass(e) {
    this.setState({ addingClass: true });
    var classDict = {
      code: this.props.code,
      title: this.props.title,
      day: this.props.day,
      time: this.props.time
    };
    $.post("/add_class", classDict)
      .done( (data) => {
        Materialize.toast(classDict.code + ' has been added to your schedule!', 2000, '', () => {
          this.setState({ addingClass: false });
          this.props.refreshCodes(classDict.code);
        });
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  renderStatus() {
    if (this.props.inSchedule) {
      return (
        <td>
          <i className="fa fa-check fa-2x hide-on-med-and-up"></i>
          <div className="hide-on-small-only" style={{fontWeight: 'bold'}}>Already In Your Schedule!</div>
        </td>
      );
    } else {
      if (this.state.addingClass) {
        return (
          <td>
            <i className="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
          </td>
        );
      } else {
        return (
          <td>
            <a className="add-specific-class" onClick={this.addClass}>
              <i className="fa fa-plus-circle fa-2x"></i>
            </a>
          </td>
        );
      }
    }
  }

  render() {
    return (
      <tr>
        <td>{this.props.code}</td>
        <td className="hide">{this.props.title}</td>
        <td>{this.props.day} {this.props.time}</td>
        {this.renderStatus()}
      </tr>
    );
  }
}