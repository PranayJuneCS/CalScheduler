class DepartmentEntry extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.onPress = this.onPress.bind(this); 
  }

  onPress() {
    console.log(this.props);
    $.get("/classes_from_dept", {short: this.props.short, long: this.props.long})
      .done( (data) => {
        this.props.proceedToClasses(data);
      }).fail( function(e) {
        console.log("SHIZ");
      });
  }

  render() {
    return (
      <tr onClick={this.onPress} className="hoverable dept-entry">
        <td><b>{this.props.short}</b>: {this.props.long}</td>
      </tr>
    );
  }
}