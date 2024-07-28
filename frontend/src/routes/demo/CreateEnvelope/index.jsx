import React from "react";
import TemplateSelection from "./atoms/TemplateSelection";
import { Text } from "@innovaccer/design-system";
import RecipientSelection from "./atoms/RecipientSelection";
const CreateEnvelope = () => {
  const [selectedTemplate, setSelectedTemplate] = React.useState();

  return (
    <div>
      <Text>Template Selection</Text>
      <TemplateSelection onSelectTemplate={setSelectedTemplate} />
      {selectedTemplate && <RecipientSelection template={selectedTemplate} />}
    </div>
  );
};

export default CreateEnvelope;
