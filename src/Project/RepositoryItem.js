import React from "react";
import { Card, Button, Grid, Label, Icon } from "semantic-ui-react";

const RepositoryItem = (props) => (
  <Card>
    <Card.Content>
      <Card.Header
        href={props.projectName + "/repositories/" + props.title}
        className="link header"
      > {props.title}
      </Card.Header>{" "}
      <Card.Description>
        {props.description}
        <br />
      </Card.Description>
    </Card.Content>
    <Card.Content textAlign={"center"} extra>
      <Grid>
        <Grid.Column width={8}>
          <Button
            as="button"
            fluid
            href={
              props.projectName + "/repositories/" + props.title + "/branches/"
            }
            basic
            className="basicButton"
          >
            {props.branchCount} Branches
          </Button>
        </Grid.Column>
        <Grid.Column width={8}>
          <Button
            style={{
              boxShadow: "0 0 0 1px #489FB5",
              backgroundColor: "#fff",
              color: "#489FB5",
            }}
            fluid
            basic
            href={
              props.projectName + "/repositories/" + props.title + "/commits/"
            }
            className="basicButton"
          >
            <span>{props.commitCount} Commits</span>
          </Button>
        </Grid.Column>
      </Grid>
    </Card.Content>
  </Card>
);

export default RepositoryItem;
