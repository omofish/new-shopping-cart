import React, { useEffect, useState } from "react";
import "semantic-ui-css/semantic.min.css";
import { Card, Image, Header, Divider, Button } from "semantic-ui-react";
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
      <Card.Group>
        {products.map(product => (
          <Product key={product.sku} product={product} />
        ))}
      </Card.Group>
    </React.Fragment>
  );
};

const Product = ({ product }) => {
  const imageURL = "data/products/" + product.sku + "_2.jpg";
  const price = "$" + to2DP(product.price);

  return (
    <Card>
      <Image src={imageURL} wrapped ui={false}/>
      <Card.Content>
        <Card.Header textAlign="center">{product.title}</Card.Header>
        <Card.Meta textAlign="center">{product.description}</Card.Meta>
        <Card.Content>
          <Divider />
          <Header textAlign="center">{price}</Header>
        </Card.Content>
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
  <Button.Group fluid widths="10">
    <Button>S</Button>
    <Button>M</Button>
    <Button>L</Button>
    <Button>XL</Button>
  </Button.Group>
)

export default App;
