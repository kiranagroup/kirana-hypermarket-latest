import React,{Component} from 'react';
import './panes.css';
import '../../../../node_modules/font-awesome/css/font-awesome.min.css';
import {connect} from 'react-redux';
import {Store} from '../../../Models/Store';
import elasticsearch from 'elasticsearch';
import {reqCollectionQueryBody, searchPaneQueryBody} from '../../../assets/functions';
import {elasticconfig} from '../../../assets/service-act.js'

class Category extends Component{
    constructor(){
        super();
        this.got=false;
        this.category=[];
        this.currentShow=4;
        this.cat=[];
    }

    esClient = new elasticsearch.Client({
        host: elasticconfig.host,
        httpAuth: elasticconfig.httpAuth,
        log: 'error'
    });

    // componentWillMount(){
    //     this.requestCollections(this.esClient);
    // }

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
                Store.dispatch({'type':'changePrev'});
                this.setState({});
        })
        .catch(err => {console.log(err);})
    }
    
    // componentDidMount(){
    //     this.requestCollections();
    // }
    changeCount(){
        this.currentShow=(this.currentShow==this.category.length)?4:this.category.length;
        this.setState({});
    }
    editCategory(category){
        Store.dispatch({'type':'category','payLoad':category})
    }
    toggleFilter(element) {
        this.editCategory(element.key);
        this.props.filterToggle();
    }
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
        if(this.props.currProd){
            var currentLocation = window.location.href.split('product/')[1];
            if(currentLocation.includes('#')){
                currentLocation=currentLocation.split('#')[0];
            }
            if(this.props.currProd!=currentLocation){
                this.requestCollections();
            }
        }
        while(!this.got){
            return(
                <img src={require('../../../images/paneloader.gif')} alt="Loading.." className="paneload"/>
            )
        }
        if(this.category.length>5 && this.currentShow<=4){
            var showMore= <p className="more pane" onClick={this.changeCount.bind(this)}>Show More <i className="fa fa-caret-down" aria-hidden="true"></i></p> 
        }
        else if(this.currentShow==this.category.length && this.category.length>5){
            var showMore= <p className="more pane" onClick={this.changeCount.bind(this)}>Show Less <i className="fa fa-caret-up" aria-hidden="true"></i></p>
        }
        return(
            <div className="margBottom">
                <h5 style={{fontWeight:700}}>Categories</h5>
                {this.category.map((element,index)=>{
                    if(index>this.currentShow){
                        return;
                    }
                    console.log(element.key+'this is changed');
                    return(
                        <div key={element.key}>
                            <p className={this.props.categories.indexOf(element.key)==-1?'pane':'selected pane'} onClick={
                                this.toggleFilter.bind(this, element)
                            }>{this.TitleCase(element.key)}</p>
                        </div>
                    )
                })} 
                {showMore}
            </div>
        )
    }
} 

const mapStateToProps = (state) =>{
    if(state.Reducer.categories){
        let cat = state.Reducer.categories;
        let current = state.Reducer.ccount; 
        let currProd = state.Reducer.prevProduct;
        return{categories:cat,ccount:current,currProd:currProd};
    }
    return {categories:[]}
}

export default connect(mapStateToProps)(Category);