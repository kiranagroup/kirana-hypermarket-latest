import React,{Component} from 'react';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './category.css'
import {Store} from '../../../Models/Store';
import { withRouter } from "react-router";
import elasticsearch from 'elasticsearch';
import {reqCollectionQueryBody, searchPaneQueryBody} from '../../../assets/functions';
import {elasticconfig} from '../../../assets/service-act.js'


class SubCategory extends Component{
    constructor(props){
        super(props);
        this.got=false;
        this.category=[];
        this.currentShow=4;
        // this.value=this.props.myvalue;
    }
    esClient = new elasticsearch.Client({
        host: elasticconfig.host,
        httpAuth: elasticconfig.httpAuth,
        log: 'error'
    });

    requestCollections = () =>{
        this.esClient.search({index: 'website', body: reqCollectionQueryBody})
        .then(data => {
            console.log(data);
            this.got=true;
                for(let i=0;i<data.aggregations.by_cluster.buckets.length;i++){
                    if(data.aggregations.by_cluster.buckets[i].key==this.props.category){
                        this.category=data.aggregations.by_cluster.buckets[i].by_category.buckets;
                        if(this.category.length<5){
                            this.currentShow=this.category.length;
                        }
                    }
                }
                this.setState({});
        })
        .catch(err => {console.log(err);})
    }

    changeCount(){
        this.currentShow=(this.currentShow==this.category.length)?4:this.category.length;
        this.setState({});
    }

    // changeSection(event){
    //     // console.log(event.target);
    //     this.props.history.push('/product/'+event.target.getAttribute('myvalue'));
    //     var li=document.querySelectorAll('li');
    //     li.forEach(element => {
    //         element.classList.remove('active');
    //     });
    //     event.target.parentElement.classList.add('active');
    //     Store.dispatch({'type':'changeProduct','payLoad':event.target.getAttribute('myvalue')});
    //     this.setState({});
    // }

    componentDidMount(){
        this.requestCollections();
    }

    TitleCase(str){
        return str.replace(
            /\w\S*/g,
            function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    render(){
        while(!this.got){
            return(
                <img src={require('../../../images/paneloader.gif')} alt="Loading.." className="paneload"/>
            )
        }
        if(this.category.length>5 && this.currentShow<=4){
            var showMore= <p className="more pane navcat" onClick={this.changeCount.bind(this)}><i className="fa fa-caret-down" aria-hidden="true"></i></p> 
        }
        else if(this.currentShow==this.category.length && this.category.length>5){
            var showMore= <p className="more pane navcat" onClick={this.changeCount.bind(this)}><i className="fa fa-caret-up" aria-hidden="true"></i></p>
        }
        return(
            <div>
                {this.category.map((element,index)=>{
                    if(index>this.currentShow){
                        return;
                    }
                    return(
                        <div key={element.key}>
                            <p onClick={()=>{   
                                Store.dispatch({'type':'category','payLoad':element.key})
                                this.props.change(this.props.category);
                            }}
                            className="navcattext"
                            >{this.TitleCase(element.key)}</p>
                        </div>
                    )
                })} 
                {showMore}
            </div>
        )
    }
}

export default withRouter(SubCategory);