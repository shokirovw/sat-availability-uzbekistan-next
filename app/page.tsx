import ClientPage from "./clientpage2";

type ColBoardEventInfo = {
    adminId: number,
    asmtEventId: number,
    eventTitle: string,
    eventStartTs: string,
    eventDisplayDate: string,
    eventFormattedDate: string,
    eventInternational: boolean,
    finalRegistrationTs: string,
    intlFinalRegTs: string
}

type ColBoardTestCenterAtEventDate = {
    name: string,
    code: string,
    address1: string,
    address2: string,
    address3: string,
    city: string,
    state: string,
    region: string,
    zip: string,
    country: string,
    distance: string,
    seatAvailability: boolean
}

const FetchOnFulfilled = (response: Response) => {
    if (response.status !== 200 && !response.ok) {
      throw new Error(`[${response.status}] Unable to fetch resource`)
    }

    return response.json()
}
  
const FetchOnRejected = (err: Error) => {
    console.error(err)
    throw new Error(`Some error`)
}

async function prepareData () {
    const colboard_events_data: ColBoardEventInfo[] = await 
        fetch('https://sat-admin-dates.cms-prod.collegeboard.org/', { next: { revalidate: 43200 } })
            .then(FetchOnFulfilled, FetchOnRejected)
            .then(json => json)

    const testCentersPromises = [];

    for (let i = 0; i < colboard_events_data.length; ++i) {
        let date = colboard_events_data[i].eventFormattedDate;

        testCentersPromises.push(
            fetch(`https://aru-test-center-search.cms-prod.collegeboard.org/prod/test-centers?date=${date}&country=UZ`, { next: { revalidate: 3600 } })
                .then(FetchOnFulfilled, FetchOnRejected)
                .then(json => json)
        );
    }

    const test_centers_at_events_data: ColBoardTestCenterAtEventDate[][] = await Promise.all([...testCentersPromises]);



    return { colboard_events_data, test_centers_at_events_data };
} 

export type OurEventInfo = {
    title: string;
    eventDisplayDate: string;
    eventFormattedDate: string;
    eventRawDate: string;
    registrationEndRawDate: string;
    weekdayDisplay: string;
}

export type OurTestCenterInfo = {
    name: string;
    code: string;
    address: string;
    displayCity: string;
    region_index: number;
}

export type OurExamPack = {
    test_center_index: number,
    region_index: number;
    event_index: number,
    availibility: boolean
}

export type OurRegion = string;

const regions: string[] = [
    "Tashkent", // 0
    "Tashkent Region", // 1
    "Andijan Region", // 2
    "Bukhara Region", // 3
    "Fergana Region", // 4
    "Jizzakh Region", // 5
    "Namangan Region", // 6
    "Navoi Region", // 7
    "Qashqadaryo Region", // 8
    "Samarqand Region", // 9
    "Sirdaryo Region", // 10
    "Surxondaryo Region", // 11
    "Xorazm Region", // 12
    "Nukus", // 13
    "Others" // 14
]

const keywords: { [key: string]: number } = {
    "Nurafshon City": 1,
    "TASHKENT": 0,
    "Jizzakh": 5,
    "Nukus": 13,
    "Namangan": 6,
    "Fergana city": 4,
    "Samarkand": 9,
    "Bukhara": 3,
    "Gulistan, Sirdarya": 10,
    "Tashkent": 0,
    "Khiva": 12,
    "Termez": 11,
    "Andijon": 2,
    "Tashkent City": 0,
    "Navoi": 7
}

function getRegionIndex (test_center: ColBoardTestCenterAtEventDate): number {
    let temp = keywords[test_center.city];

    if (Number.isInteger(temp)) return temp;
    else return 14;
}

async function BusinessLogic () {
    const { colboard_events_data, test_centers_at_events_data } = await prepareData();

    let events: OurEventInfo[] = [];
    let test_centers: OurTestCenterInfo[] = [];
    let test_centers_counter = 0;
    let exam_packs: OurExamPack[] = [];
    
    for (let i = 0; i < colboard_events_data.length; ++i) {
        let element = colboard_events_data[i];

        events.push({
            title: element.eventTitle,
            eventDisplayDate: element.eventDisplayDate.split(",")[0],
            eventFormattedDate: element.eventFormattedDate,
            eventRawDate: element.eventStartTs,
            registrationEndRawDate: element.finalRegistrationTs,
            weekdayDisplay: element.eventDisplayDate.split(" — ")[1]
        })
    }

    let checked_test_centers_code : {[key: string]: number} = {}

    for (let i = 0; i < test_centers_at_events_data.length; ++i) {
        let test_centers_at_event = test_centers_at_events_data[i];

        for (let j = 0; j < test_centers_at_event.length; ++j) {
            let test_center = test_centers_at_event[j];

            let region_index = getRegionIndex(test_center);

            let test_center_index;

            if (checked_test_centers_code[test_center.code] !== undefined) {
                test_center_index = checked_test_centers_code[test_center.code];
            } else {
                test_centers[test_centers_counter] = {
                    name: test_center.name,
                    code: test_center.code,
                    displayCity: test_center.city + ", " + test_center.region,
                    address: test_center.address1 + " " + test_center.address2 + " " + test_center.address3,
                    region_index: region_index
                };

                checked_test_centers_code[test_center.code] = test_centers_counter;

                test_center_index = test_centers_counter;

                ++test_centers_counter;
            }

            exam_packs.push({
                event_index: i,
                region_index: region_index,
                availibility: test_center.seatAvailability,
                test_center_index: test_center_index
            })

        }
    }

    return { events, test_centers, exam_packs }
}

export default async function Page () {

    const { events, test_centers, exam_packs } = await BusinessLogic();

    return (
        <>
            <ClientPage events={events} test_centers={test_centers} exam_packs={exam_packs} regions={regions}  />
        </>
    );
        
}

