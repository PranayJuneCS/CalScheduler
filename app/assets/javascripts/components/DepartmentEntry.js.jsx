class DepartmentEntry extends React.Component {
  
  constructor(props) {
    super(props);
    
    this.onPress = this.onPress.bind(this); 
  }

  onPress() {
    this.props.selectDepartment({short: this.props.short, long: this.props.long});
  }

  render() {
    return (
      <tr onClick={this.onPress} className="hoverable dept-entry">
        <td><b>{this.props.short}</b>: {this.props.long}</td>
      </tr>
    );
  }
}