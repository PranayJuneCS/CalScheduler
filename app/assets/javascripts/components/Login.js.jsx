class Login extends React.Component {
  render() {
    return (
      <div className="content">
        <h4>Transfer Your Class Schedule To Your Google Calendar.</h4>
        <a href="/auth/google_oauth2" className="waves-effect waves-light btn nav-color">
          <i className="fa fa-google left"></i>
          Login With Google
        </a>
      </div>
    );
  }
}