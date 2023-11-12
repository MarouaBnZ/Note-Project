import React from "react";
const NotesList = (props) => {
  return <div className="notes-list">{props.children}</div>;
};

export default NotesList;
