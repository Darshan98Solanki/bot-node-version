// index.ts
import axios from "axios";
import { sendMessage } from "..";

interface CreateApplicationPayload {
  jobId: string;
  dspEnabled: boolean;
  scheduleId: string;
  candidateId: string;
  activeApplicationCheckEnabled: boolean;
}

interface JobData {
  jobTitle: string;
  locationName: string;
  jobType: string;
  employmentType: string;
}

export async function createApplication(
  jobId: string,
  scheduleId: string,
  bbCandidateId: string,
  accessToken: string,
  API_URL: string,
  jobData: JobData,
  cookie: string
): Promise<boolean> { 
  const payload: CreateApplicationPayload = {
    jobId,
    dspEnabled: true,
    scheduleId,
    candidateId: bbCandidateId,
    activeApplicationCheckEnabled: true,
  };



  try {
    const response = await axios.post(API_URL, payload, {
      headers: {
        accept: "application/json, text/plain, */*",
        cookie: cookie,
        authorization: accessToken,
        "bb-ui-version": "bb-ui-v2",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=UTF-8",
        origin: "https://hiring.amazon.com",
        pragma: "no-cache",
        referer: `https://hiring.amazon.com/application/us/?CS=true&jobId=${jobId}&locale=en-US&scheduleId=${scheduleId}&ssoEnabled=1`,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
      },
      withCredentials: true,
    });

    console.log("response--->",response.data)

    if(response.status === 200 || response.status === 201){
      const notification = {
          Title: jobData.jobTitle,
          Location: jobData.locationName,
          Type: jobData.jobType,
          Employment_Type: jobData.employmentType,
      } 
      console.log("✅ Application created:");
      sendMessage(notification)
    }
    return true;
  } catch (error: any) { 
    console.log("error",error);
    console.error("❌ Error creating application:");
    return false;
  }
}
