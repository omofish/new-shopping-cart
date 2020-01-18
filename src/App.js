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
  Grid,
  Icon,
  GridColumn,
  Container,
  CardContent
} from "semantic-ui-react";
import { to2DP } from "./components/utils";

const fixedOverlayStyle = {
  border: "none",
  borderRadius: 0,
  boxShadow: "none",
  position: "fixed",
  zIndex: 10
};

const App = () => {
  const [data, setData] = useState({});
  const [cartOpen, setCartOpen] = useState(true);
  const products = Object.values(data);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
      setCartItems([
        { sku: "12064273040195392", price: 10.9, quantity: 2 },
        { sku: "51498472915966370", price: 29.45, quantity: 1 }
      ]);
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
        <ShoppingCart cartItems={cartItems} data={data} />
      </Sidebar>

      <Sidebar.Pusher>
        <Menu style={fixedOverlayStyle} borderless>
          <Menu.Item>
            <CartButton />
          </Menu.Item>
        </Menu>
        <Container>
          <Segment>
            <Catalog products={products} />
          </Segment>
        </Container>
      </Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

const Catalog = ({ products }) => (
  <Card.Group centered itemsPerRow="4" stackable>
    {products.map(product => (
      <Product key={product.sku} product={product} />
    ))}
  </Card.Group>
);

const Product = ({ product }) => {
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
        <SizeButtons />
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

const SizeButtons = () => (
  <Button.Group fluid>
    {Object.keys(sizes).map(size => (
      <Button key={size}>{size}</Button>
    ))}
  </Button.Group>
);

const CartButton = () => <Button icon="shopping cart" />;

const ShoppingCart = ({ cartItems, data }) => {
  return (
    <Segment.Group>
      <Segment>
        <Header>Shopping Cart</Header>
      </Segment>
      <Segment>
        <Card.Group itemsPerRow="1">
          {cartItems.map(item => (
            <CartItem
              key={item.sku}
              quantity={item.quantity}
              price={item.price}
              product={data[item.sku]}
            />
          ))}
        </Card.Group>
      </Segment>
      <Segment attached="bottom">
        <Header size="large">Total Cost</Header>
        <Header><TotalCost cartItems={cartItems}/></Header>
      </Segment>
    </Segment.Group>
  );
};

const CartItem = ({ quantity, product, price }) => {
  const imageURL = "data/products/" + product.sku + "_2.jpg";
  const priceDisp = "$" + to2DP(price);

  return (
    <Card>
      <Card.Content>
        <Image src={imageURL} size="tiny" floated="left" />
        <Button icon="x" floated="right" />
        <Card.Header>{product.title}</Card.Header>
        <Card.Meta>{product.style}</Card.Meta>
        <Header size="large" color="blue">
          {priceDisp}
        </Header>
        <Header floated="left">Quantity: {quantity}</Header>
        <Button.Group size="mini">
          <Button icon="minus" />
          <Button icon="plus" />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

const TotalCost = ({cartItems}) => {
  let total = 0;
  if (cartItems) {
    cartItems.forEach(item => {
      total += item.price * item.quantity;
    });
    total = "$" + to2DP(total);
  }
  return(cartItems ? total : "$0.00")};

export default App;
