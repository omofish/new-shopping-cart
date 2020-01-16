import React, { useEffect, useState } from "react";
import 'semantic-ui-css/semantic.min.css'
import { Header, Card } from "semantic-ui-react";

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

const Product = ({ product }) => (
  <Card>
    <Card.Content>
      <Card.Header>{product.title}</Card.Header>
      <Card.Description>{product.sku}</Card.Description>
    </Card.Content>
  </Card>
);

export default App;
