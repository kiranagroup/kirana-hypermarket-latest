import React, { Component } from 'react';
import firebase from '../../assets/firebase_config';

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
            ...snapshot.val()[key]
          };
        });
        this.setState({ orders: [...orders] });
      }
    });

    query.on('child_added', snapshot => {
      if (this.state.initialised) {
        let order = {
          ...snapshot.val()
        };
        this.setState({ orders: [order, ...this.state.orders] });
      }
    });

    this.setState({initialised: true});
  }

  render() {
    return (
      <div>
        Shop Orders
      </div>
    );
  }
}

export default ShopOrders;
