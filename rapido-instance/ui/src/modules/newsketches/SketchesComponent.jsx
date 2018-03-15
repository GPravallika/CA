import React from 'react'
import { browserHistory } from 'react-router'
import AlertContainer from 'react-alert'
import {showAlert, AlertOptions} from '../utils/AlertActions'
import { HeaderComponent } from './HeaderComponent';
import {SketchesSortComponent} from './SketchesSortComponent';
import Card, { CardBlock, CardTitle,CardFooter } from 'mineral-ui/Card';
import {CardComponent} from '../CardComponent';

export  class SketchesComponent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {};
        this.alertOptions = AlertOptions;
      }


      render() {
      let cardBlock = <div className="wrapper"><div className="wrapper-info">This API provides list of actions that can be performed on user management.</div>
      <div className="wrapper-icon make-height-invisible"><i className="wrapper-oval"><img src="/ui/src/images/edit.png" alt="Alt text"/></i>
      <i className="wrapper-oval"><img src="/ui/src/images/delete.png" alt="Alt text"/></i>
      <i className="wrapper-oval"><img src="/ui/src/images/share.png" alt="Alt text"/></i>
      </div></div>;
      let cardFooter = <div><span className="red-status">Dev Team</span>&nbsp;&nbsp;<span className="green-status">Apps Team</span></div>
      let cardFooter1 = <div><span className="green-status">Apps Team</span></div>
      return (
            <div>
             <div className="row main-content">
                  <HeaderComponent/>
             </div>
             <br/>
             <div className="row xs-pl-15">
              <SketchesSortComponent/>
             </div>  
             <br/>
             <div className="row main-content xs-pl-15">
                      <label className="bold-font">Personal</label>
             </div>    
             <div className="row">
             <div className="col-md-12">
             <div className="col-md-4 card-layout">
            
  <CardComponent subtitle={"Updated : 02 19 2018"}   title={"User Management"} block={cardBlock}/>
               </div>

                <div className="col-md-4 card-layout">
            
            <CardComponent subtitle={"Updated : 02 19 2018"}   title={"API Manager"} block={cardBlock}/>
                         </div>

  <div className="col-md-4 card-layout">
            
            <CardComponent subtitle={"Updated : 02 19 2018"}    title={"CA API"} block={cardBlock}/>
                         </div>
</div>
               </div>
<br/>




               <div className="row main-content xs-pl-15">
               <label className="bold-font">Shared</label>
               </div>


 <div className="row">
             <div className="col-md-12">
             <div className="col-md-4">
            
  <CardComponent subtitle={"Updated : 02 19 2018"}   footer={cardFooter}  title={"Risk Management"} block={"This is API management tool.."}/>
               </div>

                <div className="col-md-4">
            
            <CardComponent subtitle={"Updated : 02 19 2018"}  footer={cardFooter1} title={"Central Book Store"} block={"This is API Management Tool."}/>
                         </div>

  <div className="col-md-4">
            <CardComponent subtitle={"Updated : 02 19 2018"}   footer={cardFooter} title={"CA API"} block={"This is API Management Tool."}/>
</div>

</div>
               </div>


</div>
        
        )
      }

}