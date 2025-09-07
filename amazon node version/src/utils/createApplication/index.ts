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
        Accept: "application/json, text/plain, */*",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Accept-Language": "en,pl;q=0.9",
        Authorization: accessToken,
        "Bb-Ui-Version": "bb-ui-v2",
        "Cache-Control": "no-cache",
        "Content-Length":170,
        "Content-Type": "application/json;charset=UTF-8",
        Cookie: cookie,
        Origin: "https://hiring.amazon.com",
        Priority: "u=1, i",
        Pragma: "no-cache",
        Referer: `https://hiring.amazon.com/application/us/?CS=true&jobId=${jobId}&locale=en-US&scheduleId=${scheduleId}&ssoEnabled=1`,
        "sec-ch-ua":'"Opera";v="120", "Not-A.Brand";v="8", "Chromium";v="135"',
        "sec-ch-ua-mobile":'?0',
        "sec-ch-ua-platform":"Windows",
        "sec-fetch-dest":'empty',
        "sec-fetch-mode":'cors',
        "sec-fetch-site":'same-origin',
        "User-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
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
