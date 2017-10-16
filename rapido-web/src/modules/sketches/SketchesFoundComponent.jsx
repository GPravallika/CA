import React from 'react';
import { browserHistory } from 'react-router';
import DeleteModal from '../d3/DeleteModal';
import SketchService from './SketchServices'

export default class extends React.Component{
  
  constructor(props) {
    super(props);
    this.state = {
      filteredData: this.props.sketches,
      sketches: this.props.sketches,
      isOpen: false,
      sortType: '',
      query: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.sortSketchCardBy = this.sortSketchCardBy.bind(this);
  }

  /* Method to handle search */
  handleChange(event) {
    if(event.target.value.length > 0) {
      let userDetails = JSON.parse(sessionStorage.getItem('user'));
      let sktSrvSerSktPrjRes = null;
      SketchService.searchSketchProject(event.target.value)
      .then((response) => {
        sktSrvSerSktPrjRes = response.clone();
        return response.json();
      })
      .then((responseData) => {
        if(sktSrvSerSktPrjRes.ok) {
          this.setState({
            query: event.target.value,
            filteredData: responseData
          })
        } else {
          showAlert(this, (responseData.message) ? responseData.message : "Error occured");
          if(sktSrvSerSktPrjRes.status == 401) {
            sessionStorage.removeItem('user')
            sessionStorage.removeItem('token')
          }
        }
      })
      .catch((error) => {
        console.error(error);
      });
    }
  }

  /* Method to handle search */
  sortSketchCardBy(event) {
  
    let lastActiveId = null;
    if(document.querySelector(".sortByBtn.active")) {
      lastActiveId = document.querySelector(".sortByBtn.active").id;
      document.querySelector(".sortByBtn.active").className = document.querySelector(".sortByBtn.active").className.replace(/\bactive\b/,'');
    }
    if(lastActiveId !== event.target.id)
      event.target.className = event.target.className + " active";

    let activeNow = null;
    let activeSort = null;
    if(document.querySelector(".sortByBtn.active"))
      activeNow = document.querySelector(".sortByBtn.active").id;

    var queryResult=[];

    if(activeNow == "sortByNameBtn") {
      activeSort = 'name';
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByModifiedBtn") {
      activeSort = 'modified';
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.modifiedat < b.modifiedat) return -1;
        if(a.modifiedat > b.modifiedat) return 1;
        return 0;
      });
    }

    if(activeNow == "sortByCreatedBtn") {
      activeSort = 'created';
      queryResult = this.props.sketches.sort(function(a, b){
        if(a.createdat < b.createdat) return -1;
        if(a.createdat > b.createdat) return 1;
        return 0;
      });
    }

    this.setState({
      sortType: (activeSort !== null) ? activeSort : '',
      filteredData: (activeSort !== null) ? queryResult : this.state.sketches
    })
  }

  /* Method to handle sketch click */
  navigateToDetails(row) {
    sessionStorage.setItem('sketchId',row.row.id);
    sessionStorage.setItem('sketchName',row.row.name);
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/vocabulary');
  }

  /* Method to add new sketch */
  addNewSketch() {
    sessionStorage.setItem('sketchId','null');
    sessionStorage.setItem('sketchName','null');
    sessionStorage.removeItem('vocabularyInfo');
    browserHistory.push('/nodes/add');
  }

  /* Method to toggle modal */
  toggleModal(row) {
    this.setState({
      isOpen: !this.state.isOpen,
      projectId: (row.row) ? row.row.id : null
    });
  }

  /* Method to delete sketch */
  deleteSketch() {
    let sktSrvDelPrjRes = null;
    SketchService.deleteProject(this.state.projectId)
    .then((response) => {
      sktSrvDelPrjRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(sktSrvDelPrjRes.ok) {
        this.toggleModal({});
        browserHistory.push('/sketches');
        window.location.reload();
       /* TODO remove from state */
      } else {
        this.toggleModal({});
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(sktSrvDelPrjRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Render Method */
  render() {

    const { filteredData } = this.state;

    const sketchItems = filteredData.map(function (row) {
      return (
        <div className="sketch-card" key={row.id}>
          <div className="header">
            <span className="name">{row.name}</span>
          </div>
          <div className="body">
            <div className="description">
              {row.description}
            </div>
            <span className="time">{row.createdAt}</span>
            <span className="time">{row.modifiedAt}</span>
          </div>
          <div className="sketch-hover-card">
            <button className="btn btn-default del-btn" onClick={this.toggleModal.bind(this,{row})}>Delete</button>
            <button className="btn btn-default det-btn" onClick={this.navigateToDetails.bind(this,{row})}>Details</button>
          </div>
        </div>
      );
    }, this);

    return(
      <div className="col-md-12 sketch-list-wrapper">
        <button onClick={this.addNewSketch.bind(this)} className="rapido-button new-sketch-label">+ Create Project</button>
        <div className="col-md-12 sketch-sort-section">
          <input className="search-sketch-input" placeholder="Search" type="text" value={this.state.query} onChange={this.handleChange} />
          <button id="sortByCreatedBtn" className={(this.state.sortType == 'created') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Created</button>
          <button id="sortByModifiedBtn" className={(this.state.sortType == 'modified') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Modified</button>
          <button id="sortByNameBtn" className={(this.state.sortType == 'name') ? "sortByBtn active" : "sortByBtn"} onClick={this.sortSketchCardBy}>Name</button>
        </div>
        {sketchItems}
        <DeleteModal show={this.state.isOpen}
          onClose={this.toggleModal.bind(this)}
          onConfirm={this.deleteSketch.bind(this)}>
        </DeleteModal>
      </div>
    )
  }
}
