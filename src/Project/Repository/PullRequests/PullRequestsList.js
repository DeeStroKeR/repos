import React from "react";
import {Breadcrumb, Button, Grid, Header, Icon, Label, List, Loader,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../CustomMenu";

class PullRequestsList extends React.Component {
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
    const requestOptions = {
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
        "/pulls",
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
            items: json,
            isLoaded: true,
          });
        }
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    const {isLoaded, isFound, isEmpty, repoInfo, items} = this.state;

    if (!isFound) return <Redirect to="/404"/>;
    if (!isLoaded)
      return (
          <>
            <Loader active>Loading</Loader>
          </>
      );
    if (isEmpty) return <></>; // TODO: empty pulls

    return (
        <>
          <Grid padded>
            <Grid.Column
              style={{display: "flex", alignItems: "center"}}
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

              <Button
                style={{backgroundColor: "#489FB5"}}
                href=
                    {"/new/projects/" +
                    this.props.match.params.project_name +
                    "/repositories/" + this.props.match.params.repository_name + "/pullrequests/"}
                id="crt-pulls-btn"
                positive
              >
                + New pull request
              </Button>

              <Header as="h2">Pull Requests List</Header>

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
                  <List.Item
                    key={item.PK}
                    href={
                      "/projects/" +
                      this.props.match.params.project_name +
                      "/repositories/" +
                      this.props.match.params.repository_name +
                      "/pullrequests/" +
                      item.pullRequestId
                    }
                  >
                    <List.Content>
                      <List.Header as="h5">
                        { item.mergeCommit != "" && <Label size='mini' id="mergeCommitlbl"  ribbon="right">Merged</Label>}
                        {item.PK}{" "}
                      </List.Header>
                      <List.Description>
                        Status : {item.status}
                      </List.Description>
                      <Label size='mini' id="label-branch">{item.sourceBranch}</Label>
                      <Icon name="angle double right" size='small'/>
                      <Label size='mini'>{item.destinationBranch}</Label>
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

export default PullRequestsList;
