import React from "react";
import {
  Icon,
  Menu,
} from "semantic-ui-react";

class CustomMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <>
        <div style={{ display: "flex", justifyContent: "space-between", paddingLeft: "7px", paddingRight: "7px" }}>
          <a href={"/projects/" + this.props.project_name}>
            {this.props.project_name}
          </a>{" "}
          <a>/</a>{" "}
          <a
            href={
              "/projects/" +
              this.props.project_name +
              "/repositories/" +
              this.props.repository_name
            }
          >
            <b>{this.props.repository_name}</b>
          </a>
        </div>
        <Menu secondary vertical>
          <Menu.Item
            link
            href={
              "/projects/" +
              this.props.project_name +
              "/repositories/" +
              this.props.repository_name +
              "/pullrequests"
            }
            name="pullrequests"
          >
            <span>
              <Icon name="code" /> Pull requests
            </span>{" "}
            <div style={{ float: "right" }}>{this.props.count_pulls}</div>
          </Menu.Item>
          <Menu.Item
            link
            href={
              "/projects/" +
              this.props.project_name +
              "/repositories/" +
              this.props.repository_name +
              "/commits"
            }
            name="commits"
          >
            <span>
              <Icon name="file alternate" />
              Commits
            </span>{" "}
            <div style={{ float: "right" }}>{this.props.count_commits}</div>
          </Menu.Item>
          <Menu.Item
            link
            href={
              "/projects/" +
              this.props.project_name +
              "/repositories/" +
              this.props.repository_name +
              "/branches"
            }
            name="branches"
          >
            <span>
              <Icon name="code branch" />
              Branches
            </span>{" "}
            <div style={{ float: "right" }}>{this.props.count_branches}</div>
          </Menu.Item>
          <Menu.Item
            link
            href={
              "/projects/" +
              this.props.project_name +
              "/repositories/" +
              this.props.repository_name + '/settings'
            }
            name="credentials"
          >
            Settings
          </Menu.Item>
        </Menu>
      </>
    )
  }
}

export default CustomMenu;
