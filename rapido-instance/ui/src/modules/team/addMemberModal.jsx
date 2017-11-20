import React from 'react';

class Modal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  /* Method to handle search members*/
  handleChange(event) {
    console.log(event);
  }

  /* Render Method */
  render() {
    // Render nothing if the "show" prop is false
    if(!this.props.show) {
      return null;
    }
    
    // The gray background
    const backdropStyle = {
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50,
      height: '100%',
      zIndex: 1000
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      height: 200,
      zIndex: 1000,
      margin: '30 auto',
      padding: 20,
      display: 'block'
    };

    return (
      <div style={backdropStyle}>
        <div className="modal col-md-12" style={modalStyle}>
          <h4 className="text-center">
            Add Member
          </h4>
          <input placeholder="Search Members" type="text" value={this.state.query} onChange={this.handleChange} />
          <div className="form-group pull-right">
            <button className="btn btn-default cancel-button" onClick={this.props.onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

Modal.propTypes = {
  onClose: React.PropTypes.func.isRequired,
  show: React.PropTypes.bool,
  children: React.PropTypes.node
};

export default Modal;