import React,{Component} from 'react';
import '../Subscriptions/subs.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Add from './Add';
// import {Store} <f></f>rom '../../Models/Store';
import Counter from './Counter';
import {connect} from 'react-redux';

class Product extends Component{
    constructor(props){
        super(props);
        // this.items=this.props.items;
        // this.count=this.props.counter;
        this.countCheck=0;
        this.state={'count': 50, 'items': []};
    }
    refresh(){
        this.setState({});
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
        console.log('render')
        this.countCheck=0;
        console.log("product", this.props.items);
        if (this.state.count < this.props.items.length) {
            var show = <div className="centerIt">
                <button className="btn" onClick={() => {
                    this.setState({ 'count': this.state.count + 50 });
                }}> <b> Show More </b> </button>
            </div>
        }
        else {
            var show = <h4 className="centerIt mbott">That's all, Thank You.</h4>;
        }
        return(
            <div className="row">
                {this.props.items.map(Obj=>{
                    if(this.countCheck===this.props.counter){
                        return;
                    }
                    var button = <Add Obj={Obj} changed={this.refresh.bind(this)}></Add>;
                    if(this.props.added){
                    for(var i=0;i<this.props.added.length;i++){
                            if(Obj['Product ID']===this.props.added[i].Product['Product ID']){
                                button=<Counter Obj={Obj} quant={this.props.added[i].value} changed={this.refresh.bind(this)}></Counter> 
                            }
                        }
                    }
                    this.countCheck++;
                    return(
                        <div key={Obj['Product ID'] + Math.random()*1001} className="col-lg-3 col-md-4 col-sm-6 col-6">
                            <div className="box prod">
                                <div className="imgbox">
                                    <img src={Obj.Pic_URL || Obj['Pic URL'] || require('../../images/dfbg.png')} alt=""/>
                                </div>
                                <div className="textbox prodtext">
                                    <h5 className="gcol">{this.TitleCase(Obj.Brand)}</h5>
                                    <p className="extra">{this.TitleCase(Obj.Description)}</p>
                                    <p className="gcol">{Obj.Weight || 'Quantity'}</p>
                                    <div className="row last">
                                        <p className="col-sm-4 col-4 highlight">{Obj.Price || 'MRP'}</p>
                                        <div className="col-sm-8 col-8 rightIt">
                                            {button}
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    )

                })}
                <br />
                {/* {show} */}
            </div>
        )
    }
}

const mapStateToProps=(state)=>{
    if(state.Reducer.added || state.Reducer.applied){
        let curr={};
        if(state.Reducer.current){
            curr=state.Reducer.current;
        }
        let add = state.Reducer.added;
        return { added: add, current: curr };
    }
    return {};
}

export default connect(mapStateToProps)(Product);