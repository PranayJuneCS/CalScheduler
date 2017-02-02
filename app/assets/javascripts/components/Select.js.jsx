class Select extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  componentDidMount() {
    $(".dropdown-button").dropdown({
      hover: false,
      belowOrigin: true,
      gutter: 0
    });
    $('input.autocomplete').autocomplete({
      data: {
        "CS61A": "https://www.python.org/static/opengraph-icon-200x200.png",
        "CS61B": "http://d3gnp09177mxuh.cloudfront.net/tech-page-images/java.png",
        "CS61C": 'https://lh3.googleusercontent.com/3gI9l3yQynt2cj1MFdTZbaYE0VK056s-lvE4iejCCZQ1_-S8v3ZGDCPsIhtQsOB8Kb8i=w300',
        "CS70": "https://lh3.ggpht.com/2ZbR3AYxGipGK-7rv7Zvmz2l1rmaaK8_Ncr9jWE7IdIxfI5lmgfIiFPnC5nZZEsqnRWL=w300",
        "CS161": "https://certification.comptia.org/images/default-source/blog-thumbnails/thinkstockphotos-533535877-(1).png?sfvrsn=0",
        "CS189": "https://image.freepik.com/free-vector/coloured-robot-design_1148-9.jpg"
      },
      limit: 20
    });
  }

  render() {
    return (
      <div className="content container">
        <h4>Select Your Classes</h4>
        <nav id="class-search">
          <div className="nav-wrapper">
            <form>
              <div className="input-field">
                <input id="search" type="search" required />
                <label className="label-icon" htmlFor="search"><i className="material-icons">search</i></label>
                <i className="material-icons">close</i>
              </div>
            </form>
          </div>
        </nav>
        <table className="highlight bordered centered">
          <tbody>
            <tr>
              <td>CS61A</td>
              <td>MWF 2-3</td>
              <td style={{fontWeight: 'bold'}}>Already In Your Schedule!</td>
            </tr>
            <tr>
              <td>CS61B</td>
              <td>TuTh 8-9</td>
              <td>
                <a className="add-specific-class">
                  <i className="fa fa-plus-circle fa-2x"></i>
                </a>
              </td>
            </tr>
            <tr>
              <td>CS61C</td>
              <td>MW 5-6:30</td>
              <td style={{fontWeight: 'bold'}}>Already In Your Schedule!</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}