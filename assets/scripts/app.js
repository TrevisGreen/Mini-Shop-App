class Product {
    constructor(title, image, desc, price) {
        this.title = title;
        this.imageUrl = image;
        this.description = desc;
        this.price = price;
    }
}

class ElementAttribute {
    constructor(attrName, attrValue) {
        this.name = attrName;
        this.value = attrValue;
    }
}

class Component {
    constructor(renderHookId) {
        this.hookId = renderHookId;
    }

    createRootElement(tag, cssClasses, attributes) {
        const rootElement = document.createElement(tag);
        if(cssClasses) {
            rootElement.className = cssClasses;
        }
        if(attributes && attributes.length > 0) {
            for(const attr of attributes) {
                rootElement.setAttribute(attr.name, attr.value);
            }
        }
        document.getElementById(this.hookId).append(rootElement);
        return this.rootElement;
    }
}

class ShoppingCart extends Component {
    items = [];

    set cartItems(value) {
        this.items = value;
        this.totalOutput.innerHTML = `<h2>Total: \$${this.totalAmount.toFixed(2)}</h2>`;
    }

    get totalAmount() {
        const sum = this.items.reduce(
            (prevValue, curItem) => prevValue + curItem.price,
            0
        );
        return sum;
    }

    constructor(renderHookId) {
        super(renderHookId);
    }

    addProduct(product) {
        const updatedItems = [...this.items];
        this.items.push(product);
        this.cartItems = updatedItems;
    }

    render() {
        const cartEl = this.createRootElement('section', 'cart');
        cartEl.innerHTML = `
            <h2>Total: \$${0}</h2>
            <button>Order Now!</button>
        `;        
        this.totalOutput = cartEl.querySelector('h2');        
    }
}

class ProductItem extends Component {
    constructor(product, renderHookId) {
        super(renderHookId);
        this.product = product;
    }

    addToCart() {
        App.addProductToCart(this.product);
    }

    render() {
        const prodEl = this.createRootElement('li', 'product-item');        
        prodEl.innerHTML = `
            <div>
                <img src="${this.product.imageUrl}" alt="${this.product.title}" >
                <div class="product-item__content">
                    <h2>${this.product.title}</h2>
                    <h3>\$${this.product.price}</h3>
                    <p>${this.product.description}</p>
                    <button>Add To Cart</button>
                </div>
            </div>                    
        `;
        const addCartButton = prodEl.querySelector('button');
        addCartButton.addEventListener('click', this.addToCart.bind(this));        
    }
}

class ProductList extends Component {
    products = [
        new Product(
            'A Pillow',
            'https://i5.walmartimages.com/asr/486afa09-f825-4a7d-bcfb-b2ba7f8abf91.094c98e89bd0f6832a022bd9d6fcb700.jpeg',
            'Saints Pillow!',
            19.89
        ),
        new Product(
            'A Carpet',
            'https://www.travelsintranslation.com/wp-content/uploads/2021/02/New-Orleans-Saints-NFL-Area-Rug-Living-Room-Rug-Home-US-Decor.jpg',
            'Saints Carpet',
            69.95
        )
    ];

    constructor(renderHookId) {
        super(renderHookId);
    }

    render() {        
        this.createRootElement('ul', 'product-list', [
            new ElementAttribute('id', 'prod-list')
        ]);
        for(const prod of this.products) {
            const productItem = new ProductItem(prod, 'prod-list');
            productItem.render();
        }        
    }
}

class Shop {
    render() {
        this.cart = new ShoppingCart('app');
        this.cart.render();
        const productLst = new ProductList('app');
        productLst.render();
    }
}

class App {
    static cart;

    static init() {
        const shop = new Shop();
        shop.render();
        this.cart = shop.cart;
    }

    static addProductToCart(product) {
        this.cart.addProduct(product);
    }
}

App.init();

