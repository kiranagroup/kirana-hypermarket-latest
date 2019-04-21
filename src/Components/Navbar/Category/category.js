import React,{Component} from 'react';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { withRouter } from "react-router";
import './category.css';
import {Store} from '../../../Models/Store';
import SubCategory from './subCategory';

class Category extends Component{
    constructor(){
        super();
    }
    changeSection(event){
        // console.log(event.target);
        this.props.history.push('/product/'+event.target.getAttribute('myvalue'));
        var li=document.querySelectorAll('li');
        li.forEach(element => {
            element.classList.remove('active');
        });
        event.target.parentElement.classList.add('active');
        Store.dispatch({'type':'changeProduct','payLoad':event.target.getAttribute('myvalue')});
        this.setState({});
    }
    changeSubSection(val){
        alert('changed',val);
        var value='';
        var li=document.querySelectorAll('li');
        li.forEach(element=>{
            if(element.firstChild.innerText==val){
                value = element.firstChild.getAttribute('myvalue');
            }
        })
        this.props.history.push('/product/'+value);
        li.forEach(element => {
            element.classList.remove('active');
        });
        li.forEach(element=>{
            if(element.firstChild.innerText==val){
                element.classList.add('active');
            }
        })
        // event.target.parentElement.classList.add('active');
        // Store.dispatch({'type':'changeProduct','payLoad':val});
        this.setState({});
    }
    componentDidMount(){
        console.log(window.location.href);
        var li=document.querySelectorAll('li');
        if(window.location.href.includes('product/')){
            var category = window.location.href.split('product/')[1];
            if(category.includes('#')){
                category=category.split('#')[0];
            }
        }
        else{
            li.forEach(element => {
                element.classList.remove('active');});
            return;
        }

        li.forEach(element => {
            element.classList.remove('active');
            element.childNodes[0].getAttribute('myvalue')==category?element.classList.add('active'):element.classList.remove('active');
        });
    }
    render(){
        return(
            <nav class="navbar navbar-expand-lg navbar-light">
                <a class="navbar-brand"><img src={require('../../../images/homeicon.png')} alt="Home"  onClick={()=>{this.props.history.push('/')}}/></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNavDropdown">
                    <ul class="navbar-nav">
                    <li class="nav-item dropdown active">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="kitchenneeds" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.kn').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.kn').classList.remove('show')}}>
                            Kitchen Needs
                            </a>
                            <div class="dropdown-menu kn" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.kn').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.kn').classList.remove('show')}}>
                                {/* <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a> */}
                                <SubCategory category={'Kitchen Needs'} change={this.changeSubSection.bind(this)}></SubCategory>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="breadsbakery" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.bb').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bb').classList.remove('show')}}>
                            Breads & Bakery
                            </a>
                            <div class="dropdown-menu bb" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.bb').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bb').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="snacks" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.sn').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.sn').classList.remove('show')}}>
                            Snacks
                            </a>
                            <div class="dropdown-menu sn" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.sn').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.sn').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="beverages" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.bv').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bv').classList.remove('show')}}>
                            Beverages
                            </a>
                            <div class="dropdown-menu bv" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.bv').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bv').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="personalcare" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.pc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.pc').classList.remove('show')}}>
                            Personal Care
                            </a>
                            <div class="dropdown-menu pc" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.pc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.pc').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="homecare" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.hc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.hc').classList.remove('show')}}>
                            Home Care
                            </a>
                            <div class="dropdown-menu hc" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.hc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.hc').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="babycare" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.bc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bc').classList.remove('show')}}>
                            Baby Care
                            </a>
                            <div class="dropdown-menu bc" aria-labelledby="navbarDropdownMenuLink"  onMouseEnter={()=>{document.querySelector('.dropdown-menu.bc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.bc').classList.remove('show')}}>
                                <a class="dropdown-item" href="#">Action</a>
                                <a class="dropdown-item" href="#">Another action</a>
                                <a class="dropdown-item" href="#">Something else here</a>
                            </div>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" onClick={this.changeSection.bind(this)} id="navbarDropdownMenuLink" role="button" data-toggle="dropdown" aria-haspopup="true" myvalue="miscellaneus" aria-expanded="false" onMouseEnter={()=>{document.querySelector('.dropdown-menu.misc').classList.add('show')}} onMouseLeave={()=>{document.querySelector('.dropdown-menu.misc').classList.remove('show')}}>
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