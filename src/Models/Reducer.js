import {
    CHANGE_SEARCHFIELD,
    REQUEST_PRODUCTS_PENDING,
    REQUEST_PRODUCTS_SUCCESS,
    REQUEST_PRODUCTS_FAIL
    } from './constants';

// Reducer for Cart and Products Operations
const initState = {
    brands: [],
    categories: [],
    filter: [],
    applied: false,
	filtercount: null,
	user: null
};

export const Reducer = (state=initState,action) =>{
// For adding products
    if(action.type==='add'){
        var flag=0;
        if(state.added){
            for(var i=0;i<state.added.length;i++){
                if(state.added[i].Product['Product ID']===action.payLoad.Product['Product ID']){
                    state.added[i].value+=1;
                    state.count=parseInt(state.count)+1;
                    flag=1;
                    break;
                }
            }
        }
        if(!state.added || state.added.length<1){
            state= {...state,'added':[{'Product':action.payLoad.Product,'value':1}],'count':parseInt(state.count)+1 || 1};
            localStorage.setItem('added',JSON.stringify(state.added));
            localStorage.setItem('count',state.count);
            return {...state};
        }
        if(!flag){
            state.added.push({'Product':action.payLoad.Product,'value':1});
            state={...state,'count':parseInt(state.count)+1};
        }
        localStorage.setItem('added',JSON.stringify(state.added));
        localStorage.setItem('count',state.count);
        return {...state};
    }
// For subtracting products
    else if(action.type==='sub'){
        for(i=0;i<state.added.length;i++){
            if(state.added[i].Product['Product ID']===action.payLoad.Product['Product ID']){
                if(state.added[i].value===1){
                    state.added.splice(i,1);
                    break;
                }
                state.added[i].value-=1;
                break;
            }
        }
        state={...state,'count':parseInt(state.count)-1};
        localStorage.setItem('added', JSON.stringify(state.added));
        localStorage.setItem('count',state.count);
        return {...state};
    }
//For getting products back in redux
    else if(action.type==='retain'){
        if(action.payLoad){
            state= {...state,'added':action.payLoad.added,'count':action.payLoad.count};
        }
        return {...state};
    }
// To get count
    else if(action.type==='count'){
        return{...state};
    }
// To empty the cart  
    else if(action.type==='removeAll'){
        localStorage.setItem('added',[]);
        localStorage.setItem('count',0);
        if(!state.added){
            return {...state};
        }
        if(state.added){
            state.added=null;
        }
        else if(state.added.length>0){
            state.added=null;
        }
        if(state.count){
            state.count=0;
        }
        return {...state, address: null};
    }
// To remove a product from cart
    else if(action.type==='remove'){
        var obj = {}
        for(let i=0;i<state.added.length;i++){
            if(state.added[i].Product['Product ID']===action.payLoad.Product.Product['Product ID']){
                obj=state.added[i];
                state.added.splice(i,1);
                state.count=state.count-action.payLoad.Product.value;
                break;
            }
        }
        if(state.added.length>0){
        localStorage.setItem('added', JSON.stringify(state.added));
        }
        else{
            localStorage.setItem('added', []);
        }
        localStorage.setItem('count', state.count);
        return {...state,'added':state.added,'count':state.count,'current':obj};
    }
// To toggle visibility of cart
    else if(action.type==='cartChange'){
        if(!state.visible || state.visible===0){
            return {...state,'visible':1};
        }
        else if(state.visible===1){
            return{...state,'visible':0};
        }
    }
// To toggle brands in search pane
    else if(action.type=='brand'){
        if(state.brands){
            if(state.brands.indexOf(action.payLoad)==-1){
                let brand=state.brands;
                brand.push(action.payLoad);
                state={...state,'brands':brand,'bcount':brand.length,'applied':true};
            }
            else{
				let applied = true;
				let filtercount = state.filtercount;
				if (!state.ccount && !(--state.bcount)) {
					applied = false;
					filtercount = null;
				}
                let brand=state.brands;
                brand.splice(brand.indexOf(action.payLoad),1);
                state={...state,'brands':brand,'bcount':brand.length,'applied':applied,'filtercount':filtercount};
            }
        }
        else{
            state={...state,'brands':[action.payLoad],'bcount':1};
        }
        return {...state};
    }
// To toggle brands in search pane
    else if(action.type=='category'){
        if(state.categories){
            if(state.categories.indexOf(action.payLoad)==-1){
                let category=state.categories;
                category.push(action.payLoad);
                state={...state,'categories':category,'ccount':category.length,'applied': true};
            }
			else {
				let applied = true;
				let filtercount = state.filtercount;
				if (!(--state.ccount) && !state.bcount) {
					applied = false;
					filtercount = null;
				}
				let category = state.categories;
				category.splice(category.indexOf(action.payLoad), 1);
				state = { ...state, 'categories': category, 'ccount': category.length, 'applied': applied, 'filtercount': filtercount };
			}
        }
        else{
            state={...state,'categories':[action.payLoad],'ccount':1};
        }
        return {...state};
	}
	else if (action.type == 'filter') {
		let arr = [...action.payLoad];
		state = { ...state, 'filter': arr, 'filtercount': arr.length };
	}
	else if (action.type == 'clearFilter') {
		state = { ...state, 'categories': [], 'brands': [], 'ccount': 0, 'bcount': 0, 'applied': false, 'filter': [], 'filtercount': null };
	}
    else if(action.type=='price'){
        if(state.prices){
            var price=null;
            if(action.payLoad.high==null){
                price=action.payLoad.low;
            }
            else{
                price=action.payLoad.high;
            }
            if(state.prices.indexOf(price)!=-1){
                state={...state,'prices':[],plow:null,phigh:null,'pcount':0};
            }
            else{
                state={...state,'prices':[price],plow:action.payLoad.low,phigh:action.payLoad.high};
            }
        }
        else{
            var price=null;
            if(action.payLoad.high==null){
                price=action.payLoad.low;
            }
            else{
                price=action.payLoad.high;
            }
            state={...state,'pcount':1,'prices':[price],plow:action.payLoad.low,phigh:action.payLoad.high};
        }
        return {...state};
    }
    
    else if(action.type=='pay'){
            state={...state,'payStart':action.payLoad};
            return {...state};
    }
    else if(action.type==='user_data'){
        state={...state,'user':action.payLoad};
        return {...state};
    }
    else if(action.type=='hidepane'){
        if(state.pane=='found'){
            state={...state,'pane':''};
        }
        else{
            state={...state,'pane':'found'};
        }
        return {...state};
    } else if(action.type === 'set_address'){
        state = {
            ...state,
            'address': action.payLoad
        };
        return {...state};
    }

    return state;

}

//Reducer for searchfield

const initialStateSearch = {
    searchField: ''
}

export const searchProducts = (state=initialStateSearch, action={}) =>{
    switch(action.type){
        case CHANGE_SEARCHFIELD:
            return Object.assign({}, state, {searchField:action.payload});

        default: 
            return state;
    }
}

//Reducer for storing search Results

const initialStateProducts = {
    isPending: false,
    searchProductResults: {},
    error: ''
}

export const requestProductsOnSearch =(state=initialStateProducts, action={}) => {
    switch(action.type) {
        case REQUEST_PRODUCTS_PENDING:
            return Object.assign({}, state, {isPending: true})
        case REQUEST_PRODUCTS_SUCCESS:
            return Object.assign({}, state, {searchProductResults: action.payload, isPending: false})
        case REQUEST_PRODUCTS_FAIL:
            return Object.assign({}, state, {error: action.payload, isPending: false})

        default: return state;
    }
}