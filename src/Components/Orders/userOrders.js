import React, { Component } from 'react';
import { Store } from '../../Models/Store';
import firebase from '../../assets/firebase_config';

class UserOrders extends Component {
  state = {
    orders: [],
    handles: [],
    loading: true
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if(user) {
        firebase.database().ref(`userOrder/${user.uid}`).once('value', snapshot => {
          let orders = Object.keys(snapshot.val()).map(key => {
            return {
              orderId: key,
              ...snapshot.val()[key]
            };
          });
          this.setState({ orders: [...orders], loading: false });
        });
      } else {
        this.props.history.replace('/')
      }
    });
  }

  render() {
    let { orders } = this.state;
    let list;
    if(this.state.loading)
      list = <p>Loading....</p>
    else {
      list = orders.map(order => {
        return (
          <div key={order.orderId}>
            <p>{order.orderId}</p>
            <p>{order.placedOn}</p>
            <p>{order.status}</p>
            <p>{order.total}</p>
          </div>
        );
      });
    }
    return (
      <div>
        {list}
      </div>
    );
  }
}

export default UserOrders;
