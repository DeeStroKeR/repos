import React from "react";
import {
  Header,
  Card,
  Loader,
  Grid,
  Button,
  Container,
  Segment,
  Icon,
} from "semantic-ui-react";
import ProjectItem from "./ProjectItem";

class ProjectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(process.env.REACT_APP_API_LINK + "projects", requestOptions)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          items: json,
          isLoaded: true,
        });
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const { isLoaded, items } = this.state;

    if (!isLoaded)
      return (
        <div className="own-container">
          <Grid>
            <Grid.Column width={12}>
              <Header size="huge" as="h1">
                Projects
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right" width={4}>
              <Button
                style={{ backgroundColor: "#489FB5" }}
                href="/new/project"
                positive
              >
                + New Project
              </Button>
            </Grid.Column>
          </Grid>
          <Loader active>Loading</Loader>
        </div>
      );

    return (
      <div className="own-container">
        <Grid>
          <Grid.Column width={12}>
            <Header size="huge" as="h1">
              Projects
            </Header>
          </Grid.Column>
          <Grid.Column textAlign="right" width={4}>
            <Button
              style={{ backgroundColor: "#489FB5" }}
              href="/new/project"
              positive
            >
              + New Project
            </Button>
          </Grid.Column>
        </Grid>

        {items.length == 0 ? (
          <Segment placeholder>
            <Header icon>
              <Icon name="folder open" />
              There are no projects created.
            </Header>
          </Segment>
        ) : (
          <Card.Group style={{ marginTop: "3em" }} itemsPerRow={3}>
            {items.map((item) => (
              <ProjectItem
                key={item.ProjectName}
                title={item.ProjectName}
                description={item.ProjectDescription}
                repoCount={item.repoCount}
              />
            ))}
          </Card.Group>
        )}
      </div>
    );
  }
}

export default ProjectList;
