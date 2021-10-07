import React from "react";
import { Redirect } from "react-router";
import {
  Grid,
  Header,
  Input,
  Form,
  TextArea,
  Button,
  Message,
} from "semantic-ui-react";

class CreateProject extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      urlValue: window.location.hostname + "/projects/",
      projectName: "",
      projectDescription: "",
      error: "",
      createdRedirect: "",
    };
  }

  handleCreate() {
    if (
      this.state.projectName.length < 1 ||
      this.state.projectName.length > 30 ||
      this.state.projectDescription.length > 1000
    )
      return;
    fetch(process.env.REACT_APP_API_LINK + "projects", {
      method: "POST",
      body: JSON.stringify({
        username: "admin",
        projectName: this.state.projectName,
        projectDescription: this.state.projectDescription,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      try {
        const data = await response.json();
        if (!response.ok) {
          this.setState({
            error: data["error"],
          });
        } else {
          this.setState({
            createdRedirect: this.state.projectName,
          });
        }
      } catch {
        this.setState({
          createdRedirect: this.state.projectName,
        });
        return;
      }
    });
  }

  onChange(event, data) {
    this.setState({
      urlValue: window.location.hostname + "/projects/" + data.value,
      projectName: data.value,
    });
  }
  onChangeDescription(event, data) {
    this.setState({
      projectDescription: data.value,
    });
  }
  render() {
    const { error, createdRedirect } = this.state;
    if (createdRedirect !== "") {
      return <Redirect to={"/projects/" + createdRedirect} />;
    }
    if (error !== "") {
      return (
        <>
          <Message negative>
            <Message.Header>Error while creating project</Message.Header>
            <p>{error}</p>
          </Message>
          <Header as="h1">New project</Header>
          <Grid style={{ marginTop: "2em" }}>
            <Grid.Column width={8}>
              <Header as="h4">Project name</Header>
              <Input
                fluid
                onChange={this.onChange.bind(this)}
                placeholder="Project name..."
                value={this.state.projectName}
              />
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as="h4">Project URL</Header>
              <Input fluid disabled value={this.state.urlValue} />
            </Grid.Column>
          </Grid>
          <Header as="h4">Project description</Header>
          <Form>
            <TextArea
              onChange={this.onChangeDescription.bind(this)}
              placeholder="Project description..."
              value={this.state.projectDescription}
            />
          </Form>
          <Button
            style={{
              backgroundColor: "#489FB5",
              color: "white",
              marginTop: "1em",
            }}
            content="Create"
            onClick={this.handleCreate.bind(this)}
          />
        </>
      );
    }
    return (
      <>
        <Header as="h1">New project</Header>
        <Grid style={{ marginTop: "2em" }}>
          <Grid.Column width={8}>
            <Header as="h4">Project name</Header>
            <Input
              fluid
              onChange={this.onChange.bind(this)}
              placeholder="Project name..."
            />
          </Grid.Column>
          <Grid.Column width={8}>
            <Header as="h4">Project URL</Header>
            <Input fluid disabled value={this.state.urlValue} />
          </Grid.Column>
        </Grid>
        <Header as="h4">Project description</Header>
        <Form>
          <TextArea
            onChange={this.onChangeDescription.bind(this)}
            placeholder="Project description..."
          />
        </Form>
        <Button
          style={{
            backgroundColor: "#489FB5",
            color: "white",
            marginTop: "1em",
          }}
          content="Create"
          onClick={this.handleCreate.bind(this)}
        />
      </>
    );
  }
}

export default CreateProject;
