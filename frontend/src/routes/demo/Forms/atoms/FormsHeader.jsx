import { Button, Input, PageHeader } from "@innovaccer/design-system";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pathTo } from "../..";

const FormsHeader = () => {
  const navigate = useNavigate();
  const handleCreateNewForm = () => {
    navigate(pathTo.createEnvelope());
  };
  return (
    <div>
      <PageHeader
        title="Forms"
        actions={
          <Button onClick={handleCreateNewForm} icon="add" appearance="primary">
            Form
          </Button>
        }
      />
      <div style={{ width: 250 }} className="input-wrapper">
        <Input name="input" placeholder="Search..." type="text" />
      </div>
    </div>
  );
};

export default FormsHeader;
