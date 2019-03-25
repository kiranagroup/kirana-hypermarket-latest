import React, {Fragment} from 'react';

const orderDetails = ({details}) => {
  let items = details.map(detail => {
    let {Product, value} = detail;
    let {Brand, Description, Price} = Product;
    return (
      <Fragment>
        <div className="col-3 mt-2">{Brand}</div>
        <div className="col-3 mt-2">{Description}</div>
        <div className="col-3 mt-2">{Price}</div>
        <div className="col-3 mt-2">{value}</div>
      </Fragment>
    );
  });

  return (
    <div className="row">
      <div className="col-3 font-weight-bold">Brand</div>
      <div className="col-3 font-weight-bold">Description</div>
      <div className="col-3 font-weight-bold">Price</div>
      <div className="col-3 font-weight-bold">Quantity</div>
      {items}
    </div>
  );
};

export default orderDetails;