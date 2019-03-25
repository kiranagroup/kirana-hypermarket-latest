import React,{Component} from 'react';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router";
import './category.css';

class Category extends Component{
    constructor(){
        super();
    }
    callMe(event){
        console.log(event.target);
        this.props.history.push('/product/'+event.target.getAttribute('myvalue'));
        var li=document.querySelectorAll('li');
        li.forEach(element => {
            element.classList.remove('active');
        });
        event.target.parentElement.classList.add('active');
    }
    render(){
        return(
            <nav className="navbar navbar-expand-lg navbar-light">
                <a className="navbar-brand" href="#" onClick={()=>{this.props.history.push('/')}}><img src={require('../../../images/homeicon.png')} alt="Home"/></a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul className="navbar-nav">
                        <li className="nav-item active">
                            <a className="nav-link" href="#">Kitchen Needs</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Breads & Bakery</a>
                        </li>
                        <li className="nav-item" onClick={this.callMe.bind(this)} myvalue="snacks">
                            <a className="nav-link" href="#">Snacks</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Beverages</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Personal Care</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Home Care</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Baby Care</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" onClick={this.callMe.bind(this)} href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="miscellaneus" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.misc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.misc').classList.remove('show')}}>
                            Miscellaneous
                            </a>
                            <div className="dropdown-menu misc" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.misc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.misc').classList.remove('show')}}>
                                <a className="dropdown-item" href="#">Action</a>
                                <a className="dropdown-item" href="#">Another action</a>
                                <a className="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(Category);