import React from "react";
import {
  Breadcrumb,
  Button,
  Confirm,
  Form,
  Grid,
  Header,
  Icon,
  IconGroup,
  Label,
  List,
  Loader,
  Message,
  Modal,
} from "semantic-ui-react";
import { Redirect, Link } from "react-router-dom";
import CustomMenu from "../CustomMenu";
import ReactDOM from "react-dom";

class BranchesList extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      isResult: false,
      items: [],
      openDelete: false,
      isDelete: false,
      deleteBranch: null,
      open: false,
      branchList: [],
      inputValue: "",
      dropDownValue: "",
      messageData: "",
      messageStatus: "",
      pullsList: [],
      isClosed: false,

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
    this.getBranches();
  }

  opendelete(data) {
    this.setState({
      openDelete: true,
      deleteBranch: data,
    });
  }

  addDizabilityButtonDelete(){
    const find_div = document.getElementsByClassName("branch_item");
  }

  closeMsgDiv() {
    const targetDiv = document.getElementById("deleteMsg");
    targetDiv.remove();
  }
  renderDeleteMessage(event, context) {
    const div = document.createElement("div");
    const find_div = document.getElementsByClassName("ui huge header");

    ReactDOM.render(
      <div className="ui message" id="deleteMsg">
        <i id="closeMsg" onClick={this.closeMsgDiv} className="close icon"></i>
        <div className="header">
          Branch {this.state.deleteBranch} was deleted
        </div>
      </div>,
      find_div[0].appendChild(div)
    );
  }

  getBranches() {
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
      "/branches",
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
          branchList: json.map(item => {
            return {key: item.GSI1PK, text: item.branchName, value: item.branchName}
          }),
          isLoaded: true,
        });
      }
    })
    .catch((error) => console.log("error", error));
  }

  createBranch(commitId, branchName) {
    fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name +
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
    ).then(async(response) => {
      debugger
      const  data = await response.text();

      if (!response.ok) {
        this.setState({
          messageData: "Cannot create branch." + JSON.parse(data)["error"], messageStatus: "negative", open: false,
        });
      } else {
        this.setState({open: false, messageData: "Branch was successfully created!", messageStatus: "positive"});
        this.getBranches();
      }
    }).then(()=> {
      setTimeout(() => {
      this.setState({
        messageData: "",
        messageStatus: "",
      });
    }, 2000);
    });
  }

  deleteBranch() {
    const requestOptions = {
      method: "DELETE",
      mode: "cors"
    };
    fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name +
      "/branches/" +
      this.state.deleteBranch,
      requestOptions
    ).then(
      () => {
        this.componentDidMount();
      },
      (error) => {
        this.setState({
          isDelete: false,
        });
      }
    );
    this.setState({openDelete: false});
    this.renderDeleteMessage();
  }

  setOpen = (open) => {
    this.setState({open});
  }

  onInputChange = (event) => {
    this.setState({inputValue: event.target.value});
  }
  onDropDownChange = (event, data) => {
    this.setState({dropDownValue: data.value});
  }

  handleSubmit = () => {
    const {inputValue, dropDownValue, items, messageData} = this.state;
    const commitId = items.find(item => item.branchName === dropDownValue).commitId
    this.createBranch(commitId, inputValue)
  }

  render() {
    const {isLoaded, isFound, isEmpty, repoInfo, items, open, branchList, messageData, messageStatus} = this.state;

    if (!isFound) return <Redirect to="/404"/>;
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
            <Header as="h2">Branches list</Header>

            <Breadcrumb size="large">
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

            <Modal 
              as={Form}
              onSubmit={e => this.handleSubmit(e)}
              onClose={() => this.setOpen(false)}
              onOpen={() => this.setOpen(true)}
              open={open}
              trigger={<Button compact id="branchlist-newbranch-btn">New Branch</Button>}
            >
              <Modal.Header>Create a new branch</Modal.Header>
              <Modal.Content>
                <Form.Input 
                  onChange={(event) => this.onInputChange(event)}
                  label="Branch name"
                  required
                  type="text"
                  placeholder="Some branch"/>
                <Form.Select
                  onChange={(event, data) => this.onDropDownChange(event, data)}
                  fluid
                  label='From Branch'
                  options={branchList}
                  placeholder='main'
                />
              </Modal.Content>
              <Modal.Actions>
                <Button color='black' onClick={() => this.setOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  content="Create"
                  labelPosition='right'
                  icon='checkmark'
                  positive
                />
              </Modal.Actions>
            </Modal>
              {messageStatus !=="" ? (
              messageStatus === "negative" ? (
                <Message negative>{messageData}</Message>
              ):(
                <Message positive>{messageData}</Message>
              )
              ):(
              <></>)}
            <List style={{marginTop: "2em"}} divided relaxed link>
              {items.map((item) => (
                item.branchName === repoInfo.defaultBranch ? (
                  <List.Item as='div' key={item.branchName}>
                    <List.Content>
                        <List.Header as="h5">
                          {item.branchName}{" "}
                        <Label color="blue" circular id={"default_marker"}>
                          default
                        </Label>
                        </List.Header>
                      <div className="branch_unit_default">
                        <List.Description
                          href={
                            "/projects/" +
                            this.props.match.params.project_name +
                            "/repositories/" +
                            this.props.match.params.repository_name +
                            "/tree/" +
                            item.branchName
                          }
                        >
                          {item.commitId}
                        </List.Description>
                        <IconGroup className={"branch_buttons_default"} as={"div"}>
                          <div className = "branch_buttons_unit_del_default">
                            <a>
                              <Icon
                                as={"i"}
                                onClick={()=>this.opendelete(item.branchName)}
                                className="del_button"
                                name = "times circle outline"
                                aria-label ={item.branchName}
                                size = "large"
                              >
                              </Icon>
                            </a>
                          </div>
                          <div className = "branch_buttons_unit_diff_default">
                            <Link to={ "/projects/" +
                              this.props.match.params.project_name +
                              "/repositories/" +
                              this.props.match.params.repository_name +"/branches/differences/" + item.branchName}>
                              <Icon
                                as={"i"}
                                className="diff_button"
                                name = "random"
                                aria-label ="Branch differences"
                                size = "large"
                              >
                              </Icon>
                            </Link>
                          </div>
                          <Confirm
                            open={this.state.openDelete}
                            content={`Are you sure you want to delete the branch ${this.state.deleteBranch}`}
                            onCancel={() => this.setState({openDelete: false})}
                            onConfirm={() =>
                                this.deleteBranch()
                            }
                          />
                        </IconGroup>
                      </div>
                    </List.Content>
                  </List.Item>
                ) : (
                  <List.Item as='div' key={item.branchName}>
                    <List.Content>
                      <List.Header as="h5">
                        {item.branchName}{" "}
                      </List.Header>
                      <div className="branch_unit">
                        <List.Description
                          href={
                            "/projects/" +
                            this.props.match.params.project_name +
                            "/repositories/" +
                            this.props.match.params.repository_name +
                            "/tree/" +
                            item.branchName
                          }
                        >
                          {item.commitId}
                        </List.Description>
                        <IconGroup className={"branch_buttons "} as={"div"}>
                          <div className = "branch_buttons_unit_del">
                            <a>
                              <Icon
                                as={"i"}
                                onClick={()=>this.opendelete(item.branchName)}
                                className="del_button"
                                name = "times circle outline"
                                aria-label ="Delete branch"
                                size = "large"
                              >
                              </Icon>
                            </a>
                          </div>
                          <div className = "branch_buttons_unit_diff">
                            <Link to={ "/projects/" +
                              this.props.match.params.project_name +
                              "/repositories/" +
                              this.props.match.params.repository_name +"/branches/differences/" + item.branchName}>
                              <Icon
                                as={"i"}
                                className="diff_button"
                                name = "random"
                                aria-label ="Branch differences"
                                size = "large"
                              >
                              </Icon>
                            </Link>
                          </div>
                          <Confirm
                            open={this.state.openDelete}
                            content={`Are you sure you want to delete the branch ${this.state.deleteBranch}`}
                            onCancel={() => this.setState({openDelete: false})}
                            onConfirm={() =>
                                this.deleteBranch()
                            }
                          />
                        </IconGroup>
                      </div>
                    </List.Content>
                  </List.Item>
                    )
              ))}
            </List>
          </Grid.Column>
        </Grid>
      </>
    );
  }
}

export default BranchesList;
