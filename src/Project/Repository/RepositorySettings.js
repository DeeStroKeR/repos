import React from "react";
import {
  Breadcrumb,
  Button,
  Container,
  Divider,
  Form,
  Header,
  Icon,
  Message,
  Popup,
  Tab,
  Table,
  TextArea,
} from "semantic-ui-react";
import {Redirect} from "react-router-dom";
import {CopyToClipboard} from "react-copy-to-clipboard";

class RepositorySettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      repoInfo: {},
      projectInfo: {},
      isFound: true,
      isEmpty: false,
      sshKey: "",
      selectedFiles: [],
      error: "",
      createdRedirect: "",
      loading: false,
      copied: false,
      iconName: "copy icon clone-url-icon",
      iconData: "Copy to clipboard",
      tagsInfo: {},
      gitTags: {},
      dropDownValue: {},
      defaultBranch: "",
      items: {},
      branchList: {},
      messageData: "",
      messageStatus: "",
      inputValue:"",
    };
  }

  componentDidMount() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      mode: "cors",
    };

    this.repoInfo()
    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name,
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
            isLoaded: true,
            projectInfo: json,
          });
        }
      });
    fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" + this.props.match.params.repository_name + "/gittags",
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
            isLoaded: true,
            gitTags: json,
          });
        }
      });
    this.getBranches()
  }

  repoInfo(){
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
            isLoaded: true,
            repoInfo: json,
            defaultBranch:json.defaultBranch
          }); debugger
        }
      });
  }

  clickReset() {
    this.setState({
      loading: true,
    });
    var myHeaders = new Headers();
    var requestOptions = {
      method: "PUT",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/credentials",
      requestOptions
    )
      .then(async (response) => {
        const data = await response.text().then(function (text) {
          return text;
        });
        if (!response.ok) {
          this.setState({
            error: JSON.parse(data)["error"],
          });
        } else {
          this.setState({
            error: "",
          });
        }
      })
      .then((result) => console.log(result))
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.log("error", error));
  }

  clickCreate() {
    this.setState({
      loading: true,
    });
    var myHeaders = new Headers();
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/credentials",
      requestOptions
    )
      .then(async (response) => {
        const data = await response.text().then(function (text) {
          return text;
        });
        if (!response.ok) {
          this.setState({
            error: JSON.parse(data)["error"],
          });
        } else {
          this.setState({
            error: "",
          });
        }
      })
      .then((result) => console.log(result))
      .then(() => {
        window.location.reload();
      })
      .catch((error) => console.log("error", error));
  }

  onCopyIcon() {
    this.setState({
      copied: true,
      iconName: "check icon clone-url-icon",
      iconData: "Copied!",
    });
    setTimeout(() => {
      this.setState({
        copied: false,
        iconName: "copy icon clone-url-icon",
        iconData: "Copy to clipboard",
      });
    }, 1000);
  }

  changedText(event, context) {
    this.setState({
      sshKey: context.value,
    });
  }

  uploadSsh() {
    this.setState({
      loading: true,
    });
    let sshkey = this.state.sshKey;

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/credentials/ssh",
      {
        method: "POST",
        body: JSON.stringify({
          ssh: sshkey,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      try {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      } catch {
        this.setState({
          createdRedirect: this.state.projectName,
        });
        return;
      }
    });
  }

  removeSsh() {
    this.setState({
      loading: true,
    });

    fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.match.params.project_name +
        "/credentials/ssh",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(async (response) => {
      window.location.reload();
      try {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      } catch {
        this.setState({
          createdRedirect: this.state.projectName,
        });
        return;
      }
    });
  }

  onDropDownChange = (event, data) => {
    this.setState({dropDownValue: data.value});
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
        console.log(json);
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

  changeDefaultBranch(branchName, repoDescription) {
    const obj={}
    branchName?obj.defaultBranch = branchName:obj.repositoryDescription=repoDescription
    fetch(
      process.env.REACT_APP_API_LINK +
      "projects/" +
      this.props.match.params.project_name +
      "/repositories/" +
      this.props.match.params.repository_name,
      {
        method: "PUT",
        body: JSON.stringify({
          username: "admin",
          ...obj
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      console.log(response);
      try {
        const data = response.json();
        if (!response.ok) {
          this.setState({
            messageData: data["error"], messageStatus: "negative", open: false,
          });
        } else {
          if(branchName){this.setState({
            open: false,
            messageData: "New default branch: " + branchName,
            messageStatus: "positive",
            defaultBranch: branchName
          });} 
          else {
            this.setState({
              open: false,
              messageData: "Description is successfully updated!",
              messageStatus: "positive",
            });
          }
          this.repoInfo()
          this.getBranches();
        }
      } catch {
        this.setState({
          createdRedirect: this.state.projectName,
        });
      }
    }).then(() => {
      setTimeout(() => {
        this.setState({
          messageData: "",
          messageStatus: "",
        });
      }, 2000);
    });
  }

  handleSubmit = (flag) => {
    const {dropDownValue,inputValue} = this.state;
    if(flag==="description") {
      this.changeDefaultBranch(undefined,inputValue)}
    else{
      this.changeDefaultBranch(dropDownValue,undefined)
    }
  }

  onInputChange = (event) => {
    this.setState({inputValue: event.target.value});
  }

  render() {

    const {
      isFound,
      projectInfo,
      error,
      repoInfo,
      loading,
      tagsInfo,
      gitTags,
      branchList,
      messageStatus,
      messageData,
      defaultBranch,
    } = this.state;
    console.log(gitTags)
    const RepoPath = `git clone https://${projectInfo.creds_user}:${projectInfo.creds_pass}@git-codecommit.us-east-1.amazonaws.com/v1/repos/${repoInfo.repositoryNameCC} ${projectInfo.ProjectName}_${repoInfo.repositoryName}`;
    const panes = [
      {
        menuItem: "HTTPS",
        render: () => (
          <Tab.Pane>
            <p>
              To clone repository via git client you should use HTTPS:
              <br/>
              <a
                  href={
                    "https://git-codecommit.us-east-1.amazonaws.com/v1/repos/" +
                    repoInfo.repositoryNameCC
                  }
              >
                {"https://git-codecommit.us-east-1.amazonaws.com/v1/repos/" +
                repoInfo.repositoryNameCC}
              </a>
            </p>
            <p>Credentials* for the authentication:</p>
            {!projectInfo.creds_pass && projectInfo !== {} ? (
              <Button
                content="Create credentials"
                loading={loading}
                onClick={this.clickCreate.bind(this)}
              />
            ) : (
              <Button
                content="Reset password"
                loading={loading}
                onClick={this.clickReset.bind(this)}
              />
            )}
            <Message>
              Username:{" "}
              <a style={{ color: "red" }}>{projectInfo.creds_user || "None"}</a>
              <br />
              Password:{" "}
              <a style={{ color: "orange" }}>{projectInfo.creds_pass || "None"}</a>
            </Message>
            {projectInfo.creds_pass ? (
              <>
                To clone repo you should use git command:
                <Message>
                  <Popup
                    trigger={
                      <CopyToClipboard
                        text={RepoPath}
                        onCopy={this.onCopyIcon.bind(this)}
                      >
                        <Icon name={this.state.iconName} />
                      </CopyToClipboard>
                    }
                    content={this.state.iconData}
                    inverted
                  />
                  {/*<i className={this.state.iconName} data-content="Copy to clipboard" data-variation="inverted"/>*/}
                  git clone https://
                  <a style={{ color: "red" }}>{projectInfo.creds_user}</a>:
                  <a style={{ color: "orange" }}>{projectInfo.creds_pass}</a>
                  @git-codecommit.us-east-1.amazonaws.com/v1/repos/
                  {repoInfo.repositoryNameCC} {projectInfo.ProjectName}_
                  {repoInfo.repositoryName}
                </Message>
                * Credentials are unique over all repositories in the same
                project
              </>
            ) : (
              ""
            )}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "SSH",
        render: () => (
          <Tab.Pane>
            From the terminal on your local machine, run the ssh-keygen command,
            and follow the directions to save the file to the .ssh directory for
            your profile.
            <br />
            For example:{" "}
            <Message>
              $ ssh-keygen
              <br />
              <br />
              Generating public/private rsa key pair.
              <br />
              Enter file in which to save the key (/home/
              <a style={{ color: "red" }}>user-name</a>/.ssh/id_rsa):{" "}
              <a style={{ color: "red" }}>
                Type /home/your-user-name/.ssh/ and a file name here, for
                example /home/your-user-name/.ssh/codecommit_rsa
              </a>
              <br />
              <br />
              Enter passphrase (empty for no passphrase):{" "}
              <a style={{ color: "red" }}>
                &lt;Type a passphrase, and then press Enter&gt;
              </a>
              <br />
              Enter same passphrase again:{" "}
              <a style={{ color: "red" }}>
                &lt;Type the passphrase again, and then press Enter&gt;
              </a>
              <br />
              Your identification has been saved in /home/
              <a style={{ color: "red" }}>user-name/.ssh/</a>
              <a style={{ color: "red" }}>codecommit_rsa.</a>
              <br />
              Your public key has been saved in /home/
              <a style={{ color: "red" }}>user-name/.ssh/</a>
              <a style={{ color: "red" }}>codecommit_rsa.pub.</a>
              <br />
              The key fingerprint is:
              <br />
              45:63:d5:99:0e:99:73:50:5e:d4:b3:2d:86:4a:2c:14{" "}
              <a style={{ color: "red" }}>user-name</a>@
              <a style={{ color: "red" }}>client-name</a>
              <br />
            </Message>
            This generates
            <ul>
              <li>The codecommit_rsa file, which is the private key file.</li>
              <li>The codecommit_rsa.pub file, which is the public key file.</li>
            </ul>
            Run the following command to display the value of the public key
            file (codecommit_rsa.pub):
            <Message>cat ~/.ssh/codecommit_rsa.pub</Message>
            Copy this value and paste to the field below.
            <Form>
              {!projectInfo.ssh_key_id ? (
                <TextArea
                  placeholder="Paste SSH public key here"
                  onInput={this.changedText.bind(this)}
                />
              ) : (
                <Message>Ssh already uploaded, to reset press the button below</Message>
              )}
            </Form>
            <br />
            {projectInfo.ssh_key_id ? (
              <Button loading={loading} onClick={this.removeSsh.bind(this)}>
                Remove SSH
              </Button>
            ) : (
              <Button loading={loading} onClick={this.uploadSsh.bind(this)}>
                Upload SSH
              </Button>
            )}
            {projectInfo.ssh_key_id ? (
              <>
                <br />
                On your local machine, use a text editor to create a config file
                in the ~/.ssh directory or edit existing file, and then add the
                following lines to the file:
                <Message>
                  Host {projectInfo.ProjectName}#{repoInfo.repositoryName}{" "}
                  <br />
                  &nbsp;&nbsp;User{" "}
                  <a style={{ color: "red" }}>{projectInfo.ssh_key_id}</a>
                  <br />
                  &nbsp;&nbsp;HostName git-codecommit.us-east-1.amazonaws.com
                  <br />
                  &nbsp;&nbsp;IdentityFile ~/.ssh/codecommit_rsa
                  <br />
                  &nbsp;&nbsp;IdentitiesOnly yes
                </Message>
                Save and name this file config. <br />
                From the terminal, run the following command to change the
                permissions for the config file:
                <Message>chmod 600 config</Message>
                Run the following command to test your SSH configuration:
                <Message>ssh git-codecommit.us-east-2.amazonaws.com</Message>
                And to finaly to clone your repo you should use
                <Message>
                  git clone ssh://
                  <a style={{ color: "red" }}>{projectInfo.ssh_key_id}</a>@
                  <a style={{ color: "red" }}>
                    {projectInfo.ProjectName}#{repoInfo.repositoryName}
                  </a>
                  /v1/repos/
                  {repoInfo.repositoryNameCC}
                </Message>
              </>
            ) : (
                ""
            )}
          </Tab.Pane>
        ),
      }, {
        menuItem: "Tags",
        render: () => (
            <Tab.Pane>
              <h2>Git tags</h2>
              Info
              You can use Git tags to mark a commit with a name or other identifier that helps other repository users
              understand its importance. You can also use Git tags to identify a particular commit in the history of a
              repository.

              <p>You can use Git to create a tag in a local repo. After you create the tag, you can use the git push
                --tags command to push the tag to the remote repository. After you push the tag, it appears in the
                list
                of tags in the console.</p>




              {gitTags !== [] ? (
                <Table celled striped>
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Tag </Table.HeaderCell>
                      <Table.HeaderCell>Commit </Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>

                    {gitTags.map((tag) => {
                      return (
                        <Table.Row>
                          <Table.Cell>
                            <a href={
                              "/projects/" +
                              this.props.match.params.project_name +
                              "/repositories/" +
                              this.props.match.params.repository_name +
                              '/tags/'+ tag.value + '/tree'}
                            >{tag.value}
                            </a>
                          </Table.Cell>
                            <Table.Cell>
                              {tag.commitId}
                            </Table.Cell>
                        </Table.Row>
                      )
                    },
                    )}

                  </Table.Body>
                </Table>
            ) : (
                <Message negative>
                  <Message.Header>We're sorry we cant find your Git tags</Message.Header>
                  <p>Please add tags so that they appear here.</p>
                </Message>
            )}
          </Tab.Pane>
        )
      },
      {
        menuItem: "General",
        render: () => (
          <Tab.Pane>
            <h3>Default branch</h3>
            <p>Changing the default branch for a repository affects those users who clone the repository after you
              make the change.</p>
            {messageStatus !== "" ? (
              messageStatus === "negative" ? (
                <Message negative>{messageData}</Message>
              ) : (
                <Message positive>{messageData}</Message>
              )
            ) : (
            <></>)}
            <Message>
              <Form>
                <Form.Select
                    onChange={(event, data) => this.onDropDownChange(event, data)}
                    fluid
                    label={"Default branch: " + defaultBranch}
                    options={branchList}
                    placeholder={repoInfo.defaultBranch}
                />
                <Form.Button onClick={() => this.handleSubmit("")}>Save</Form.Button>
              </Form>
            </Message>

            <h3>Repository description</h3>

              <Message>
              <Form>
                <Form.TextArea onChange={(event) => this.onInputChange(event)} label="Description" required type="text"
                          placeholder={this.state.repoInfo.repositoryDescription}/>
                <Form.Button onClick={() => this.handleSubmit("description")}>Save</Form.Button>
              </Form>
            </Message>

          </Tab.Pane>
        ),
      },


    ];
    if (!isFound) return <Redirect to="/404" />;
    return (
      <>
        <div class="own-container">
          <Container>
            {error !== "" ? (
              <Message negative>
                <Message.Header>Error while uploading files</Message.Header>
                <p>{error}</p>
              </Message>
            ) : (
              ""
            )}
            <Header size="huge" as="h1">
              Credentials for repository:{" "}
              {this.props.match.params.repository_name}
            </Header>
            <Breadcrumb size="large">
              <Breadcrumb.Section
                href={"/projects/" + this.props.match.params.project_name}
              >
                {this.props.match.params.project_name}
              </Breadcrumb.Section>
              <Breadcrumb.Divider icon="right chevron" />{" "}
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
            <Divider />
            <Tab panes={panes} />
          </Container>
        </div>
      </>
    );
  }
}

export default RepositorySettings;
