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
        this.state={'count':50};
        this.current='';
        this.cat='';
        this.changed=true;
    }
    checkCategory(){
        switch(this.props.match.params.category){
            case 'kitchenneeds':
                this.cat='kitchenneeds';
                this.category='Kitchen Needs';
                break;
            case 'breadsbakery':
                this.cat='breadsbakery';
                this.category='Breads & Dairy';
                break;
            case 'snacks':
                this.cat='kitchenneeds';
                this.category='Snacks & branded foods';
                break;
            case 'beverages':
                this.cat='beverages';
                this.category='Beverages';
                break;
            case 'personalcare':
                this.cat='personalcare';
                this.category='Personal Care';
                break;
            case 'homecare':
                this.cat='homecare';
                this.category='Home Care & Stationary';
                break;
            case 'babycare':
                this.cat='babycare';
                this.category='Baby Care';
                break;
            case 'miscellaneus':
                this.cat='miscellaneus';
                this.category='Miscellaneus';
                break;
        }
    }
    componentDidMount(){
        // console.log('mound');
        this.getProds();
    }
    getProds(){
        console.log('get prods');
        this.checkCategory(this.props.match.params.category);
        console.log("categeory is "+this.category);
        fetch('https://products-55187.firebaseio.com/products.json').then(response=>response.json().then(data=>{
            this.products=[];
            // this.gotData=false;
            // this.setState({});
            Object.keys(data).forEach(element => {
                if(this.category===data[element].Cluster){
                    this.products.push(data[element]);
                }
            });
            if(this.products){
                this.gotData=true;
                this.gotError=false;
                this.error='';
                this.setState({'count':50});
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
        console.log('render called');
        if(this.props.current){
            if(this.current!=this.props.current){
                this.current=this.props.current;
                this.changed=true;
            }
        }
        // console.log(this.current+' '+this.cat+' '+JSON.stringify(this.products));
        // if(this.current==this.cat && this.changed){
        //     return null;
        // }
        // else{

            
            if(this.current && this.changed){
                // this.current=this.cat;
                this.changed=false;
                // this.setState({'count':50});
                this.getProds();

            }
        // }
        // console.log(this.state.count+'getting rerendered'+JSON.stringify(this.products));
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
            var show = <h4 className="centerIt mbott"></h4>;
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
    console.log('called');
    if(state.Reducer.pane || state.Reducer.applied || state.Reducer.currProduct){
        console.log(state.Reducer.filtercount)
        var pane=state.Reducer.pane;
        var curr = state.Reducer.currProduct;
        return { 'current':curr,'class': pane, applied: state.Reducer.applied, filter: state.Reducer.filter, filterCount: state.Reducer.filtercount};
    }
    return {}
}

export default connect(mapStateToProps)(Products);