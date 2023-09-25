/*
            商城範例
        */

let shop = {
    'allProducts': [],
    'addToCartButtons': [], // 由於此按鈕現在是被 js 加到 HTML 中的, 稍後在 getElements() 中再選擇

    'cartToggle': null, // 選擇 #cart-toggle, 即展開/關閉購物車的 button
    'productsContainer': null, // 選擇 #products-container, 即裝有商品的 div
    'addedProductsContainer': null, // 選擇 #added-products-container, 即裝有購物車中商品的 div
    'cartAmount': null, // 選擇 #cart-amount, 即裝有購物車中商品數量的 span
    'cartSubtotal': null, // 選擇 #cart-subtotal, 即裝有購物車中商品總價的 span

    'checkoutButton': null, // 先不用選, 最後送出購物車中商品的按鈕
    'cookieName': 'cartItems',
    'urls': {
        'getProducts': 'https://cart-handler.weihaowang.work/api/products',
        'submit': 'https://cart-handler.weihaowang.work/api/cartHandler',
    },
    'cart': {
        'items': [],  // 加入購物車的商品的 id
        'subtotal': 0, // 加入購物車的商品的總價
        'amount': 0    // 加入購物車的商品的數量
    },
    'init': function (productsInCookie) {
        // fetch products
        this.fetchProducts();
        // console.log(this.allProducts);
        this.renderElements();
        this.getElements();
        this.addListeners();
        if (productsInCookie) {
            for (let p_id_in_cookie of productsInCookie) {
                shop.updateCart(p_id_in_cookie);
            }
        }
        this.setup_search();
    },
    'renderElements': function () {
        /*
            1.
        */
        for (let i = 0; i < this.allProducts.length; i++) {
            // console.log(products[i].thumbnail);
            document.getElementById('products-container').innerHTML +=
                `<div class="product" id="product-${(i + 1)}">
                <div class="product-thumbnail-wrapper"><img class="product-thumbnail" src=${this.allProducts[i].thumbnail}></div>
                <div class="product-name">${this.allProducts[i].title}</div>
                <div class="product-price-wrapper"><span class="product-price">${this.allProducts[i].price}</span> 元</div>
                <input type="number" id="product_${i + 1}_n" placeholder="0" step="1" min="0" value="0"/><button class="add-to-cart-button" productId = "${this.allProducts[i].id}">加入購物車</button></div>`
        }
    },
    'getElements': function () {
        this.addToCartButtons = document.getElementsByClassName('add-to-cart-button');
    },
    'addListeners': function () {
        /*
            2
        */
        for (let i = 0; i < this.addToCartButtons.length; i++) {
            this.addToCartButtons[i].addEventListener('click', () => {
                let tmp = document.getElementById('product_' + (i + 1) + '_n');
                // console.log('product_' + (i + 1) + '_n :' + tmp);
                // console.log(tmp.value);
                for (let c = 0; c < tmp.value; c++) {
                    this.updateCart(this.allProducts[i]['id']);
                }
            })
        }
        /*
            3
        */
        let toggleCartBtn = document.getElementById('cart-toggle');
        toggleCartBtn.addEventListener('click', () => {
            document.body.classList.toggle("viewing-cart");
        })


    },
    'updateCart': function (p_id) {
        for (let i = 0; i < this.allProducts.length; i++) {
            if (this.allProducts[i].id == p_id) {
                // let toggleCartBtn = document.getElementById('cart-toggle');
                // toggleCartBtn.addEventListener('click', () => {
                //     document.body.classList.toggle("viewing-cart");
                // })
                this.cart.items.push(p_id);
                this.cart.subtotal += this.allProducts[i].price;
                this.cart.amount += 1;
                this.updateCartUI(this.allProducts[i].title, this.allProducts[i].price);
                /* 
                    更新 cookie 
                */
                setCookie(shop.cookieName, JSON.stringify(this.cart.items));
            }
        }
    },
    'updateCartUI': function (p_name, p_price) {
        let added_container = document.getElementById('added-products-container');
        added_container.innerHTML += `<div class="added-product">
                        <span class="added-product-title">${p_name}</span>
                        <span class="added-product-price">${p_price}</span>
                    </div>`;
        (document.getElementById('cart-amount')).innerText = Number((document.getElementById('cart-amount')).innerText) + Number(1);
        (document.getElementById('cart-subtotal')).innerText = Number((document.getElementById('cart-subtotal')).innerText) + Number(p_price);
    },
    'fetchProducts': function () {
        // 從資料庫請求商品資料
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState == 4) {
                if (request.status === 200) {
                    // request 成功, 開始處理 response
                    console.log("request 成功, 開始處理 response");
                    let json = JSON.parse(request.responseText);
                } else {
                }
            }
            else {
            }
        });

        request.open("GET", this.urls.getProducts, false); // open() 還能接受第三個參數, 是用以表示這個 request 是否為 asynchronous (非同步) 的布林值, 預設為 true
        request.send();
        this.allProducts = JSON.parse(request.responseText);
    },
    'submit': function () {
        console.log("cart.submit()");
        // HTTP POST the item in cart
        let request = new XMLHttpRequest();
        request.addEventListener('readystatechange', function () {
            if (request.readyState == 4) {
                if (request.status === 200) {
                    // request 成功, 開始處理 response
                    console.log("request 成功, 開始處理 response");
                    let json = JSON.parse(request.responseText); // request.responseText 也有可能不是 JSON 的形式, 這取決於撰寫 API 的人怎麼想
                    console.log(json);
                } else {
                    // request 失敗
                    // 可能是 404 (Not Found) 或
                    // 500 (Internal Server Error) 等原因
                    console.log(request.responseText);
                }
            }
            else {
                // readyState 可能是 1 到 3
                // request 還沒完成 . . .
            }
        });
        // JSON.strignify what is in cookie;
        let data = {
            'items': [],
            'subtotal': '3089',
            'token': "da58568e70c64145e15db5bd50f257a6ae93d3863303db3125afe841e674a910"
        }
        data.items = JSON.parse(getCookie(shop.cookieName));
        // add subtotal;
        data.subtotal = 0;
        for (let x = 0; x < data.items.length; x++) {
            data.subtotal += this.allProducts[x].price;
        }
        data = JSON.stringify(data);
        request.open("POST", shop.urls.submit, false);
        request.setRequestHeader('Content-type', 'application/json');

        request.send(data);
        // erase cookie;
        eraseCookie(shop.cookieName);
    },
    'setup_search': function () {
        document.getElementById('search_btn').addEventListener('click', () => {
            // get value of search_input
            let search_pattern = document.getElementById('search_input').value;
            if (search_pattern == "") return;
            // use regex to find is there match in allProducts?
            let reg = new RegExp(search_pattern);
            for (let p of this.allProducts) {
                // console.log(p);
                if (reg.test(p.title)) {
                    document.getElementById('product-' + p.id).setAttribute("class", "product");
                }
                else {
                    document.getElementById('product-' + p.id).setAttribute("class", "product_h");
                }
            }
        });

        document.getElementById('reset_btn').addEventListener('click', () => {
            // get value of search_input
            document.getElementById('search_input').value = "";
            for (let p of this.allProducts) {
                document.getElementById('product-' + p.id).setAttribute("class", "product");
            }
        });
    }
}