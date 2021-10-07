import React from "react";
import { Segment } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

const markdown = `# v1.0.0
- Added this page`;

const Changelog = () => (
  <>
    <Segment >
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </Segment>
  </>
);

export default Changelog;
