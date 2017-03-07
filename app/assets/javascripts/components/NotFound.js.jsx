class NotFound extends React.Component {
  
  render() {
    return (
      <div className="content container">
        <h2>Oh No!</h2>
        <h4>{"This page does not exist. "} 
          <i className="fa fa-frown-o"></i>
        </h4>
        <a href="/" className="waves-effect waves-light btn">
          <i className="fa fa-home left"></i>
          Home
        </a>
      </div>
    );
  }

}
