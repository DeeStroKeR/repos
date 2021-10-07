import React from "react";
import {Breadcrumb, Button, Grid, Header, Label, List, Loader,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../CustomMenu";

class CommitsList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      items: [],
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      mode: "cors",
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name,
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          this.setState({
            isFound: false,
          });
        } else {
          this.setState({
            repoInfo: json,
            isLoaded: true,
          });
        }
      })
      .catch((error) => console.log("error", error));

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/commits",
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          this.setState({
            isFound: false,
          });
        } else {
          json = json.sort(function (a, b) {
            var x = a.commitDate;
            var y = b.commitDate;
            return x > y ? -1 : x < y ? 1 : 0;
          });
          this.setState({
            items: json,
            isLoaded: true,
          });
        }
      })
      .catch((error) => console.log("error", error));
  }

  createBranch(project_name, repository_name, commitId) {
    let branchName = prompt("Enter branch name");
    console.log(commitId);

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        project_name +
        "/repositories/" +
        repository_name +
        "/branches",
      {
        method: "POST",
        body: JSON.stringify({
          username: "admin",
          commitId: commitId,
          branchName: branchName,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      try {
        const data = await response.text();
        if (!response.ok) {
          alert(JSON.parse(data)["error"]);
        } else {
          alert("The branch has been successfully created!");
        }
      } catch (e) {
        console.log(this.state);
        console.log(e);
        alert(e);
        return;
      }
    });
  }

  render() {
    const { isLoaded, isFound, isEmpty, repoInfo, items } = this.state;

    if (!isFound) return <Redirect to="/404" />;
    if (!isLoaded)
      return (
        <>
          <Loader active>Loading</Loader>
        </>
      );
    if (isEmpty) return <></>; // TODO: empty directory
    return (
      <>
        <Grid padded>
          <Grid.Column
            style={{ display: "flex", alignItems: "center" }}
            verticalAlign="top"
            width={3}
          >
            <CustomMenu
              project_name={this.props.match.params.project_name}
              repository_name={this.props.match.params.repository_name}
              count_commits={repoInfo.countCommits}
              count_pulls={repoInfo.countPulls}
              count_branches={repoInfo.countBranches}
            />
          </Grid.Column>
          <Grid.Column width={9}>
            <Header size="huge" as="h1">
              {this.props.match.params.repository_name}
            </Header>
            <Header as="h2">Commits list</Header>
            <Breadcrumb size="large">
              <Breadcrumb.Section
                href={"/projects/" + this.props.match.params.project_name}
              >
                {this.props.match.params.project_name}
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right chevron" />
              <Breadcrumb.Section
                href={
                  "/projects/" +
                  this.props.match.params.project_name +
                  "/repositories/" +
                  this.props.match.params.repository_name
                }
              >
                {this.props.match.params.repository_name}
              </Breadcrumb.Section>
            </Breadcrumb>
            <List style={{ marginTop: "2em" }} divided relaxed>
              {items.map((item) => (
                <List.Item key={item.commitId}
                >
                  <List.Content floated="left">
                    <List.Header as="a"
                    href={
                    "/projects/" +
                    this.props.match.params.project_name +
                    "/repositories/" +
                    this.props.match.params.repository_name +
                    "/commits/" +
                    item.commitId
                  }>{item.commitId}</List.Header>
                    <List.Description as="a">
                      {item.commitMessage} |{" "}
                      {new Date(item.commitDate * 1000).toLocaleString()}
                      {item.tags.map((it) => (
                        <Label color="blue" circular
                                key={it.PK}
                        >
                          <a href={ "/projects/" +
                            this.props.match.params.project_name +
                            "/repositories/" +
                            this.props.match.params.repository_name +
                            '/tags/'+ it.value +"/tree/"}>
                              {it.value}
                           </a>
                        </Label>
                      ))}
                    </List.Description>
                  </List.Content>
                  <List.Content floated="right">
                    <Button
                      onClick={() =>
                        this.createBranch(
                          this.props.match.params.project_name,
                          this.props.match.params.repository_name,
                          item.commitId
                        )
                      }
                    >
                      Create branch
                    </Button>
                  </List.Content>
                </List.Item>
              ))}
            </List>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default CommitsList;
