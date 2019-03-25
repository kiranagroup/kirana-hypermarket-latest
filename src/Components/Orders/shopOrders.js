import React, { Component } from 'react';
import OrderDetails from './orderDetails';
import firebase from '../../assets/firebase_config';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const shopId = 'MB18S6aaMpeDBDaFYdqOFwHldb82';

class ShopOrders extends Component {
  state = {
    orders: [],
    initialised: false
  }

  componentDidMount() {
    const rootRef = firebase.database().ref();
    const shopRef = rootRef.child(`shopOrder/${shopId}`);
    const query = shopRef.orderByChild('status').equalTo('Placed');

    shopRef.once('value', snapshot => {
      if (snapshot.val()) {
        let orders = Object.keys(snapshot.val()).map(key => {
          return {
            orderId: key,
            ...snapshot.val()[key]
          };
        });
        this.setState({ orders: [...orders] });
      }
    });

    query.on('child_added', snapshot => {
      if (this.state.initialised) {
        let order = {
          orderId: snapshot.key,
          ...snapshot.val()
        };
        this.setState({ orders: [order, ...this.state.orders] });
      }
    });

    this.setState({initialised: true});
  }

  changeStatus = (e, key, sid, uid) => {
    e.preventDefault();
    firebase.database().ref().update({
      [`userOrder/${uid}/${key}/status`]: 'Accepted',
      [`shopOrder/${sid}/${key}/status`]: 'Accepted'
    }).then(() => {
      let { orders } = this.state;
      let index = orders.findIndex(order => key === order.orderId);
      let order = orders.splice(index, 1);
      let updatedOrder = {
        ...order[0],
        status: 'Accepted'
      }
      orders.splice(index, 0, updatedOrder);
      this.setState({ orders: [...orders] });
    }).catch(error => console.log(error));
  }

  render() {
    let {orders} = this.state;
    let list = orders.map(order => {
      let date = new Date(order.placedOn);
      let {address, details, status, orderId, total, sid, uid} = order;
      return (
        <div class="card col-10 mb-3" key={orderId}>
          <h5 class="card-header">Order ID {orderId}</h5>
          <div class="card-body">
            <h5 class="card-title">Order Summary</h5>
            <p class="card-text">
              <span className="d-block text-center">Placed On - {date.toUTCString()}</span>
              <span className="d-block text-center">Status - {status}</span>
              <span className="d-block text-center">Total Amount - {total}</span>
            </p>
            {(status === 'Placed') ? 
              <a class="btn btn-primary text-white" onClick={(e) => this.changeStatus(e, orderId, sid, uid)}>Accept</a> :
              <span>Order {status}</span>
            }
          </div>
            <div className="card-body">
              <h5 class="card-title">Delivery Address</h5>
              <address className="card-text">
                  <p>{address['houseNo']}, {address['apartmentName']}</p>
                  <p>{address['locality']}, {address['streetName']}</p>
                  <p>{address['landmark']}</p>
                  <p>{address['pincode']}</p>
              </address>
            </div>
            <div className="card-body">
              <h5 class="card-title">Delivery Details</h5>
              <div className="card-text">
                <OrderDetails details={details} />
              </div>
            </div>
        </div>
      );
    });

    return (
      <div class="row d-flex justify-content-center">
        {list}
      </div>
    );
  }
}

export default ShopOrders;
