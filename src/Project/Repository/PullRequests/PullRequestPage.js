import React from "react";
import {Breadcrumb, Button, Grid, Header, Icon, Label, List, Loader, Segment,} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import CustomMenu from "../CustomMenu";

class PullRequestPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      item: {},
      difference: [],
      iconName: "",
      pullStatus: "",
      diffEmpty:false,
      mergeCommit: {}
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

    //other
    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/pulls/" + this.props.match.params.pullRequestId,
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
            item: json,
            isLoaded: true,
          });debugger
          return json.status
        }
      }).then((status) => {
        if (status === "OPEN"){
          fetch(
            process.env.REACT_APP_API_LINK +
              "projects/" +
              this.props.match.params.project_name +
              "/repositories/" +
              this.props.match.params.repository_name +
              "/branches/" + this.state.item.sourceBranch + "/differences/" + this.state.item.destinationBranch + "/",
            requestOptions
          )
            .then((response) => response.json())
            .then((json) => {
              if (json.hasOwnProperty("error")) {
                this.setState({
                  isFound: false,
                  diffEmpty: true,

                });
              } else {
                json = json.filter(({changeType}) => changeType !== "D");
                this.setState({
                  difference: json,
                  isLoaded: true,

                });
              }
            })
            .catch((error) => console.log("error", error));
        } else {
          fetch(
          process.env.REACT_APP_API_LINK +
            "projects/" +
            this.props.match.params.project_name +
            "/repositories/" +
            this.props.match.params.repository_name +
            "/commits/" + this.state.item.sourceCommit + "/differences/" + this.state.item.destinationCommit,
          requestOptions
          )
            .then((response) => response.json())
            .then((json) => {
              if (json.hasOwnProperty("error")) {
                this.setState({
                  isFound: false,
                  diffEmpty: true,

                });
              } else {
                json = json.filter(({changeType}) => changeType !== "D");
                this.setState({
                  difference: json,
                  isLoaded: true,

                });
              }
            }).then(() => {
              debugger
              if (this.state.item.mergeCommit) {
                this.getMergeCommit(this.state.item.mergeCommit)
              }

            })
            .catch((error) => console.log("error", error));
        }
    })
        .catch((error) => console.log("error", error));
  }


  getMergeCommit(mergeCommit) {
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
        this.props.match.params.repository_name +
        "/commits/" + mergeCommit,
      requestOptions
    ).then((response) => response.json())
      .then((json) => {
        this.setState({
          mergeCommit: {
            id: json.commitId || "",
            message: json.message || "",
            parent: json.parents[0] || "",
          },
        })
      })
  }


  handleClosePull(props) {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
      mode: "cors",
    };
    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/pulls/" + this.state.item.pullRequestId + "/close",
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
            pullStatus: json,
            isLoaded: true,
          });
        }
      }).then(() => {
        window.location.href =
        "/projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/pullrequests";
      })
      .catch((error) => console.log("error", error));
  }

  handleMergePull(props) {
    const requestOptions = {
      method: "PUT",
      redirect: "follow",
      mode: "cors",
      body: JSON.stringify({"mergeMethod":"squash"})
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/repositories/" +
        this.props.match.params.repository_name +
        "/pulls/" + this.state.item.pullRequestId + "/merge",
      requestOptions
    )
      .then((response) => response.json())
      .then((json) => {
        if (json.hasOwnProperty("error")) {
          alert(json.error);
        } else {
          this.setState({
            pullStatus: json,
            isLoaded: true,
          });
        }
      }).then(() => {
        window.location.href =
          "/projects/" +
          this.props.match.params.project_name +
          "/repositories/" +
          this.props.match.params.repository_name +
          "/pullrequests";
      })
      .catch((error) => console.log("error", error));
  }

  handleRedirect(){
    window.location.href =
      "/projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name +
      "/pullrequests";
  }

  render() {
    const {isLoaded, isFound, isEmpty, repoInfo, item, difference, diffEmpty, mergeCommit} = this.state;

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
              <Header as="h2"> Pull Request : {this.props.match.params.pullRequestId} {}</Header>

              <Breadcrumb size="large" id="pullRequestbreadcrumb">
                <Breadcrumb.Section
                    href={"/projects/" + this.props.match.params.project_name}
                >
                  {this.props.match.params.project_name}
                </Breadcrumb.Section>
                <Breadcrumb.Divider icon="right chevron"/>
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

              <Grid.Column width={12}>

                <Segment secondary>
                  {item.mergeCommit != "" && <Label size='normal' id="mergeCommitlblcard"  ribbon="right">Merged</Label>}
                  <Label size='normal' id="label-branchinside">
                    {item.sourceBranch}
                  </Label>
                  <Icon name="angle double right" size='small'/>
                  <Label size='normal' id="label-branchinside">
                    {item.destinationBranch}
                  </Label>
                  <Header size='medium'>{item.title}</Header>
                  {item.description}
                  <Header size='tiny'>Status : {item.status}</Header>
                </Segment>
                <Segment raised>
                  <List divided verticalAlign='middle'>
                    {difference.map((diff) => (
                      <List.Item
                        key={diff.beforeBlob}>

                        {diff.changeType === "A" ? <>
                          <List.Content floated='right'>
                            <Icon name="add square" id="add-file-icon"/></List.Content>
                            </>

                            :
                          (diff.changeType === "M") ? (
                            <>
                              <List.Content floated='right'>
                              <Icon name="arrow right" id="modified-file-icon"/></List.Content>
                            </>

                          ) : (
                            <>
                              <List.Content floated='right'>
                                <Icon name="delete" id="delete-file-icon"/>
                              </List.Content>
                            </>

                          )}
                          {item.mergeCommit !== "" ? (
                            <List.Content
                              href={
                                "/projects/" +
                                this.props.match.params.project_name +
                                "/repositories/" +
                                this.props.match.params.repository_name +
                                "/compare/commits/" +
                                mergeCommit.parent + "/" + item.mergeCommit +
                                "/" +
                                (diff.afterBlob || diff.beforeBlob).path
                              }
                              >
                                {(diff.afterBlob || diff.beforeBlob).path}</List.Content>
                          ) : (
                            <List.Content
                              href={
                                "/projects/" +
                                this.props.match.params.project_name +
                                "/repositories/" +
                                this.props.match.params.repository_name +
                                "/compare/commits/" +
                                item.sourceCommit + "/" + item.destinationCommit +
                                "/" +
                                (diff.afterBlob || diff.beforeBlob).path
                              }
                            >
                              {(diff.afterBlob || diff.beforeBlob).path}
                            </List.Content>
                          )}
                      </List.Item>
                    ))}
                  </List>
                </Segment>
                <Button id="btnback" basic color="teal" onClick={this.handleRedirect.bind(this)}>Back</Button>
                  {item.status !== "CLOSED" ? (
                    <>
                      <Button id = "btnmerge"  onClick={this.handleMergePull.bind(this)}>Merge</Button>,
                      <Button  basic color="teal" onClick={this.handleClosePull.bind(this)}>Close</Button>
                    </>
                ):(
                <></>
                  )}

              </Grid.Column>

            </Grid.Column>

          </Grid>
      </>
    );
  }
}

export default PullRequestPage;
