class ClassInfo extends React.Component {

  syncedBadge() {
    if (this.props.synced) {
      return (
        <span className="sync-badge new badge blue" data-badge-caption="Synced!"></span>
      );
    } else {
      return (
        <span className="sync-badge new badge red" data-badge-caption="Unsynced!"></span>
      );
    }
  }

  syncButton() {
    if (!this.props.synced) {
      return (
        <a className="sync-button waves-effect waves-light btn">
          <i className="material-icons left">sync</i>
          Sync
        </a>
      );
    } else {
      return (
        <a className="sync-button waves-effect waves-light btn">
          <i className="fa fa-trash left"></i>
          Remove
        </a>
      );
    }
  }

  render() {
    return (
      <li>
        {this.syncedBadge()}
        <div className="collapsible-header">
          <div>
            <span className="course-title">{this.props.code}</span>
            <span className="course-time">{this.props.day} {this.props.time}</span>
          </div>
        </div>
        <div className="collapsible-body">
          <div className="container class-container">
            <h5>{this.props.title}</h5>
            <div className="divider"></div>
            <div className="row">
              <div className="col s6">
                <h6>Discussion Section</h6>
                <span>Th 3-4</span>
              </div>
              <div className="col s6">
                {this.syncButton()}
              </div>
            </div>
          </div>
        </div>
      </li>
    );
  }
}