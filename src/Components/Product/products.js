import React,{Component} from 'react';
import '../Subscriptions/subs.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Product from './product';
import Pane from '../searchPane/pane';
import Pay from '../Pay/pay';
import {connect} from 'react-redux';
// import {baby} from '../../Categories/baby';
// import {beverages} from '../../Categories/beverages';
// import {breads} from '../../Categories/breads';
// import {home} from '../../Categories/home';
// import {kitchen} from '../../Categories/kitchen';
// import {misc} from '../../Categories/misc';
// import {personal} from '../../Categories/personal';
// import {snacks} from '../../Categories/snacks';

class Products extends Component{
    constructor(props){
        super(props);
        this.props=props;
        this.gotData=false;
        this.category='';
        this.gotError=false;
        this.error="";
        this.products=[];
        // this.count=50;
        this.state={'count':50}
    }
    checkCategory(){
        switch(this.props.match.params.category){
            case 'kitchenneeds':
                this.category='Kitchen Needs';
                break;
            case 'breadsbakery':
                this.category='Breads & Dairy';
                break;
            case 'snacks':
                this.category='Snacks & branded foods';
                break;
            case 'beverages':
                this.category='Beverages';
                break;
            case 'personalcare':
                this.category='Personal Care';
                break;
            case 'homecare':
                this.category='Home Care & Stationary';
                break;
            case 'babycare':
                this.category='Baby Care';
                break;
            case 'miscellaneus':
                this.category='Miscellaneus';
                break;
        }
    }
    componentDidMount(){
        this.checkCategory(this.props.match.params.category);
        fetch('https://products-55187.firebaseio.com/products.json').then(response=>response.json().then(data=>{
            Object.keys(data).forEach(element => {
                if(this.category===data[element].Cluster){
                    this.products.push(data[element]);
                }
            });
            if(this.products){
                this.gotData=true;
                this.gotError=false;
                this.error='';
            }
            else{
                this.gotError=true;
                this.error="We are extremely sorry, but please try again later."
            }
            this.setState({});
        }).catch(err=>{console.log(err)})
    ).catch(err=>console.log(err));
    }
    render(){
        while(!this.gotData && !this.gotError){
            return(
                <div className="container centerIt">
                    <img src={require('../../images/loader.gif')} className="load" alt="Loading..."/>
                </div>
            )
        }
        while(!this.gotData && this.gotError){
            return(
                <div className="container centerIt">
                    <h4 className="alert">{this.error}</h4>
                </div>
            )
        }
        if(this.state.count<this.products.length){
            var show= <div className="centerIt">       
            <button className="btn" onClick={()=>{this.setState({'count':this.state.count+50});
        }}> <b> Show More </b> </button>
        </div>
        }
        else{
            var show = <h4 className="centerIt mbott">That's all, Thank You.</h4>;
        }
        let items;
        if(!this.props.applied && !this.props.filterCount)
            items = this.products;
        else
            items = this.props.filter;
        return(
            <div>
                <Pay></Pay>
                <div className="row">
                    <div className={this.props.class+" col-lg-2 col-md-2 col-sm-3 col-0 hidepane"} style={{padding:'0 0 0 2px'}}>
                        <Pane category={this.category}></Pane>
                    </div>
                    <div className="col-lg-10 col-md-10 col-sm-9 col-12">
                        <Product items={items} counter={this.state.count}></Product>
                        {show}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    if(state.Reducer.pane || state.Reducer.applied){
        console.log(state.Reducer.filtercount)
        var pane=state.Reducer.pane;
        return { 'class': pane, applied: state.Reducer.applied, filter: state.Reducer.filter, filterCount: state.Reducer.filtercount};
    }
    return {}
}

export default connect(mapStateToProps)(Products);