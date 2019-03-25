import React, { Component } from 'react';
import { Store } from '../../Models/Store';
import firebase from '../../assets/firebase_config';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

const updateStatus = (uid, key, change, that) => {
  let handles = [...that.state.handles];
  let index = handles.findIndex(item => item.orderId === key);
  let reference = handles.splice(index, 1);
  firebase.database().ref(`userOrder/${uid}/${key}`).off('child_changed', reference[0].fn);
  let orders = [...that.state.orders];
  index = orders.findIndex(order => key === order.orderId);
  let order = orders.splice(index, 1);
  let updatedOrder = {
    ...order[0],
    status: change
  }
  orders.splice(index, 0, updatedOrder);
  that.setState({ orders: [...orders], handles: [...handles] });
}

class UserOrders extends Component {
  state = {
    orders: [],
    handles: [],
    loading: true
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        const userRef = firebase.database().ref(`userOrder/${user.uid}`);
        const query = userRef.orderByChild('status').equalTo('Placed');
        userRef.once('value', snapshot => {
          let orders = Object.keys(snapshot.val()).map(key => {
            return {
              orderId: key,
              ...snapshot.val()[key]
            };
          });
          this.setState({ orders: [...orders], loading: false });
        });

        query.once('value', snapshot => {
          let that = this;
          Object.keys(snapshot.val()).forEach(orderId => {
            let orderRef = firebase.database().ref(`userOrder/${user.uid}/${orderId}`);
            let fn = orderRef.on('child_changed', snapshot => {
              if (snapshot.val() !== 'Placed')
                updateStatus(user.uid, orderId, snapshot.val(), that);
            });
            let handleRef = { orderId, fn };
            this.setState({ handles: this.state.handles.concat(handleRef) });
          });
        });
      } else {
        this.props.history.replace('/')
      }
    });
  }

  componentWillUnmount() {
    if(firebase.auth().currentUser) {
      let { uid } = firebase.auth().currentUser;
      let handles = [...this.state.handles];
      handles.forEach(handle => {
        firebase.database().ref(`user/${uid}/${handle.orderId}`).off('child_changed', handle.fn);
      });
    }
    this.setState({ handles: [] });
  }

  render() {
    let { orders } = this.state;
    let list;
    if(this.state.loading)
      list = <p>Loading....</p>
    else {
      list = orders.map(order => {
        let date = new Date(order.placedOn);
        return (
          <div class="card col-8 mb-3" key={order.orderId}>
            <h5 class="card-header">Order ID {order.orderId}</h5>
            <div class="card-body">
              <h5 class="card-title">Order Summary</h5>
              <p class="card-text">
                <span className="d-block text-center">Placed On - {date.toUTCString()}</span>
                <span className="d-block text-center">Status - {order.status}</span>
                <span className="d-block text-center">Total Amount - {order.total}</span>
              </p>
              <a href="#" class="btn btn-primary">Complete Details</a>
            </div>
          </div>
        );
      });
    }
    return (
      <div className="row d-flex justify-content-center">
        {list}
      </div>
    );
  }
}

export default UserOrders;
