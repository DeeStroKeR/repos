import React from "react";
import { Loader, Table, Icon, Button } from "semantic-ui-react";
import { Redirect } from "react-router-dom";

class DirectoryItems extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      isLoaded: false,
      isFound: true,
      isEmpty: false,
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
        this.props.projectName +
        "/repositories/" +
        this.props.repositoryName +
        "/tree/" +
        this.props.defaultBranch +
        "/?path=" +
        this.props.path,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          if (json["error"].includes("CommitDoesNotExistException")) {
            this.setState({
              items: json,
              isLoaded: true,
              isEmpty: true,
            });
          } else {
            this.setState({
              items: json,
              isLoaded: true,
              isFound: false,
            });
          }
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
    const { isLoaded, items, isFound, isEmpty } = this.state;

    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (!isFound) return <Redirect to="/404" />;
    if (isEmpty) return <></>; // TODO: empty directory
    return (
      <>
        <Table striped>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {items.subFolders.map((item) => (
              <Table.Row key={item.relativePath}>
                <Table.Cell>
                  <Icon name="folder" />{" "}
                  <a
                    href={
                      "/projects/" +
                      this.props.projectName +
                      "/repositories/" +
                      this.props.repositoryName +
                      "/tree/" +
                      this.props.defaultBranch +
                      "/" +
                      item.absolutePath
                    }
                  >
                    {item.relativePath}
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
            {items.files.map((item) => (
              <Table.Row key={item.relativePath}>
                <Table.Cell>
                  <Icon name="file outline" />
                  <a
                    href={
                      "/projects/" +
                      this.props.projectName +
                      "/repositories/" +
                      this.props.repositoryName +
                      "/blob/" +
                      this.props.defaultBranch +
                      "/" +
                      item.absolutePath
                    }
                  >
                    {item.relativePath}
                  </a>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </>
    );
  }
}

export default DirectoryItems;
