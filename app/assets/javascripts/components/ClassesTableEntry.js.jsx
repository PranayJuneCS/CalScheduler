class ClassesTableEntry extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      addedClass: false
    }
    this.addClass = this.addClass.bind(this);
    this.renderStatus = this.renderStatus.bind(this);
  }

  addClass(e) {
    this.setState({ addedClass: "loading" });
    var classDict = {
      code: this.props.code,
      title: this.props.title,
      day: this.props.day,
      time: this.props.time
    };
    $.post("/add_class", classDict)
      .done( (data) => {
        Materialize.toast(classDict.code + ' has been added to your schedule!', 2000, '', () => {
          this.setState({ addedClass: true })
        });
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  renderStatus() {
    if (this.props.inSchedule) {
      return (
        <td style={{fontWeight: 'bold'}}>Already In Your Schedule!</td>
      );
    } else {
      if (this.state.addedClass) {
        if (this.state.addedClass === "loading") {
          return (
            <td>
              <div className="preloader-wrapper small active">
                <div className="spinner-layer spinner-green-only">
                  <div className="circle-clipper left">
                    <div className="circle"></div>
                  </div><div className="gap-patch">
                    <div className="circle"></div>
                  </div><div className="circle-clipper right">
                    <div className="circle"></div>
                  </div>
                </div>
              </div>
            </td>
          );
        } else {
          return (
            <td>
              <i className="fa fa-check-circle fa-2x"></i>
            </td>
          );
        }
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