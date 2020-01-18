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

      setCartItems([json["12064273040195392"], json["51498472915966370"]]);
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
        <ShoppingCart cartItems={cartItems} />
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

const ShoppingCart = ({ cartItems }) => (
  <Segment.Group>
    <Segment>
      <Header>Shopping Cart</Header>
    </Segment>
    <Segment>
      <Card.Group itemsPerRow="1">
        {cartItems.map(product => (
          <CartItem key={product.sku} product={product} />
        ))}
      </Card.Group>
    </Segment>
  </Segment.Group>
);

const CartItem = ({ product }) => {
  const imageURL = "data/products/" + product.sku + "_2.jpg";
  const price = "$" + to2DP(product.price);

  return (
    <Card>
      <Card.Content>
        <Image src={imageURL} size="tiny" floated="left" />
        <Button icon="x" floated="right" />
        <Card.Header>{product.title}</Card.Header>
        <Card.Meta>{product.style}</Card.Meta>
        <Header size="large" color="blue">
          {price}
        </Header>
        <Header floated="left">Quantity: </Header>
        <Button.Group floated="left" compact>
          <Button icon="minus" />
          <Button icon="plus" />
        </Button.Group>
      </Card.Content>
    </Card>
  );
};

export default App;
