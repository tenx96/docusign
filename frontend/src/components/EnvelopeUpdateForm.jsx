import React from "react";
import { useDisclosure } from "../hooks/useDisclosure";
import { useMutation } from "@tanstack/react-query";
import { updateEnvelope } from "../api/envelopes";
import { isEmpty, omitBy } from "lodash";
import { Button, Input, Label, Textarea } from "@innovaccer/design-system";

const EnvelopeUpdateForm = ({ envelope, onSuccess }) => {
  const disclosure = useDisclosure();

  const {
    envelope_id,
    status,
    email_blurb,
    email_subject,
    created_date_time,
  } = envelope;

  const updateEnvelopeMutation = useMutation({
    mutationFn: ({ subject, blurb }) => {
      let payload = {
        emailSubject: subject,
        emailBlurb: blurb,
      };

      payload = omitBy(payload, isEmpty);

      return updateEnvelope(envelope_id, payload);
    },
    onSuccess: () => {
      alert("Envelope updated successfully");
      onSuccess()
      disclosure.onClose()
    },
  });

  return (
    <div>
      <Button onClick={disclosure.onOpen}>Update envelope</Button>
      <dialog open={disclosure.isOpen}>
        <div>
          <form
            action="submit"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target;
              const subject = form.subject.value;
              const blurb = form.blurb.value;

              updateEnvelopeMutation.mutate({ subject, blurb });
            }}
          >
            <Label htmlFor="">Subject</Label>
            <Input
              type="text"
              name="subject"
              defaultValue={email_subject}
              placeholder="Subject"
            />
            <Label htmlFor="">Message</Label>
            <Textarea
              type="text"
              name="blurb"
              defaultValue={email_blurb}
              placeholder="Message"
            />
            <Button loading={updateEnvelopeMutation.isPending}>Save</Button>
          </form>
          <footer className="mt-4">
            <Button onClick={disclosure.onClose}>Cancel</Button>
          </footer>
        </div>
      </dialog>
    </div>
  );
};

export default EnvelopeUpdateForm;
