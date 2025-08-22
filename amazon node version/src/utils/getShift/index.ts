import axios from "axios";
import { COMMON_HEADERS } from "../../consts";

interface ScheduleCard {
  scheduleId: string;
  jobId: string;
  externalJobTitle: string;
  hireStartDate: string;
  hoursPerWeek: number;
  city: string;
  state: string;
  postalCode: string;
  basePayL10N: string;
  signOnBonusL10N: string;
  totalPayRateL10N: string;
  firstDayOnSiteL10N: string;
}

interface SearchScheduleResponse {
  data: {
    searchScheduleCards: {
      nextToken?: string;
      scheduleCards: ScheduleCard[];
    };
  };
}

export async function getSchedulesForJob(jobId: string): Promise<ScheduleCard[] | null> {
  const start = Date.now();

  const url = "https://e5mquma77feepi2bdn4d6h3mpu.appsync-api.us-east-1.amazonaws.com/graphql";

  const graphqlQuery = `
    query searchScheduleCards($searchScheduleRequest: SearchScheduleRequest!) {
      searchScheduleCards(searchScheduleRequest: $searchScheduleRequest) {
        nextToken
        scheduleCards {
          scheduleId
          jobId
          externalJobTitle
          hireStartDate
          hoursPerWeek
          city
          state
          postalCode
          basePayL10N
          signOnBonusL10N
          totalPayRateL10N
          firstDayOnSiteL10N
        }
      }
    }
  `;

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const variables = {
    searchScheduleRequest: {
      locale: "en-US",
      country: "United States",
      keyWords: "",
      equalFilters: [],
      containFilters: [{ key: "isPrivateSchedule", val: ["false"] }],
      rangeFilters: [{ key: "hoursPerWeek", range: { minimum: 0, maximum: 80 } }],
      orFilters: [],
      dateFilters: [{ key: "firstDayOnSite", range: { startDate: today } }],
      sorters: [{ fieldName: "totalPayRateMax", ascending: "false" }],
      pageSize: 1000,
      jobId: jobId,
      consolidateSchedule: true,
    },
  };

  try {
    const response = await axios.post<SearchScheduleResponse>(
      url,
      { query: graphqlQuery, variables },
      { headers: COMMON_HEADERS }
    );

    const end = Date.now();
    console.log("get the shift in", (end - start) / 1000, "seconds");

    if (response.status === 200) {
      return response.data?.data?.searchScheduleCards?.scheduleCards || [];
    } else {
      console.error("Request failed:", response.status);
      return null;
    }
  } catch (err: any) {
    console.error("Error fetching schedules:", err.message);
    return null;
  }
}
