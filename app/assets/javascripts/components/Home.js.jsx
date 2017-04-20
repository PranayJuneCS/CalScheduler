class Home extends React.Component {

  render() {
    if (this.props.current_user) {
      return (
        <ClassOverview
          user={this.props.current_user}
          courses={this.props.courses}
        />
      );
    } else {
      return (
        <Login />
      );
    }
  }
}
