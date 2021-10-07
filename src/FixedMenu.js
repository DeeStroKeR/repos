import React from "react";
import { Container, Menu, Label, Grid } from "semantic-ui-react";

const FixedMenu = () =>  (
  <>
    <Menu
      borderless
      fixed="top"
      style={{ backgroundColor: "#489FB5" }}
      size={"massive"}
      inverted
    >
      <div style={{ width: "19vw" }} />
      <Menu.Item fitted={"horizontally"} as="a" href="/" header>
        <object
          style={{
            pointerEvents: "none",
            maxWidth: "124px",
            maxHeight: "30px",
            marginRight: "20px",
          }}
          href="/"
          data="/Cloud-Git-logo.svg"
          type="image/svg+xml"
        ></object>
      </Menu.Item>
      <Menu.Item style={{ fontSize: "1rem" }} as="a" href="/projects">
        Projects
      </Menu.Item>
      <Menu.Item style={{ fontSize: "1rem" }} as="a">
        Settings
      </Menu.Item>
    </Menu>
  </>
);
export default FixedMenu;
