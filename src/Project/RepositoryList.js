import React from "react";
import { Card, Loader, Segment, Header, Icon, Button } from "semantic-ui-react";
import RepositoryItem from "./RepositoryItem";
import { Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
class RepositoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
      isFound: true,
      listRepository: true
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
        this.props.project +
        "/repositories",
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          this.setState({
            items: json,
            isLoaded: true,
            isFound: false,
          });
          this.renderNavItem()
        } else {
          this.setState({
            items: json,
            isLoaded: true,
          });
        }
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const { isLoaded, isFound, items } = this.state;

    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (!isFound) return <Redirect to="/404" />;
    // debugger
    return (
      <div style={{ marginTop: "2em" }}>
        {items.length == 0 ? (
          <Segment placeholder>
            <Header icon>
              <Icon name="folder open" style={{ color: "#82C0CC" }} />
              No repositories created
              <br />
              <Button
                href={
                  "/new/project/" +
                  this.props.project +
                  "/repository"
                }
                style={{ backgroundColor: "#489FB5", color: "white", marginTop: "1em" }}
              >
                + Create repository
              </Button>
            </Header>
          </Segment>
        ) : (
          <Card.Group id={"repository_list"} style={{ marginTop: "3em" }} itemsPerRow={3}>
            {items.map((item) => (
              <RepositoryItem
                key={item.repositoryName}
                projectName={this.props.project}
                title={item.repositoryName}
                description={item.repositoryDescription}
                branchCount={item.branchCount}
                commitCount={item.commitCount}
              />
            ))}
          </Card.Group>
        )}
      </div>
    );
  }
}

export default RepositoryList;
