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

export async function createApplication(
  jobId: string,
  scheduleId: string,
  bbCandidateId: string,
  accessToken: string,
  API_URL: string,
  JobData : any
) {

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
        authorization: accessToken,
        "bb-ui-version": "bb-ui-v2",
        "cache-control": "no-cache",
        "content-type": "application/json;charset=UTF-8",
        origin: "https://hiring.amazon.com",
        pragma: "no-cache",
        referer: `https://hiring.amazon.com/application/us/?CS=true&jobId=${jobId}&locale=en-US&scheduleId=${scheduleId}&ssoEnabled=1`,
        "user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
        coockie:"adobe-session-id=bf6160c5-028f-415b-8674-5308463a6c6b; adobe-session-id=bf6160c5-028f-415b-8674-5308463a6c6b; AMCV_7742037254C95E840A4C98A6%40AdobeOrg=1585540135%7CMCIDTS%7C20266%7CMCMID%7C65054644544978768393256047732413065474%7CMCAID%7CNONE%7CMCOPTOUT-1750914867s%7CNONE%7CvVersion%7C4.4.0; AMCV_CCBC879D5572070E7F000101%40AdobeOrg=179643557%7CMCIDTS%7C20339%7CMCMID%7C00934745135319001590458269013060026247%7CMCAID%7CNONE%7CMCOPTOUT-1757229462s%7CNONE%7CvVersion%7C5.5.0; AMCV_CCBC879D5572070E7F000101%40AdobeOrg=179643557%7CMCIDTS%7C20339%7CMCMID%7C92201738695735486882606107864876449172%7CMCAID%7CNONE%7CMCOPTOUT-1757235567s%7CNONE%7CvVersion%7C5.5.0; AMCVS_CCBC879D5572070E7F000101%40AdobeOrg=1; AMCVS_CCBC879D5572070E7F000101%40AdobeOrg=1; APISID=4FoDebZVUYEW2kmH/A3oCSo8aqhR9tc9C_; aws-target-data=%7B%22support%22%3A%221%22%7D; aws-target-visitor-id=1750907346284-130697; aws-ubid-main=278-5840686-0034606; aws-userInfo=%7B%22arn%22%3A%22arn%3Aaws%3Aiam%3A%3A850960379385%3Aroot%22%2C%22alias%22%3A%22%22%2C%22username%22%3A%22Darshan%2520Solanki%22%2C%22keybase%22%3A%22mjJetx7RJogkWiJqnsUO0xvGRwPTF70uWSWhwUlifW0%5Cu003d%22%2C%22issuer%22%3A%22https%3A%2F%2Fportal.aws.amazon.com%2Fbilling%2Fsignup%3Ftype%5Cu003dregister%22%2C%22signinType%22%3A%22PUBLIC%22%7D; aws-userInfo-signed=eyJ0eXAiOiJKV1MiLCJrZXlSZWdpb24iOiJ1cy1lYXN0LTEiLCJhbGciOiJFUzM4NCIsImtpZCI6IjBkMDRiODc2LTE1MGItNGRmZS05MDc0LWYyMzVmMzk5MGJiNSJ9.eyJzdWIiOiIiLCJzaWduaW5UeXBlIjoiUFVCTElDIiwiaXNzIjoiaHR0cHM6XC9cL3BvcnRhbC5hd3MuYW1hem9uLmNvbVwvYmlsbGluZ1wvc2lnbnVwP3R5cGU9cmVnaXN0ZXIiLCJrZXliYXNlIjoibWpKZXR4N1JKb2drV2lKcW5zVU8weHZHUndQVEY3MHVXU1dod1VsaWZXMD0iLCJhcm4iOiJhcm46YXdzOmlhbTo6ODUwOTYwMzc5Mzg1OnJvb3QiLCJ1c2VybmFtZSI6IkRhcnNoYW4lMjBTb2xhbmtpIn0.4ZPL9hzpG0d5sfj7ecn67K3xNkQwEAd45p5C_umsFsl5XyGemeXTwYiwX0AKFbvKXt1baGD-mPegx05LM26Jvckpv11xkOtW6i7pfkQAz1dWobgFlgQGzZCXVJRUn7MS; aws-waf-token=de598145-bb18-4f48-bb87-2bb90d1c19f8:BQoAYv42ZFW6AAAA:5jr8MkuZi/rJV/Jg1U05nkQ21tq5ApC1ldai8qgQIIh9gyMG5g0LXYhV85auLVNiDE3OqotXBQ+ZGs6YBuUOOaO3Exrg74hK2MIO+tTFaawL0KJlG52BXzJQ0aVT1gbk4O8xOaqI8cjika589lxRZld/CqzqmvYDKIMl/+ptb/22vkWUExvh1M6VYyOfcv+R4/+o; aws-waf-token=550c2bca-ff47-466b-a815-17e6d613292a:EQoAq+Ej9NRxAAAA:vRRhTZajjeVRcyjjghoUqnbhdZbPUT7ulDKUjyn/w9S0Tp5mizbadeG4tZESLiC06sZIrtjhtH5Ta+ZnxO/r+KePShfvslGJVix2vYKalhvINvkld51V79+Sj4loNMTwE+6dSz4GzP9okjeUfgpefw4KzwNOyPMI37/k0YHjnRy1rN6/PUJtI6lGv8XXXrucaT+u2twaPb6YrJyvOH27qmy3; cwr_u=095012ab-a6ba-43d7-9aad-cfb87eb4008b; HSID=AxfKxz0AG61iK1XBt; hvh-country-code=CA; hvh-default-locale=en-CA; hvh-locale=en-CA; hvh-locale=en-CA; hvh-stage=prod; JSESSIONID=699625ED163B28A32317E456D950386D; kndctr_7742037254C95E840A4C98A6_AdobeOrg_consent=general=in; kndctr_7742037254C95E840A4C98A6_AdobeOrg_identity=CiYxMzc5ODI0NjE1NzU2NzQ0NDkwNDE0MjE1OTU1Nzg3MjYyMzEyMFITCPm619H6MhABGAEqBElORDEwAPAB-brX0foy; LOGIN_INFO=AFmmF2swRQIgaF9SHd9jjQglRS88v5DhdRnaBmKo64Zn2ka1-hA6GCcCIQCgZT7zxjjUbjarrBCksmPaDBRMYUFR5C--_WQtSUcCnQ:QUQ3MjNmd0tUd0dPeUxqMmMyTHdSbEs1RHFWYWFLQ1JuQU1TQXdLc3dpUnBCd2I0X28yaVBNZFowZ1FYdWFwZnRSbVZKVXFpS1djME1jbHZrWmdKd1IxV3RVOEVjY1BIb1IwMkFOQld2bEYyLVI0alZ4WXZoNkQyclRraU9WZGtWZ2k0UUJ2TGpKaW01U0p3Tm13eE5NU19iVE5zT2JTaXFR; PREF=tz=Asia.Calcutta&f4=4000000&f6=40000000&f7=100; regStatus=pre-register; SAPISID=6zqc65DdZKxQYOS6/Aq24x8rkOrVrZXDg9; session-id=143-8509110-4600857; session-id-time=2082787201l; session-token=xZ7Tpu7kSM28/LalaC/7w1m1W8QUx5xIrM8fQBr8WhSWzkTh5+3JX5zCRn9qyooIiW7ISGVSGvCQNeZKzGrmw69UUM6XaMEYSp1SDFLSgjK2yfTEpAuwce9SFOB0+0jQd19WBTiZQgHuxiF01OtQsjFEFpR3G/HUQuVlHPHgew0lVG2B3/3dBYWahTD/a/zvolJriPvujrLjBo+eBm7p8Xryq8U1tFGx+IFH1kcFY/BzgIN0L8BXFF8ygolU3fMl6NbKwDxrsZPKlVkZ9dFH4LZW+0BuRFBCARsuee4eEVrnz5SdfFeAcUEmTV+lwvbHBuDjhRYA/ONxINl0ninA2OvK4EFcVItA; SID=g.a0000gjT-Mo6uHxQ7pSZ5QG9wMMee2CLD0HMHChdfoxhpNNdJCUIgCir6QDc90f3-a4uJ-UyigACgYKAUoSARMSFQHGX2MiJmGnGHO-usgeICIZ5UNTthoVAUF8yKrejO9suLdvSiAGdF_efoj-0076; SIDCC=AKEyXzXS0q0jn3u1QKZ0ILKvO56inmafz34Xsy7FSTPA12kWGBKzArK8SIaBVdCd3cV7dMfDOg; SSID=AAyIqmTUt_RHc4nfm; ubid-main=133-6672082-7420029; VISITOR_INFO1_LIVE=8vK38zhcqlo; VISITOR_PRIVACY_METADATA=CgJJThIEGgAgLw%3D%3D; YSC=ZlMAKch21P0",
      },
      withCredentials: true,
    });

    console.log("response--->",response)

    if(response.status === 200){
      const notification = {
          Title: JobData.jobTitle,
          Location: JobData.locationName,
          Type: JobData.jobType,
          Employement_Type: JobData.employmentType,
      } 
      console.log("✅ Application created:");
      sendMessage(notification)
    }
    return true;
  } catch (error: any) { 
    console.log("error",error);
    console.error("❌ Error creating application:");
  }
}
