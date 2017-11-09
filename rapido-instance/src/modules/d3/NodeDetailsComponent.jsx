import React from 'react'
import { browserHistory } from 'react-router'
import RootDetails from './RootDetailsComponent'
import ChildDetails from './ChildDetailsComponent'

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  /* Method to Update Root data */
  updateRootData(rootData) {
    if(rootData.rootPath && rootData.name) {
      this.props.updatedData({
        rootNodeData: rootData
      },false)
    } else {
      this.props.updatedData({
        rootNodeData: rootData
      },true)
    }
  }

  /* Method to Update Child data */
  updateChildData(childData, jsonStatus) {
    if(childData.url && childData.apiList.length>0 && !jsonStatus) {
      this.props.updatedData({
        childNodeData: childData
      },false)
    } else {
      this.props.updatedData({
        childNodeData: childData
      },true)
    }
    
  }

  /* Render Method */
  render() {
    var list;
    if (this.props.nodeData) {
      if(this.props.nodeData.rootNodeData && this.props.nodeData.rootNodeData.active) {
        list = <RootDetails rootInfo={this.props.nodeData.rootNodeData} setEditDetails={(val)=>this.updateRootData(val)}/>
      } else if (this.props.nodeData.childNodeData && this.props.nodeData.childNodeData.name){
        list = <ChildDetails apiData={this.props.nodeData.apiExportData} childInfo={this.props.nodeData.childNodeData} setChildEditDetails={(val,status)=>this.updateChildData(val,status)}/>
      }
    } 
    return(
      <div className="col-md-12">
        {list}
      </div>
    )
  }
}
