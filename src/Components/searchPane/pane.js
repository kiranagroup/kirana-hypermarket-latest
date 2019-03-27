import React,{Component} from 'react';
import Category from './Panes/category';
import Brand from './Panes/brand';
// import Price from './Panes/price';
import './Panes/panes.css';
import {connect} from 'react-redux';
import elasticsearch from 'elasticsearch';
import {searchPaneQueryBody} from '../../assets/functions';
import {elasticconfig} from '../../assets/service-act.js';
import {Store} from '../../Models/Store';

class Pane extends Component{
    constructor(props){
        super(props);
        this.state={
            reqProcessing: true,
            reqResponse: {}
        }
    }
    esClient = new elasticsearch.Client({
        host: elasticconfig.host,
        httpAuth: elasticconfig.httpAuth,
        log: 'error'
    });

    // requestFilteredData(brands, categories, lowBound, highBound){
    // 	this.setState({reqProcessing: true});
    //     this.esClient.search({index: 'website', body: searchPaneQueryBody(brands, categories, lowBound, highBound)})
    //     .then(results => {
    //         this.setState({reqResponse: results, reqProcessing: false})
    //     })
    //     .catch(err => {console.log(err);})
    // }
    requestFilteredData(brands, categories){
    	this.setState({reqProcessing: true});
        this.esClient.search({index: 'website', body: searchPaneQueryBody(brands, categories, null,null)})
        .then(results => {
            if (this.props.applied) {
                let data = results.hits.hits.map(hit => hit._source);
                Store.dispatch({ type: 'filter', payLoad: data });
            }
            this.setState({reqResponse: results, reqProcessing: false})
        })
        .catch(err => {console.log(err);})
    }
    componentDidMount(){
    	this.requestFilteredData([], []);
    }

    render(){
        console.log(this.props.category);
    	if(!this.state.reqProcessing){console.log(this.state.reqResponse)}
	    return(
	        <div style={{textAlign:'center',border:'1px solid rgba(0,0,0,0.75)',borderRadius:'5px',padding:'2.5% 5%'}}>
	            <Category category={this.props.category} filterToggle={() => this.requestFilteredData(this.props.brands, this.props.categories)}></Category>
	            <Brand category={this.props.category} filterToggle={() => this.requestFilteredData(this.props.brands, this.props.categories)}></Brand>
	            {/* <Price category={this.props.category}></Price> */}
                {/* <button
                className="selected"
                onClick={
                    ()=>{
                        this.requestFilteredData(this.props.brands,this.props.categories);
                    }
                }>
                    Apply Filters
                </button> */}
	        </div>
	    );
	}
}

const mapStateToProps = (state) =>{
    var brands = [];
    var categories=[];
    var applied = state.Reducer.applied;
    // var plow=null,phigh=null;
    if(state.Reducer.brands){
        brands=state.Reducer.brands;
    }
    if(state.Reducer.categories){
        categories=state.Reducer.categories;
    }
    // if(state.Reducer.plow){
    //     plow=state.Reducer.plow;
    // }
    // if(state.Reducer.phigh){
    //     phigh=state.Reducer.phigh;
    // }
    // return{brands:brands,categories:categories,plow:plow,phigh:phigh};
    return {brands:brands,categories:categories,applied:applied};
} 
export default connect(mapStateToProps)(Pane);