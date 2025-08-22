import axios from "axios";

export async function getJobsFromUS({url, headers}:{url: string, headers: Record<string, string>}): Promise<any> {
  // Request payload
  const data = {
    query: `
      query searchJobCardsByLocation($searchJobRequest: SearchJobRequest!) {
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
            __typename
          }
          __typename
        }
      }
    `,
    variables: {
      searchJobRequest: {
        locale: "en-US",
        country: "United States",
        keyWords: "",
        equalFilters: [
          {
            key: "scheduleRequiredLanguage",
            val: "en-US",
          },
        ],
        containFilters: [
          {
            key: "isPrivateSchedule",
            val: ["false"],
          },
        ],
        rangeFilters: [
          {
            key: "hoursPerWeek",
            range: {
              minimum: 0,
              maximum: 80,
            },
          },
        ],
        orFilters: [],
        dateFilters: [
          {
            key: "firstDayOnSite",
            range: {
              startDate: "2025-07-16",
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
        consolidateSchedule: true,
      },
    },
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error: any) {
    console.error("Request failed:", error.message);
    if (error.response) {
      console.error("Response content:", error.response.data);
    }
    throw error;
  }
}
