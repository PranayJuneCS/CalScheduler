class Home extends React.Component {
  
  loggedIn() {
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

  render() {
    return (
      <div className="container">
        {this.loggedIn()}
      </div>
    );
  }
}
