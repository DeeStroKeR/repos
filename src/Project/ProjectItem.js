import React from "react";
import { Card, Icon, Button } from "semantic-ui-react";

const ProjectItem = (props) => (
  <Card key={props.ProjectName}>
    <Card.Content>
      <Card.Header>{props.title}</Card.Header>{" "}
      <Card.Description>
        {props.description}
          <p></p>
        <strong style={{ color: "#16697A" }}>
          <Icon name="folder open" />
          {props.repoCount} Repositories
        </strong>
      </Card.Description>
    </Card.Content>
    <Card.Content textAlign={"center"} extra>
      <Button
        href={"/projects/" + props.title}
        style={{ backgroundColor: "#489FB5", color: "white" }}
      >
        Open project
      </Button>
    </Card.Content>
  </Card>
);

export default ProjectItem;
