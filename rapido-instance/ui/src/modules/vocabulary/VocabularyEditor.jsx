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
    let vocabData;
    var sessionData = sessionStorage.getItem('vocabularyInfo');
    if(sessionData) {
      vocabData = JSON.parse(sessionData)
    } else {
      vocabData = []
    }

    this.state = {
      searchColumn: 'all',
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
      vocabularyData: vocabData
    };

    this.onRow = this.onRow.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.onRemove = this.onRemove.bind(this);
    this.addVocabulary = this.addVocabulary.bind(this);
  }

  /* Component Initialisation */
  componentDidMount() {
    let sketchId = sessionStorage.getItem('sketchId');
    let prjSrvGetPrjDet = null;
    ProjectService.getProjectDetails(sketchId)
    .then((response) => {
      prjSrvGetPrjDet = response.clone();
      return response.json();
    })
    .then((responseData) => {
      if(prjSrvGetPrjDet.ok) {
        this.setState({
          projectDetailsData: responseData
        });
      } else {
        showAlert(this, (responseData.message) ? responseData.message : "Error occured");
        if(prjSrvGetPrjDet.status == 401) {
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

    // this could go through flux etc.
    vocabularyData.splice(idx, 1);
    this.setState({ vocabularyData });
    sessionStorage.setItem('vocabularyInfo',JSON.stringify(vocabularyData));
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
    var pushObj = {name: this.state.query.all}
    this.state.vocabularyData.push(pushObj)
    sessionStorage.setItem('vocabularyInfo',JSON.stringify(this.state.vocabularyData))
    this.setState({
      query: {},
      vocabularyData: this.state.vocabularyData
    })
    e.preventDefault();
  }

  /* Render method */
  render() {
    let addOption, loadedComponent;

    if(this.state && this.state.projectDetailsData) {

      const { searchColumn, columns, vocabularyData, query } = this.state;
      const resolvedColumns = resolve.columnChildren({ columns });

      /* Project Details Section */
      var projectHeader = (this.state.projectDetailsData) ? <div>
        <h2>{this.state.projectDetailsData["name"]}</h2>
        <h3>{this.state.projectDetailsData["description"]}</h3>
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
