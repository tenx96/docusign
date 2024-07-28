import { useQuery } from "@tanstack/react-query";
import React from "react";
import DemoApiClient from "../../../../api/demo/DemoApiClient";
import {
  List,
  Listbox,
  Button,
  Text,
  Avatar,
  Input,
} from "@innovaccer/design-system";
import Loader from "../../../../components/Loader";
import { formatDate } from "../../../../utils";
import { demoApiGetTemplates } from "../../../../api/demo/templates";

const TemplateSelection = ({ onSelectTemplate }) => {
  const templatesQuery = useQuery({
    queryKey: ["templates"],
    queryFn: () => demoApiGetTemplates({qs: {}}),
  });

  if (templatesQuery.isLoading) {
    return <Loader />;
  }

  if (templatesQuery.isError) {
    return <div>Error fetching templates</div>;
  }
  const envelopeTemplates = templatesQuery.data?.envelopeTemplates || [];
  return (
    <div>
      <Input placeholder="Search..." />
      <Listbox>
        {envelopeTemplates.map((template, index) => {
          return (
            <Listbox.Item
              onClick={() => onSelectTemplate(template)}
              key={index}
            >
              <div className="d-flex  flex-column align-items-start">
                <div className="ml-5">
                  <Text>{template.name}</Text> <br />
                </div>
                <div className="d-flex">
                  <Text
                    size="small"
                    appearance="subtle"
                    className="ml-5"
                  >{`Owner ${template?.owner.userName}`}</Text>
                  <Text
                    size="small"
                    appearance="subtle"
                    className="ml-5"
                  >{`Created: ${formatDate(template.created)}`}</Text>
                </div>
              </div>
            </Listbox.Item>
          );
        })}
      </Listbox>
    </div>
  );
};

export default TemplateSelection;
