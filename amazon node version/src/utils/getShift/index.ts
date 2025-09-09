// utils/get_jobs/get_us_schedules.ts
import axios from "axios";
import { COMMON_HEADERS } from "../../consts";

interface ScheduleCard {
  hireStartDate: string;
  address: string;
  basePay: string;
  bonusSchedule: string;
  city: string;
  currencyCode: string;
  dataSource: string;
  distance: number;
  employmentType: string;
  externalJobTitle: string;
  featuredSchedule: boolean;
  firstDayOnSite: string;
  hoursPerWeek: number;
  image: string;
  jobId: string;
  jobPreviewVideo: string;
  language: string;
  postalCode: string;
  priorityRank: number;
  scheduleBannerText: string;
  scheduleId: string;
  scheduleText: string;
  scheduleType: string;
  signOnBonus: string;
  state: string;
  surgePay: string;
  tagLine: string;
  geoClusterId: string;
  geoClusterName: string;
  siteId: string;
  scheduleBusinessCategory: string;
  totalPayRate: string;
  financeWeekStartDate: string;
  laborDemandAvailableCount: number;
  scheduleBusinessCategoryL10N: string;
  firstDayOnSiteL10N: string;
  financeWeekStartDateL10N: string;
  scheduleTypeL10N: string;
  employmentTypeL10N: string;
  basePayL10N: string;
  signOnBonusL10N: string;
  totalPayRateL10N: string;
  distanceL10N: string;
  requiredLanguage: string;
  monthlyBasePay: string;
  monthlyBasePayL10N: string;
  vendorKamName: string;
  vendorId: string;
  vendorName: string;
  kamPhone: string;
  kamCorrespondenceEmail: string;
  kamStreet: string;
  kamCity: string;
  kamDistrict: string;
  kamState: string;
  kamCountry: string;
  kamPostalCode: string;
  payFrequency: string;
  __typename: string;
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
  const url = "https://e5mquma77feepi2bdn4d6h3mpu.appsync-api.us-east-1.amazonaws.com/graphql";

  const graphqlQuery = `
    query searchScheduleCards($searchScheduleRequest: SearchScheduleRequest!) {
      searchScheduleCards(searchScheduleRequest: $searchScheduleRequest) {
        nextToken
        scheduleCards {
          hireStartDate
          address
          basePay
          bonusSchedule
          city
          currencyCode
          dataSource
          distance
          employmentType
          externalJobTitle
          featuredSchedule
          firstDayOnSite
          hoursPerWeek
          image
          jobId
          jobPreviewVideo
          language
          postalCode
          priorityRank
          scheduleBannerText
          scheduleId
          scheduleText
          scheduleType
          signOnBonus
          state
          surgePay
          tagLine
          geoClusterId
          geoClusterName
          siteId
          scheduleBusinessCategory
          totalPayRate
          financeWeekStartDate
          laborDemandAvailableCount
          scheduleBusinessCategoryL10N
          firstDayOnSiteL10N
          financeWeekStartDateL10N
          scheduleTypeL10N
          employmentTypeL10N
          basePayL10N
          signOnBonusL10N
          totalPayRateL10N
          distanceL10N
          requiredLanguage
          monthlyBasePay
          monthlyBasePayL10N
          vendorKamName
          vendorId
          vendorName
          kamPhone
          kamCorrespondenceEmail
          kamStreet
          kamCity
          kamDistrict
          kamState
          kamCountry
          kamPostalCode
          payFrequency
          __typename
        }
        __typename
      }
    }
  `;

  // Match the cURL hardcoded date
  const variables = {
    searchScheduleRequest: {
      locale: "en-US",
      country: "United States",
      keyWords: "",
      equalFilters: [],
      containFilters: [{ key: "isPrivateSchedule", val: ["false"] }],
      rangeFilters: [{ key: "hoursPerWeek", range: { minimum: 0, maximum: 80 } }],
      orFilters: [],
      dateFilters: [{ key: "firstDayOnSite", range: { startDate: "2025-09-09" } }],
      sorters: [{ fieldName: "totalPayRateMax", ascending: "false" }],
      pageSize: 1000,
      jobId,
      consolidateSchedule: true,
    },
  };

  try {
    const response = await axios.post<SearchScheduleResponse>(
      url,
      { query: graphqlQuery, variables },
      { headers: COMMON_HEADERS }
    );

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
