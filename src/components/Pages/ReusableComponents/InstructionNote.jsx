import React from "react";
import { FaInfoCircle } from "react-icons/fa";

function InstructionNote({ noteid, focus, condition, notemessage, value }) {
  return (
    <p
      noteid={noteid}
      className={focus && value && condition ? "instructions" : "offscreen"}
    >
      <FaInfoCircle />
      {notemessage}
    </p>
  );
}

export default InstructionNote;
