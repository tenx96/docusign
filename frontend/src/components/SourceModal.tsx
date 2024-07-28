import React from "react";
import { useDisclosure } from "../hooks/useDisclosure";
import {
  JsonView,
  allExpanded,
  darkStyles,
  defaultStyles,
} from "react-json-view-lite";
import "react-json-view-lite/dist/index.css";
import { Button, Modal } from "@innovaccer/design-system";

const SourceModal = ({ sourceText = "", title = "Source" }) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        disabled={!sourceText}
        onClick={disclosure.onOpen}
        className="secondary"
      >
        {`View source "${title}"`}
      </Button>
      <div>
        <Modal
          headerOptions={{
            heading: title,
          }}
          dimension="large"
          onClose={disclosure.onClose}
          open={disclosure.isOpen}
        >
          <JsonView
            data={sourceText}
            shouldExpandNode={allExpanded}
            style={defaultStyles}
          />
        </Modal>
      </div>
    </>
  );
};

export default SourceModal;
