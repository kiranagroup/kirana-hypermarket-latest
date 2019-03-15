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
            <nav class="navbar navbar-expand-lg navbar-light">
                <a class="navbar-brand" href="#" onClick={()=>{this.props.history.push('/')}}><img src={require('../../../images/homeicon.png')} alt="Home"/></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                        <li class="nav-item active">
                            <a class="nav-link" href="#">Kitchen Needs</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Breads & Bakery</a>
                        </li>
                        <li class="nav-item" onClick={this.callMe.bind(this)} myvalue="snacks">
                            <a class="nav-link" href="#">Snacks</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Beverages</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Personal Care</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Home Care</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Baby Care</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.callMe.bind(this)} href="#" id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="miscellaneus" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.misc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.misc').classList.remove('show')}}>
                            Miscellaneous
                            </a>
                            <div class="dropdown-menu misc" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.misc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.misc').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default withRouter(Category);