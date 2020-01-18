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
  Container
} from "semantic-ui-react";
import { to2DP } from "./components/utils";

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("./data/products.json");
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <React.Fragment>
    <Menu fixed="right" vertical compact>
      <Menu.Item>
      <CartButton/></Menu.Item>
    </Menu>
      <Container>
        <Segment>
          <Catalog products={products} />
        </Segment>
      </Container>
    </React.Fragment>
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
        <Card.Meta textAlign="center">{product.description}</Card.Meta>
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
      <Button>{size}</Button>
    ))}
  </Button.Group>
);

const CartButton = () => <Button icon="shopping cart" />;

const ShoppingCart = () => {
  const [visible, setVisible] = { name: "visible" };

  return <Sidebar></Sidebar>;
};

export default App;
