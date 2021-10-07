import React from "react";
import {Dropdown, Loader} from "semantic-ui-react";
import {Link, Redirect} from "react-router-dom";

class BranchDropdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stateOptions: [],
      isLoaded: false,
      isFound: true,
      isEmpty: false,
      isTag: false,
    };
  }

  componentDidMount() {
    this.getBranchesAndTags()
  }

  getBranchesAndTags() {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    Promise.all([fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.projectName +
        "/repositories/" +
        this.props.repositoryName +
        "/branches",
      requestOptions
    ).then((response) => response.json()), fetch(
      process.env.REACT_APP_API_LINK +
        "projects/" +
        this.props.projectName +
        "/repositories/" +
        this.props.repositoryName + "/gittags",
      requestOptions
    ).then((response) => response.json())]).then(([branches, tags]) => {
      const tagsResponse = tags.length > 0 ? [{
        key: "Tags",
        text: "Tags",
        value: "",
        disabled: true
      }, ...tags.map((tag) => ({
        key: tag.value,
        text: tag.value,
        value: tag.value,
        as: Link,
        to:
          "/projects/" +
          this.props.projectName +
          "/repositories/" +
          this.props.repositoryName +
          "/tags/" +
          tag.value + "/tree/",
      }))

      ] : []
      this.setState({
        stateOptions: [
          {key: "Branches", text: "Branches", value: "", disabled: true},
          ...branches.map((item) => ({
            key: item.branchName,
            text: item.branchName,
            value: item.branchName,
            as: Link,
            to:
              "/projects/" +
              this.props.projectName +
              "/repositories/" +
              this.props.repositoryName +
              "/tree/" +
              item.branchName,
          })),
          ...tagsResponse
        ],
        isLoaded: true,
      })
    });
  }


  render() {
    const {isLoaded, isFound, isEmpty, stateOptions} = this.state;

    if (!isLoaded)
      return (
          <>
            <Loader active>Loading</Loader>
          </>
      );
    if (!isFound) return <Redirect to="/404"/>;
    if (isEmpty) return <></>; // TODO: empty directory=

      return (
        <>
          <Dropdown
            style={{marginRight: "15px"}}
            defaultValue={this.props.defaultBranch}
            search
            selection
            fluid
            options={stateOptions}
          />
        </>
      );
  }
}

export default BranchDropdown;
