import React from "react";
import { Container, Header, Divider } from "semantic-ui-react";
import Changelog from "./Changelog";
const Home = () => (
  <>
    <Container text fluid style={{ marginTop: "7em" }}>
      <Header as="h1">Cloud-Git</Header>
      <Header as="h3">
        Customer ID:{" "}
        {process.env.REACT_APP_API_LINK.substring(
          1 +
            process.env.REACT_APP_API_LINK.substring(
              0,
              process.env.REACT_APP_API_LINK.length - 1
            ).lastIndexOf("/"),
          process.env.REACT_APP_API_LINK.length - 1
        )}
      </Header>
      Current version: v1.0.0
      <Divider></Divider>
      <Header as='h3'>Changelog</Header>
      <Changelog/>
    </Container>
  </>
);

export default Home;
