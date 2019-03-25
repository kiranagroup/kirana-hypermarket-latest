import React,{Component} from 'react';
import { Store } from '../../Models/Store';
import { connect } from 'react-redux';
import firebase from '../../assets/firebase_config';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './pay.css';
import '../../../node_modules/font-awesome/css/font-awesome.min.css';

const shopId = 'MB18S6aaMpeDBDaFYdqOFwHldb82';

const getTotal = that => {
    let total = 0;
    if (that.props.products) {
        for (let i = 0; i < that.props.products.length; i++) {
            total += parseInt(that.props.products[i].value) * parseInt(that.props.products[i].Product.Price);
        }
    }
    return total;
}

class Payment extends Component{
    constructor(){
        super();
    }

    placeOrder() {
			const {products, address} = this.props;
            const total = getTotal(this);
			const {uid} = firebase.auth().currentUser;
			const {key} = firebase.database().ref('shopOrders').child(shopId).push();
			const updateData = {};
			updateData[`shopOrder/${shopId}/${key}`] = {
				details: products,
				total: total,
				sid: shopId,
				uid: uid,
				status: 'Placed',
                placedOn: Date.now(),
                address: address
			};
			updateData[`userOrder/${uid}/${key}`] = {
				sid: shopId,
				uid: uid,
				total: total,
				status: 'Placed',
				placedOn: Date.now()
			};

			firebase.database().ref().update(updateData, error => {
				if(error) {
					console.log(error);
				} else {
                    console.log('Order Successfully Placed');
                    Store.dispatch({ 'type': 'removeAll' });
                    Store.dispatch({ 'type': 'pay_done' });
				}
			});
    }

    render(){
        let total = getTotal(this);
        if(!this.props.total){
            return(
                <div className='container centerIt'>
                    <h3>Your Cart is empty</h3>
                    <button className='nocartbtn' onClick={()=>{
                        this.props.history.replace('/');
                    }}> <b>Please Shop <i className="fa fa-caret-right" aria-hidden="true"></i></b> </button>
                </div>
            )
        }
        while(!this.props.products){
            return(
                <div className="container centerIt">
                    <img src={require('../../images/loader.gif')} className="load" alt="Loading..."/>
                </div>
            )
        }
        return(
            <div className='container payment'>
                <div className="row">
                    <div className="col-12 col-sm-12 headtab row">
                        <div className="col-4 col-sm-4 heading">
                            <h5>Item Description</h5>    
                        </div>
                        <div className="col-2 col-sm-2 heading">
                            <h5>Unit Price</h5>
                        </div>
                        <div className="col-4 col-sm-4 heading">
                            <h5>Quantity</h5>
                        </div>
                        <div className="col-2 col-sm-2 heading">
                            <h5>Subtotal</h5>
                        </div>
                    </div>
                    {this.props.products.map((element,index)=>{
                        return(
                            <div className="col-12 col-sm-12 itemrow row" key={index}>
                            <div className="col-4 col-sm-4 itemtab">
                                <h6>{element.Product.Brand}</h6>
                                <h6>{element.Product.Description}</h6>    
                            </div>
                            <div className="col-2 col-sm-2 itemtab linemid">
                                <h6>₹{element.Product.Price}</h6>
                            </div>
                            <div className="col-4 col-sm-4 itemtab linemid">
                                <button className="dec" onClick={()=>{
                                    Store.dispatch({'type':'sub','payLoad':element});
                                }}>-</button>
                                <h6 className='quantity'>{element.value}</h6>
                                <button className="inc" onClick={()=>{
                                    Store.dispatch({'type':'add','payLoad':element});
                                }}>+</button>
                            </div>
                            <div className="col-2 col-sm-2 itemtab linemid">
                                    <h6>₹{parseInt(element.value) * parseInt(element.Product.Price)}</h6>
                            </div>
                            </div>
                        )
                    })}
                    <div className="col-12 col-sm-12 row lastrow">
                        <div className="col-4 col-sm-4 lasttab">
                            <button className='lastbtn' onClick={()=>{
                                this.props.history.push('/');
                            }}> <b>Continue Shopping</b> </button>
                        </div>
                        <div className="col-3 col-sm-3 lasttab">
                                <button className='lastbtn short' onClick={()=>{
                                    Store.dispatch({'type':'removeAll'});
                                }}> <b>Clear All</b> </button>   
                                <button className='lastbtn2' onClick={this.placeOrder.bind(this)}> <b>Checkout <i className="fa fa-caret-right" aria-hidden="true"></i></b> </button>
                        </div>
                        <div className="col-5 col-sm-5 lasttab row">
                            <div className="col-8 col-sm-8">
                                Subtotal
                            </div>
                            <div className="col-4 col-sm-4">
                                <b>₹{total}</b>
                            </div>
                            <div className="col-8 col-sm-8">
                                Delivery Charges
                            </div>
                            <div className="col-4 col-sm-4">
                                <b>₹ 0</b>
                            </div>
                            <hr/>
                            <div className="col-8 col-sm-8">
                                <b>Total</b>
                            </div>
                            <div className="col-4 col-sm-4">
                                <b>₹{total}</b>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    if(state.Reducer.added){
        var product = state.Reducer.added;
        var count = state.Reducer.count;
        var address = state.Reducer.address;
        return {products:product,total:count,address:address}
    }
    return {}
}

export default connect(mapStateToProps)(Payment);