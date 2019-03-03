import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './loginisignup.css';
import firebase from '../../../assets/firebase_config';
import '../../../../node_modules/font-awesome/css/font-awesome.min.css';

class LoginSignup extends Component {
    state = {
        currentStep: 1,
        error: null
    }
    hideError = () => {
        setTimeout(() => {
            this.setState({error: null})
        }, 2500);
    }
    takeAction = () => {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        switch (this.state.currentStep) {
            case 1:
                if (!this.refs.email.value || !this.refs.email.value.match(regex)) {
                    this.setState({ error: 'Please enter a valid email address'});
                    this.hideError();
                    break;
                } else if (!this.refs.password.value) {
                    this.setState({ error: 'Please enter a password'})
                    this.hideError();
                    break;
                } else {
                    firebase.auth().signInWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then(user => {
                        console.log("User Logged In");
                        this.hideModal();
                        this.setState({ ...this.state, currentStep: 1 });
                    }).catch(error => {
                        console.log(error.code);
                        console.log(error.message);
                        if (error.code === 'auth/user-not-found') {
                            this.refs.email.value = '';
                            this.refs.password.value = '';
                            this.setState({ error: 'Please Signup First!'});
                            this.hideError();
                        } else {
                            this.setState({ error: 'Error in Signing In'});
                            this.hideError();
                        }
                    });
                }
                break;

            case 2:
                if (!this.refs.email.value || !this.refs.email.value.match(regex)) {
                    this.setState({ error: 'Please enter a valid email address'})
                    this.hideError();
                    break;
                } else if (!this.refs.password.value) {
                    this.setState({ error: 'Please enter a password'});
                    this.hideError();
                    break;
                } else {
                    firebase.auth().createUserWithEmailAndPassword(this.refs.email.value, this.refs.password.value).then(user => {
                        firebase.database().ref('/users/' + user.user.uid).set({
                            email: user.user.email,
                            createdOn: Date.now()
                        });
                        this.refs.email.value = '';
                        this.refs.password.value = '';
                        this.setState({ ...this.state, currentStep: 3 });
                    }).catch(error => {
                        console.log(error.code, error.message);
                        this.setState({ error: error.message});
                        this.hideError();
                    });
                }
                break;

            case 3:
                if (!this.refs.newaddrhno.value || !this.refs.newaddrapname.value || !this.refs.newaddrstname.value || !this.refs.newaddrlocality.value || !this.refs.newaddrpcode.value || !this.refs.newm.value || !this.refs.newfname.value || !this.refs.newlname.value || !this.refs.newnum.value) {
                    this.setState({ error: 'Please fill all the details'});
                    this.hideError();
                    break;
                } else {
                    let values = this.refs;
                    let id = firebase.auth().currentUser.uid;
                    let houseNo = values.newaddrhno.value;
                    let apartmentName = values.newaddrapname.value;
                    let streetName = values.newaddrstname.value;
                    let locality = values.newaddrlocality.value;
                    let landmark = (values.newaddrlandmark.value) ? values.newaddrlandmark.value : '';
                    let pincode = values.newaddrpcode.value;
                    let addr = {
                        houseNo,
                        apartmentName,
                        streetName,
                        locality,
                        landmark,
                        pincode
                    };
                    let key = firebase.database().ref(`/users/${id}`).child('address').push().key;
                    firebase.database().ref().update({
                        [`/users/${id}/firstName`]: values.newfname.value,
                        [`/users/${id}/lastName`]: values.newlname.value,
                        [`/users/${id}/contact`]: values.newnum.value,
                        [`/users/${id}/title`]: values.newm.value,
                        [`/users/${id}/address/${key}`]: addr
                    }).then(() => {
                        console.log('User data saved');
                        this.setState({currentStep: 1})
                        this.hideModal();
                    }).catch(error => {
                        console.log(error);
                    });
                }
                break;

            default:
                break;

        }
    }
    showModal = () => {
        this.refs.modal.classList.add('block');
    }
    hideModal = () => {
        if(this.refs.email) this.refs.email.value = '';
        if(this.refs.password) this.refs.password.value = '';
        if(this.refs.newaddrhno) this.refs.newaddrhno.value = '';
        if(this.refs.newaddrapname) this.refs.newaddrapname.value = '';
        if(this.refs.newaddrstname) this.refs.newaddrstname.value = '';
        if(this.refs.newaddrlocality) this.refs.newaddrlocality.value = '';
        if(this.refs.newaddrpcode) this.refs.newaddrpcode.value = '';
        if(this.refs.newm) this.refs.newm.value = '';
        if(this.refs.newfname) this.refs.newfname.value = '';
        if(this.refs.newlname) this.refs.newlname.value = '';
        if(this.refs.newnum) this.refs.newnum.value = '';
        this.refs.modal.classList.remove('block');
        this.setState({currentStep: 1})
    }
    logout = () => {
        firebase.auth().signOut();
    }
    render() {
        let message;
        let {user} = this.props;
        let {currentStep} = this.state;
        let currentModal, button1, button2, button3, extrafooter;
        currentModal=button1=button2=button3=extrafooter = null;

        switch (currentStep) {
            case 1:
                currentModal = <div className="row">
                    <h5 className="col-12 col-sm-12">Sign In to Proceed</h5>
                    <br />
                    <input type="email" ref='email' className="col-12 col-sm-12" placeholder="Email" />
                    <br />
                    <input type="password" ref='password' className="col-12 col-sm-12" placeholder="Password" />
                </div>;
                button1 = 'Close';
                button2 = 'Enter';
                button3 = 'Not Registered? Click Here';
                extrafooter = null;
                break;
            
            case 2:
                currentModal = <div className="row">
                    <h5 className="col-12 col-sm-12">Sign Up</h5>
                    <br />
                    <input type="email" ref='email' className="col-12 col-sm-12" placeholder="Email" />
                    <br />
                    <input type="password" ref='password' className="col-12 col-sm-12" placeholder="Password" />
                </div>;
                button1 = 'Close';
                button2 = 'Enter';
                button3 = null;
                extrafooter = null;
                break;
            
            case 3:
                currentModal = <div className="row">
                    <h5 className='col-12 col-sm-12'>Personal Details</h5>
                    <select ref='newm' className='col-2 col-sm-2' defaultValue="Mr">
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Miss">Miss</option>
                    </select>
                    <input type="text" ref='newfname' placeholder='First Name' className='col-5 col-sm-5' />
                    <input type="text" ref='newlname' placeholder='Last Name' className='col-5 col-sm-5' />
                    {/* <input type="text" ref='newemail' placeholder='Email Address' className='col-6 col-sm-6'/> */}
                    {/* <input type="text" ref='newage' placeholder='Age' className='col-2 col-sm-2'/> */}
                    <input type="text" ref='newnum' placeholder='Contact Number' className='col-4 col-sm-4' />
                    <br />
                    <h5 className='col-12 col-sm-12'>Address Details</h5>
                    <input type="text" placeholder='House Number' ref='newaddrhno' className="col-4 col-sm-4" />
                    <input type="text" placeholder='Apartment Name' ref='newaddrapname' className="col-8 col-sm-8" />
                    <input type="text" placeholder='Street Name' ref='newaddrstname' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Locality' ref='newaddrlocality' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Landmark(if any)' ref='newaddrlandmark' className="col-6 col-sm-6" />
                    <input type="text" placeholder='Pin Code' ref='newaddrpcode' className="col-6 col-sm-6" />
                </div>
                button1 = 'Cancel';
                button2 = 'Save & Proceed';
                button3 = null;
                extrafooter = null;
        
            default:
                break;
        }

        if(user === null){
            message = <h5>Loading...</h5>;
        }
        else if(user === undefined){
            if(this.props.screen > 576)
                message = <h5 style={{cursor: 'pointer'}} onClick={this.showModal}>Login/Signup</h5>
            else 
                message = <i class="fa fa-user-circle-o" aria-hidden="true" style={{ cursor: 'pointer' }} onClick={this.showModal}></i>
        } else if(user){
            if(this.props.screen > 576)
                message = <h5>Hello, {user.firstName} <span onClick={this.logout}>Logout</span> </h5>
            else
                message = <span className="user-icon" onClick={this.logout}>{user.firstName[0] + user.lastName[0]}</span>
        }
        return (
        <div>
            {message}
            <div className="modal" ref="modal" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {currentModal}
                            <br />
                            <p className="error">{this.state.error}</p>
                        </div>
                        <div className="modal-footer d-flex justify-content-center flex-column flex-lg-row flex-md-row">
                            <p style={extrafooter ? { display: 'block' } : { display: 'none' }}>{extrafooter}</p>
                            {/* Commented because after that payment vala aana h */}
                            <button type="button" style={button3 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-sm btn-primary" onClick={() => {
                                this.setState({currentStep: 2})
                            }}>{button3}</button>
                            <button type="button" style={button2 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-primary" onClick={this.takeAction}>{button2}</button>
                            <button type="button" style={button1 ? { display: 'inline-block' } : { display: 'none' }} className="btn btn-secondary" onClick={this.hideModal}>{button1}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.Reducer.user
    };
}

export default connect(mapStateToProps)(LoginSignup);
