import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import Select from 'react-select'
import AutoSuggest from '../vocabulary/VocabularySuggest.jsx'
import AceEditor from 'react-ace'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import 'brace/mode/json'
import 'brace/theme/github'
import {updateAPIChange, updateCheckedStatus, updateAPISelection} from '../utils/ChildNodeActions';

export default class extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      childData: {
        apiList: [],
        url: ''
      },
      apiStatus: "GET",
      checkedStatus: false,
      options : [
        { apiType: 'GET', label: 'GET' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'POST', label: 'POST', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PUT', label: 'PUT' , id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'PATCH', label: 'PATCH', id:'', completed: false, request: '', response: '', summary: '' },
        { apiType: 'DELETE', label: 'DELETE', id:'', completed: false, request: '', response: '', summary: '' }
      ],
      apiData: this.props.apiData,
      paramValue: '',
      requestValue: '',
      responseValue: '',
      summaryInfo: '',
      currentNodeId: '',
      defaultValue: JSON.stringify({"200/500":{}}, null, 2)
    };
    this.alertOptions = AlertOptions;
    this.selectAPI = this.selectAPI.bind(this);
  }

  /* Component Mount after render */
  componentDidMount() {
    let scrollViewRef = ReactDOM.findDOMNode(this.refs.childNode)
    scrollViewRef.scrollIntoView();
  }

  /* Component Initialisation */
  componentWillMount() {
    this.props.childInfo.apiList.map(function (type, i) {
      this.state.options.map(function (oType, j) {
        if(type.apiType === oType.apiType) {
          oType.completed = true;
          oType.id = type.apiId;
          oType.request = this.state.apiData[oType.id][oType.apiType].request;
          oType.response = this.state.apiData[oType.id][oType.apiType].responses;
          oType.summary = this.state.apiData[oType.id][oType.apiType].summary;
        }
      }, this)    
    }, this)

    this.setState({
      childData: this.props.childInfo,
      childUpdatedData: this.props.childInfo
    })
  }

  /* Method to associate node details */
  associateNode(validity) {
    this.props.setChildEditDetails(this.state.childData, validity);
  }

  /* Method to select API from dropdown */
  selectAPI(val) {
    updateAPISelection(val, this, event, showAlert)
  }

  /* Method to check/uncheck node association */
  bindAPI(val) {
    updateCheckedStatus(val, this)
  }

  /* Method to check tree data validation */
  validityCheckStatus() {
    if(this.state.childUpdatedData.apiList && this.state.childUpdatedData.url) {
      return true;
    } else {
      return false;
    }
  }

  /* Method to handle URL changes */
  handleURLChange(value, field) {
    this.setState({
      childData: {
        url: value,
        apiList: this.state.childData.apiList
      }
    });
    this.state.childUpdatedData.url = value;
    this.state.childUpdatedData.apiList = this.state.childData.apiList;
    let validity = this.validityCheckStatus()
    this.props.setChildEditDetails(this.state.childUpdatedData, !validity)
  }

  /* Method to update API changes */
  handleAPIChange (field, data) {
    updateAPIChange(field, data, this)
  }

  /* Method to check JSON format */
  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  /* Render Method */
  render() {
    let checkBoxSection, apiPayloadSection, requestLabel;

     this.state.options.map(function (todo, i) {
      if(todo.label === this.state.apiStatus) {
        checkBoxSection = <div key={i}>
          Associate <input type="checkbox" checked={todo.completed} onChange={this.bindAPI.bind(this,todo)}/>
        </div>
        if(todo.completed) {
          if(!this.state.requestValue && todo.request) {
            this.state.requestValue = todo.request;
          }
          if(typeof (this.state.requestValue) === "object") {
            this.state.requestValue = JSON.stringify(this.state.requestValue, null, 2)
          }
          if(!this.state.responseValue && todo.response) {
            this.state.responseValue = todo.response;
          }
          if(typeof (this.state.responseValue) === "object") {
            this.state.responseValue = JSON.stringify(this.state.responseValue, null, 2)
          }
          if(!this.state.summaryInfo && todo.summary) {
            this.state.summaryInfo = todo.summary;
          }        
          if(todo.id) {
            this.state.currentNodeId = todo.id;
          }
          if(this.state.apiStatus === 'GET') {
            requestLabel = <h6 className="col-md-12 param-label">Request Params: </h6>
          } else {
            requestLabel = <h6 className="col-md-12 param-label">Request : Application/JSON</h6>
          }
          apiPayloadSection = <div className="col-md-12 payload-type-section">
            <div className="row">
              <div className="col-md-12"><h6>Summary:</h6></div>
              <div className="col-md-6 summary-section">
                <textarea rows="3" value={this.state.summaryInfo} onChange={(evt) => this.handleAPIChange("summary",evt)}></textarea>
              </div>
              
            </div>           
            {requestLabel}
            <div className="col-md-6 ace-editor-wrapper">
              <AceEditor
                mode="json"
                theme="github"
                height="200px"
                width="100%"
                value={this.state.requestValue}
                onChange={(evt) => this.handleAPIChange("request",evt)}
                name="other-request"
                editorProps={{$blockScrolling: true}}
                setOptions={{
                  tabSize: 2,
                  fontSize: 14,
                  showGutter: true,
                  showPrintMargin: true,
                  maxLines: 30
                }}
              />
            </div>
            <div className="col-sm-12 visible-sm ace-sample-wrapper">
              <span className="info-label">Sample Valid Response Format</span>
              <AceEditor
                mode="json"
                theme="github"
                className="col-md-12"
                height="75px"
                value={this.state.defaultValue}
                name="defaults"
                readOnly = {true}
                editorProps={{$blockScrolling: true}}
                setOptions={{
                  tabSize: 2,
                  fontSize: 14,
                  showGutter: false,
                  showPrintMargin: false,
                  maxLines: 30
                }}
              />
            </div>
            <h6 className="col-md-12 param-label">Response : Application/JSON</h6>
              <div className="col-md-6 ace-editor-wrapper">
                <AceEditor
                  mode="json"
                  theme="github"
                  className="col-md-12"
                  height="300px"
                  width="100%"
                  value={this.state.responseValue}
                  onChange={(evt) => this.handleAPIChange("response",evt)}
                  name="other-response"
                  editorProps={{$blockScrolling: true}}
                  setOptions={{
                    tabSize: 2,
                    fontSize: 14,
                    showGutter: true,
                    showPrintMargin: true,
                    maxLines: 30
                  }}
                />
              </div>
              <div className="col-md-5 hidden-sm ace-sample-wrapper">
                <span className="info-label">Sample Valid Response Format</span>
                <AceEditor
                  mode="json"
                  theme="github"
                  className="col-md-12"
                  height="100px"
                  value={this.state.defaultValue}
                  name="defaults"
                  readOnly = {true}
                  editorProps={{$blockScrolling: true}}
                  setOptions={{
                    tabSize: 2,
                    fontSize: 14,
                    showGutter: false,
                    showPrintMargin: false,
                    maxLines: 30
                  }}
                />
              </div>
          </div>
        }
      }
      
    }, this)
   
    return(
      <div className="col-md-12 child-node-edit-section">
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
        <form className="col-md-12" noValidate>
          <div className="col-md-6 path-section">
            <AutoSuggest queryInput={this.state.childData.url} updateSuggestedDetails={(val, mode)=>this.handleURLChange(val, 'url')}/>
          </div>
          <div className="row col-md-12">
            <div className="col-md-2 col-sm-6">
              <Select
                name="form-field-name"
                ref='childNode'
                value={this.state.apiStatus}
                valueKey='apiType'
                options={this.state.options}
                onChange={(e) => this.selectAPI(e)}
              />
            </div>
            <div className="col-md-2 col-sm-6 associate-section">
              {checkBoxSection}
            </div>
          </div>
          {apiPayloadSection}
        </form>
      </div>
    )
    
  }
}
