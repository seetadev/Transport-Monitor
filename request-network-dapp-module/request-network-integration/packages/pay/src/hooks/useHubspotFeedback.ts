import axios from "axios";

interface IFeedback {
  mood: "Good" | "Bad";
  comment?: string;
  email?: string;
  wallet?: string;
}

const client = axios.create({
  baseURL: "https://api.hsforms.com/submissions/v3/integration/",
});

const portalId = "4477725";
const testFormId = "31220c92-3135-4efb-b75b-7357ca97c910";
const liveFormId = "713579fa-60c0-4a97-8f0c-3ada006b5bd5";

/**
 * Hook to hadle submission of a feedback to hubspot
 */
export const useHubspotFeedback = () => {
  const sendFeedback = async (feedback: IFeedback) => {
    const fields = [
      {
        name: "email",
        value: feedback.email,
      },
      {
        name: "any_comments_to_help_us_improve_",
        value: feedback.comment,
      },
      {
        name: "mood",
        value: feedback.mood,
      },
      {
        name: "wallet",
        value: feedback.wallet,
      },
    ];
    const formId =
      window.location.hostname === "pay.request.network"
        ? liveFormId
        : testFormId;
    await client.post(`submit/${portalId}/${formId}`, { fields });
  };
  return {
    sendFeedback,
  };
};
