import React,{Component} from 'react';
import {connect} from 'react-redux';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';
import './cart.css';
import {Store} from '../../Models/Store';

export default class CartProducts extends Component{
    constructor(props){
        super(props);
        this.state={'count':this.props.totalProducts};
    }
    removeFromCart(Obj){
        var payload = {Product:Obj};
        Store.dispatch({type:'remove',payLoad:payload});
    }
    incProduct(Obj){
        var payload = {Product:Obj};
        Store.dispatch({type:'add',payLoad:payload});
    }
    decProduct(Obj){
        var payload = {Product:Obj};
        Store.dispatch({type:'sub',payLoad:payload});
    }
    render(){
        if(this.props.markedItems && this.props.markedItems.length>0){
            return(
                <div className="row">
                    {this.props.markedItems.map((element)=>{
                        return(
                            <div className="col-12 col-sm-12 cartProducts row" key={element.Product['Product ID']}>
                                <div className="col-2 col-sm-2 imgparent">
                                    <img src={element.Product['Pic URL']  || require('../../images/dfbg.png')} alt=''/>
                                </div>
                                <div className="col-5 col-sm-5">
                                    <h6 className="cartProductHeading">{element.Product.Description}</h6>
                                    <p className="cartProductDesc">{element.Product.Brand}</p>
                                    <p className="cartProductDesc">{element.Product.Cluster}</p>
                                    <p className="cartProductDesc">{element.Product.Weight}</p>
                                </div>
                                <div className="col-1 col-sm-1 nopad cartOps">
                                    <div className="incdec">
                                        <p className="nomarg"><i className="fa fa-chevron-up" aria-hidden="true" onClick={this.incProduct.bind(this,element.Product)}></i></p>
                                        <p className="nomarg value"><span className="floating">{element.value}</span></p>
                                        <p className="nomarg"><i className="fa fa-chevron-down" aria-hidden="true" onClick={this.decProduct.bind(this,element.Product)}></i></p>
                                    </div>
                                </div>
                                <div className="col-3 col-sm-3">
                                <p className="cartProductDesc">MRP : {element.Product.Price}</p>
                                <hr className="editline"/>
                                <p className="cartProductDesc">Subtotal : {parseInt(element.Product.Price.substring(1,element.Product.Price.length))*element.value}</p>
                                </div>
                                <div className="col-1 col-sm-1 del">
                                <p className="nomarg"><i className="fa fa-trash" aria-hidden="true" onClick={this.removeFromCart.bind(this,element)}></i></p>
                                </div>
                            </div>
                        )    
                    })}
                </div>
            )
        }
        return(
            <p className="centerIt marginTop">Cart is Empty</p>
        )
    }
    
}