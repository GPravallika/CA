import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions';
import   Dropdown  from 'mineral-ui/Dropdown';
import  Button from 'mineral-ui/Button';
import { ThemeProvider } from 'mineral-ui/themes';
import Select from 'react-select';

export  class SketchesSortComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.alertOptions = AlertOptions;
      }


      render() {
        const options = [
          { label: 'Chocolate', value: 'chocolate' },
          { label: 'Vanilla', value: 'vanilla' },
          { label: 'Strawberry', value: 'strawberry' },
          { label: 'Caramel', value: 'caramel' },
          { label: 'Cookies and Cream', value: 'cookiescream' },
          { label: 'Peppermint', value: 'peppermint' },
        ];
        return (
            <div>
              <div className="col-md-2">
                 <label className="view-text">View&nbsp;&nbsp;:&nbsp;&nbsp;</label> 
                <select
                 name="form-field-name"
                 className="custom-select"> 
      <option className="custom-select-option">All</option>
      <option className="custom-select-option">Personal</option>
      <option className="custom-select-option">Shared</option>
      </select>
      </div> 
      <div className="col-md-6">
      <label className="view-text">Filter&nbsp;&nbsp;:&nbsp;&nbsp;</label> 

      {/* <Select
					multi		
					options={options}
					
      /> */}
                <select
                 name="form-field-name"
                 className="custom-select"> 
      <option className="custom-select-option">All</option>
      <option className="custom-select-option">Personal</option>
      <option className="custom-select-option">Shared</option>
      </select> 
      <span className="anchor-tag"><a>&nbsp;&nbsp;Clear</a></span>
      </div> 

      <div className="col-md-4">
      <label className="view-text">Sort By&nbsp;:&nbsp;</label>
<span  className="xs-pl-5"><Button  className="activeButton" size="small"  primary>Created</Button></span>
<span  className="xs-pl-5"><Button size="small"  className="inactiveButton" disabled>Updated</Button></span>
<span  className="xs-pl-5"><Button size="small"  className="inactiveButton" disabled>Name</Button></span>
      </div>
    
              </div>
        
        )
      }

}