let iconCart = document.querySelector('.iconCart');
let cart = document.querySelector('.cart');
let container = document.querySelector('.container');
let close = document.querySelector('.close');

// iconCart.addEventListener('click', function(){
//     if(cart.style.right == '-100%'){
//         cart.style.right = '0';
//         container.style.transform = 'translateX(-400px)';
//     }else{
//         cart.style.right = '-100%';
//         container.style.transform = 'translateX(0)';
//     }
// })
// close.addEventListener('click', function (){
//     cart.style.right = '-100%';
//     container.style.transform = 'translateX(0)';
// })


let products = null;
// get data from file json
fetch('shop.json')
    .then(response => response.json())
    .then(data => {
        products = data;
        addDataToHTML();
})





//show datas product in list 
function addDataToHTML(){
    // remove datas default from HTML
    let listProductHTML = document.querySelector('.listshop');
    listProductHTML.innerHTML = '';

    // add new datas
    if(products != null) // if has data
    {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.classList.add('product-item');
            newProduct.innerHTML = 
            `
                        <a href="#" class="btn-wishlist"><svg width="24" height="24">
                            <use xlink:href="#heart"></use>
                          </svg></a>
                        <figure>
                          <a href="index.html" title="${product.name}">
                            <img src="${product.image}" class="tab-image">
                          </a>
                        </figure>
                        <h3>${product.name}</h3>
                        <span class="qty">1 Unit</span><span class="rating"><svg width="24" height="24"
                            class="text-primary">
                            <use xlink:href="#star-solid"></use>
                          </svg> 4.5</span>
                        <span class="price">$${product.price}</span>
                        
                          
                          <button onclick="addCart(${product.id})" class="nav-link">Add to Cart <iconify-icon icon="uil:shopping-cart"></button>`;

            listProductHTML.appendChild(newProduct);

        });
    }
}
//use cookie so the cart doesn't get lost on refresh page


let listCart = [];
function checkCart(){
    var cookieValue = document.cookie
    .split('; ')
    .find(row => row.startsWith('listCart='));
    if(cookieValue){
        listCart = JSON.parse(cookieValue.split('=')[1]);
    }else{
        listCart = [];
    }
}
checkCart();
function addCart($idProduct){
    let productsCopy = JSON.parse(JSON.stringify(products));
    //// If this product is not in the cart
    if(!listCart[$idProduct]) 
    {
        listCart[$idProduct] = productsCopy.filter(product => product.id == $idProduct)[0];
        listCart[$idProduct].quantity = 1;
    }else{
        //If this product is already in the cart.
        //I just increased the quantity
        listCart[$idProduct].quantity++;
    }
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";

    addCartToHTML();
}
addCartToHTML();
function addCartToHTML(){
    // clear data default
    let listCartHTML = document.querySelector('.listCart');
    listCartHTML.innerHTML = '';

    let totalHTML = document.querySelector('.totalQuantity');
    let totalQuantity = 0;
    // if has product in Cart
    if(listCart){
        listCart.forEach(product => {
            if(product){
                let newCart = document.createElement('div');
                newCart.classList.add('product-item');
                newCart.innerHTML = 
                    `<div style="display: grid;
                        grid-template-columns: 120px 1fr 70px;
                        align-items: center;
                        gap: 20px;
                        margin-bottom: 20px;" class="listCart">
        
                        <img style="width:100%; height: 100%;" src="${product.image}">
                        <div class="content">
                            <div class="name">${product.name}</div>
                            <div class="price">$${product.price} / 1 product</div>
                        </div>
                        <div class="quantity">
                            <button style="border:1px solid gray; border-radius: 5px; padding: 1px 8px;" onclick="changeQuantity(${product.id}, '-')">-</button>
                            <span class="value">${product.quantity}</span>
                            <button style="border:1px solid gray; border-radius: 5px;" onclick="changeQuantity(${product.id}, '+')">+</button>
                    </div>
                    </div>`;
                listCartHTML.appendChild(newCart);
                totalQuantity = totalQuantity + product.quantity;
            }
        })
    }
    totalHTML.innerText = totalQuantity;
}
function changeQuantity($idProduct, $type){
    switch ($type) {
        case '+':
            listCart[$idProduct].quantity++;
            break;
        case '-':
            listCart[$idProduct].quantity--;

            // if quantity <= 0 then remove product in cart
            if(listCart[$idProduct].quantity <= 0){
                delete listCart[$idProduct];
            }
            break;
    
        default:
            break;
    }
    // save new data in cookie
    document.cookie = "listCart=" + JSON.stringify(listCart) + "; expires=Thu, 31 Dec 2025 23:59:59 UTC; path=/;";
    // reload html view cart
    addCartToHTML();
}
