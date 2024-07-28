import React from "react";
import {
  Routes,
  Route,
  Outlet,
  useNavigate,
  useParams,
} from "react-router-dom";
import Forms from "./Forms";
import CreateEnvelope from "./CreateEnvelope";
import EnvelopeDetails from "./EnvelopeDetails";
import { Breadcrumbs } from "@innovaccer/design-system";
import DraftReview from "./EnvelopeDraftReview/DraftReview";
import EnvelopeCorrectView from "./EnvelopeCorrectView";

export const pathTo = {
  createEnvelope: () => "/create-envelope",
  envelopeDetails: (envelopeId: string) => `/envelopes/${envelopeId}`,
  draftReview: (envelopeId: string) => `/envelopes/${envelopeId}/draft-review`,
  correctView: (envelopeId: string) => `/envelopes/${envelopeId}/correct-view`,
};

export const Wrapper = () => {
  const navigate = useNavigate();
  const { envelopeId } = useParams();
  const list = [
    {
      label: "Home",
      link: "/",
    },
  ];

  if (envelopeId) {
    list.push({
      label: "Envelope Info",
      link: pathTo.envelopeDetails(envelopeId),
    });
  }
  return (
    <div className="w-50 m-auto">
      <Breadcrumbs onClick={(link) => navigate(link)} list={list} />
      <Outlet />
    </div>
  );
};

const DemoRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route index path="/" element={<Forms />} />
          <Route path="/create-envelope" element={<CreateEnvelope />} />
          <Route path="/envelopes/:envelopeId" element={<EnvelopeDetails />} />
          <Route
            path="/envelopes/:envelopeId/draft-review"
            element={<DraftReview />}
          />
          <Route
            path="/envelopes/:envelopeId/correct-view"
            element={<EnvelopeCorrectView />}
          />
        </Route>
      </Routes>
    </div>
  );
};

export default DemoRoutes;
