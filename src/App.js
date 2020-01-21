import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import {
  Card,
  Image,
  Header,
  Sidebar,
  Button,
  Menu,
  Segment,
  Icon,
  Container
} from "semantic-ui-react";
import { to2DP } from "./components/utils";

const fixedOverlayStyle = {
  border: "none",
  borderRadius: 0,
  boxShadow: "none",
  position: "fixed",
  margin: "10px",
  zIndex: 10
};

const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(false);
  const products = Object.values(data);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
      // setCartItems([
      //   { sku: "12064273040195392", price: 10.9, size: "M", quantity: 2 },
      //   { sku: "51498472915966370", price: 29.45, size: "M", quantity: 1 }
      // ]);
    };
    fetchProducts();
  }, []);

  return (
    <Sidebar.Pushable as={Segment}>
      <Sidebar
        width="very wide"
        animation="push"
        icon="labeled"
        visible={cartOpen}
      >
        <ShoppingCart state={{ cartItems, setCartItems }} data={data} />
      </Sidebar>

      <Sidebar.Pusher>
        <Menu style={fixedOverlayStyle} borderless>
          <Menu.Item>
            <CartButton state={{ cartOpen, setCartOpen }} />
          </Menu.Item>
        </Menu>
        <Container>
          <Segment>
            <Catalog
              products={products}
              state={{ cartItems, setCartItems }}
              cartOpenState={{ cartOpen, setCartOpen }}
            />
          </Segment>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const Catalog = ({ products, state, cartOpenState }) => (
  <Card.Group centered itemsPerRow="4" stackable>
    {products.map(product => (
      <Product
        key={product.sku}
        product={product}
        state={state}
        cartOpenState={cartOpenState}
      />
    ))}
  </Card.Group>
);

const Product = ({ product, state, cartOpenState }) => {
  const imageURL = "data/products/" + product.sku + "_2.jpg";
  const price = "$" + to2DP(product.price);

  return (
    <Card>
      <Image src={imageURL} wrapped ui={false} />
      <Card.Content>
        <Card.Header textAlign="center">{product.title}</Card.Header>
        <Card.Meta textAlign="center">{product.style}</Card.Meta>
      </Card.Content>
      <Card.Content extra>
        <Header textAlign="center">{price}</Header>
        <SizeButtons
          product={product}
          state={state}
          cartOpenState={cartOpenState}
        />
      </Card.Content>
    </Card>
  );
};

const sizes = {
  S: "Small",
  M: "Medium",
  L: "Large",
  XL: "Extra Large"
};

const SizeButtons = ({ product, state, cartOpenState }) => (
  <Button.Group fluid>
    {Object.keys(sizes).map(size => (
      <Button
        key={size}
        onClick={() => {
          let match = false;
          const newCartItems = state.cartItems.map(item => {
            if (item.sku === product.sku && item.size === size) {
              item.quantity++;
              match = true;
              return item;
            } else return item;
          });
          state.setCartItems(newCartItems);
          // if none are found to be the same, create new entry
          if (!match) {
            const newItem = {
              sku: product.sku,
              price: product.price,
              size: size,
              quantity: 1
            };
            state.setCartItems(state.cartItems.concat([newItem]));
          }
          cartOpenState.setCartOpen(true);
        }}
      >
        {size}
      </Button>
    ))}
  </Button.Group>
);

const CartButton = ({ state }) => (
  <Button
    toggle
    active={!state.cartOpen}
    size="huge"
    icon
    labelPosition="left"
    onClick={() => state.setCartOpen(!state.cartOpen)}
  >
    <Icon name={state.cartOpen ? "x" : "shopping cart"} />
    Cart
  </Button>
);

const ShoppingCart = ({ state, data }) => {
  return (
    <Segment.Group>
      <Segment>
        <Header>Shopping Cart</Header>
      </Segment>
      <Segment>
        <Card.Group itemsPerRow="1">
          {state.cartItems.map(item => (
            <CartItem
              key={item.sku + item.size}
              item={item}
              state={state}
              product={data[item.sku]}
            />
          ))}
        </Card.Group>
      </Segment>
      <Segment attached="bottom" clearing>
        <Header size="large">Total Cost</Header>
        <Header>
          <TotalCost cartItems={state.cartItems} />
        </Header>
        <Button floated="right" positive>
          Checkout
        </Button>
      </Segment>
    </Segment.Group>
  );
};

const CartItem = ({ item: t, product, state }) => {
  const imageURL = "data/products/" + product.sku + "_2.jpg";
  const priceDisp = "$" + to2DP(t.price);

  return (
    <Card>
      <Card.Content>
        <Image src={imageURL} size="tiny" floated="left" />
        <Button
          icon="x"
          floated="right"
          onClick={() =>
            state.setCartItems(
              state.cartItems.filter(
                x => !(x.sku === t.sku && x.size === t.size)
              )
            )
          }
        />
        <Card.Header>
          {product.title} ({t.size})
        </Card.Header>
        <Card.Meta>{product.style}</Card.Meta>
        <Header size="large" color="blue">
          {priceDisp}
        </Header>
        <Header floated="left">Quantity: {t.quantity}</Header>
        <Button.Group size="mini">
          <Button icon="minus" onClick={() => {
            state.setCartItems(state.cartItems.map(x => {
              if (x.sku === t.sku && x.size === t.size) {
                x.quantity--;
                return x;
              } else return x;
            }))
          }} />
          <Button icon="plus" onClick={() => {
            state.setCartItems(state.cartItems.map(x => {
              if (x.sku === t.sku && x.size === t.size) {
                x.quantity++;
                return x;
              } else return x;
            }))
          }}/>
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

const TotalCost = ({ cartItems }) => {
  let total = 0;
  if (cartItems) {
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    total = "$" + to2DP(total);
  }
  return cartItems ? total : "$0.00";
};

export default App;
