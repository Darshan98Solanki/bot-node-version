// utils/get_jobs/get_ca_jobs.ts
import axios from "axios";

export async function getJobsFromCA({
  url,
  headers,
}: {
  url: string;
  headers: Record<string, string>;
}) {
  // GraphQL payload (exactly matching cURL)
  const data = {
    query: `query searchJobCardsByLocation($searchJobRequest: SearchJobRequest!) {
      searchJobCardsByLocation(searchJobRequest: $searchJobRequest) {
        nextToken
        jobCards {
          jobId
          language
          dataSource
          requisitionType
          jobTitle
          jobType
          employmentType
          city
          state
          postalCode
          locationName
          totalPayRateMin
          totalPayRateMax
          tagLine
          bannerText
          image
          jobPreviewVideo
          distance
          featuredJob
          bonusJob
          bonusPay
          scheduleCount
          currencyCode
          geoClusterDescription
          surgePay
          jobTypeL10N
          employmentTypeL10N
          bonusPayL10N
          surgePayL10N
          totalPayRateMinL10N
          totalPayRateMaxL10N
          distanceL10N
          monthlyBasePayMin
          monthlyBasePayMinL10N
          monthlyBasePayMax
          monthlyBasePayMaxL10N
          jobContainerJobMetaL1
          virtualLocation
          poolingEnabled
          payFrequency
          __typename
        }
        __typename
      }
    }`,
    variables: {
      searchJobRequest: {
        locale: "en-CA",
        country: "Canada",
        keyWords: "",
        equalFilters: [],
        containFilters: [
          {
            key: "isPrivateSchedule",
            val: ["false"],
          },
        ],
        rangeFilters: [],
        orFilters: [],
        dateFilters: [
          {
            key: "firstDayOnSite",
            range: {
              startDate: "2025-09-09", // same as cURL
            },
          },
        ],
        sorters: [
          {
            fieldName: "totalPayRateMax",
            ascending: "false",
          },
        ],
        pageSize: 100,
      },
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Request failed:", error.response.status, error.response.data);
    } else {
      console.error("Request failed:", error.message);
    }
    return null;
  }
}
