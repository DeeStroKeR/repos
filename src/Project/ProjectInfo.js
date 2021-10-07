import React, { createRef } from "react";
import {
  Header,
  Grid,
  Button,
  Loader,
} from "semantic-ui-react";
import RepositoryList from "./RepositoryList";

class ProjectInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      contextRef: createRef(),
      item: "",
      isLoaded: false,
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          item: json,
          isLoaded: true,
        });
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const { isLoaded, item, contextRef } = this.state;
    if (!isLoaded)
      return (
        <div className="own-container">
            <Grid>
              <Grid.Column width={11}>
                <Header size="huge" as="h1">
                  {this.props.match.params.project_name}
                </Header>
              </Grid.Column>
              <Grid.Column width={5}></Grid.Column>
              <Loader active>Loading</Loader>
            </Grid>
            <RepositoryList project={this.props.match.params.project_name} />
        </div>
      );

    return (
      <div className="own-container">
          <Grid>
            <Grid.Column width={11}>
              <Header size="huge" as="h1">
                {this.props.match.params.project_name}
              </Header>
            </Grid.Column>
            <Grid.Column textAlign="right" width={5}>
              {item.count_repos !== 0 ? (
                <Button
                  href={
                    "/new/project/" +
                    this.props.match.params.project_name +
                    "/repository"
                  }
                  style={{ backgroundColor: "#489FB5", color: "white" }}
                >
                  + New repository
                </Button>
              ) : (
                <></>
              )}
            </Grid.Column>
            <p>{item.ProjectDescription}</p>
          </Grid>
          <RepositoryList project={this.props.match.params.project_name} />
        </div>
    );
  }
}

export default ProjectInfo;
