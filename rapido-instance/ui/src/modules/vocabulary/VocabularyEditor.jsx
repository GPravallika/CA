import React from 'react'
import * as Table from 'reactabular-table';
import * as search from 'searchtabular';
import * as resolve from 'table-resolver';
import { browserHistory, Link } from 'react-router'
import { cloneDeep, findIndex, orderBy } from 'lodash';
import ProjectDetails from '../d3/ProjectDetailsComponent'
import ProjectService from '../d3/ProjectServices'
import { loadProjectDetails } from '../utils/TreeActions';


export default class extends React.Component{
  
  constructor() {
    super();
    this.state = {
      searchColumn: 'all',
      selectedSketch: {},
      query: {},
      columns: [
        {
          property: 'name',
          header: {
            label: 'Vocabulary List'
          }
        },
        {
          props: {
            style: {
              width: 50
            }
          },
          cell: {
            formatters: [
              (value, { rowData }) => (
                <span
                  className="remove fa fa-times"
                  onClick={() => this.onRemove(rowData.name)} style={{ cursor: 'pointer' }}
                >
                  
                </span>
              )
            ]
          },
          visible: true
        }
      ],
      vocabularyData: []
    };

    this.onRow = this.onRow.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.addVocabulary = this.addVocabulary.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {
    this.setState({
        selectedSketch: JSON.parse(sessionStorage.getItem('selectedSketch'))
    });
    let prjSrvGetPrjDetRes = null;
    ProjectService.getProjectDetails(sessionStorage.getItem('sketchId'))
    .then((response) => {
      prjSrvGetPrjDetRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDetRes.ok) {
        let tempVocabData = [];
        responseData.vocabulary.map(function (vocab) {
          tempVocabData.push({"name":vocab});
        }, this);
        this.setState({
          vocabularyData: tempVocabData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDetRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Method to remove vocabulary */
  onRemove(name) {
    const vocabularyData = cloneDeep(this.state.vocabularyData);
    const idx = findIndex(vocabularyData, { name });
    let prjSrvDelVocabRes = null;
    ProjectService.deleteVocabularyFromProject(name, this.state.selectedSketch["projectid"])
    .then((response) => {
      prjSrvDelVocabRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvDelVocabRes.ok) {
        vocabularyData.splice(idx, 1);
        this.setState({ vocabularyData });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvDelVocabRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  onRow(row, { rowIndex, rowKey }) {
    return {
      className: rowIndex % 2 ? 'list-odd-row' : 'list-even-row'
    };
  }

  /* Method to search vocabulary */
  onSearch(query) {
    this.setState({
      query: query
    });
  }

  /* Method to add vocabulary */
  addVocabulary (e) {
    e.preventDefault();
    let prjSrvAddVocabRes = null;
    let vocabArray = [];
    vocabArray.push(this.state.query.all);
    ProjectService.addVocabularyToProject(vocabArray, this.state.selectedSketch["projectid"])
    .then((response) => {
      prjSrvAddVocabRes = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvAddVocabRes.ok) {
        let tempVocabArr = this.state.vocabularyData;
        tempVocabArr.push({"name":this.state.query.all});
        this.setState({
          query: {},
          vocabularyData: tempVocabArr
        })
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvAddVocabRes.status == 401) {
          sessionStorage.removeItem('user')
          sessionStorage.removeItem('token')
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  }

  /* Render method */
  render() {
    let addOption, loadedComponent;

    if(this.state && this.state.selectedSketch) {

      const { searchColumn, columns, vocabularyData, query } = this.state;
      const resolvedColumns = resolve.columnChildren({ columns });

      /* Project Details Section */
      var projectHeader = (this.state.selectedSketch) ? <div>
        <h2>{this.state.selectedSketch["name"]}</h2>
        <h3>{this.state.selectedSketch["description"]}</h3>
        </div> : null;

      
      const resolvedRows = resolve.resolve({
        columns: resolvedColumns,
        method: resolve.nested
      })(vocabularyData);
      const searchedRows = 
        search.multipleColumns({
          columns: resolvedColumns,
          query
        })(resolvedRows);
      
      var vocabTable,tableList;
      if(searchedRows.length>0) {
        tableList = <Table.Body
          ref={body => {
            this.bodyRef = body && body.getRef();
          }}
          rows={searchedRows}
          rowKey="name"
          onRow={this.onRow}
        />
      } else{
        tableList = <tbody><tr><td>No Results Found</td><td></td></tr></tbody>
      }
      vocabTable =  
        <div>
          <div className="project-list-wrapper">
            <div className="col-md-12 col-sm-12">
              <Table.Provider columns={resolvedColumns} className="col-md-12 col-sm-12">
                <Table.Header
                  headerRows={resolve.headerRows({ columns })} >
                </Table.Header>
                {tableList}
              </Table.Provider>
            </div>  
          </div>
        </div>

      if(query.all) {
        addOption = <input className="btn btn-default" value="Add" type="submit" onClick={(e) => this.addVocabulary(e)}/>
      } else {
        addOption = <input className="btn btn-default disabled" value="Add" type="button" />
      }

      loadedComponent = <div className="vocabulary-wrapper">
        <form className="col-md-12" noValidate>
          <div className="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
            <div className="col-md-10 col-sm-10">
              <search.Field
                className="search-sketch"
                column={searchColumn}
                placeholder="vocabulary"
                query={query}
                columns={resolvedColumns}
                rows={resolvedRows}
                components={{
                  props: {
                    filter: {
                      placeholder: 'Add/Search Vocabularies'
                    }
                  }
                }}
                onColumnChange={searchColumn => this.setState({ searchColumn })}
                onChange={query => this.setState({ query })} />
            </div>
            <div className="col-md-2 col-sm-2">
              {addOption}
            </div>
          </div>
          <div className="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1 vocabulary-list">
            {vocabTable}
          </div>
        </form>
      </div>
    } else {
      loadedComponent =  <div className="text-center loading-project-details">Loading...</div>
    }
     
    return (
      <div>
        <div className="titleContainer sketchPage">
          {projectHeader}
        </div>
        <div className="tabsContainer">
          <ul className="tabs">
            <li className={this.props.location.pathname === '/vocabulary' ? 'tab active-tab': 'tab'}><Link to="/vocabulary">VOCABULARY</Link></li>
            <li className={this.props.location.pathname === '/nodes/edit' ? 'tab active-tab': 'tab'}><Link to="/nodes/edit">SKETCH</Link></li>
            <li className={this.props.location.pathname === '/export' ? 'tab active-tab': 'tab'}><Link to="/export">EXPORT</Link></li>
          </ul>
        </div>
        <div className="col-md-12 sketch-list-wrapper">
          {loadedComponent}
        </div>
      </div>
    );
  }
}
