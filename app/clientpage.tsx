"use client";

import Image from "next/image";
import "./mainpage.css";
import { useEffect, useState } from "react";
import Example from "./select_menu"
import { OurRegion, OurEventInfo, OurExamPack, OurTestCenterInfo } from "./page";

const mystery_word_server = "Obama";

function filterExamPacks (exam_packs: OurExamPack[], region_index: number, event_index: number) {
  const filtered: OurExamPack[]  = [];

  if (event_index == -1 && region_index == -1) {
    return exam_packs;
  } else if (event_index == -1) {

    for (const pack of exam_packs) {
      if (pack.region_index == region_index) {
        filtered.push(pack);
      }
    }

  } else if (region_index == -1) {

    for (const pack of exam_packs) {
      if (pack.event_index == event_index) {
        filtered.push(pack);
      }
    }

  } else {

    for (const pack of exam_packs) {
      if (pack.event_index == event_index && pack.region_index == region_index) {
        filtered.push(pack);
      }
    }

  }

  return filtered;
}

export default function ClientPage({ events, test_centers, exam_packs, regions }: { events: OurEventInfo[]; test_centers: OurTestCenterInfo[]; exam_packs: OurExamPack[]; regions: OurRegion[]; }) {
  const [backdrop, setBackdrop] = useState(-1);
  const [eventIndex, setEventIndex] = useState(0);
  const [regionIndex, setRegionIndex] = useState(0);

  let background_opacity = 0;
  let hideMode = backdrop == 1;

  if (backdrop == 0) background_opacity = 10;
  else if (backdrop == 1) background_opacity = 20;

  let switchBackdrop = () => {
    if (backdrop == 0) setBackdrop(1);
    else if (backdrop == 1) setBackdrop(0);
  }


  console.log("Region index", regionIndex);

  // console.log("Events", events);
  console.log("Test centers", test_centers);
  console.log("Exam packs", exam_packs);
  // console.log("Regions", regions);

  return (
    <body className={"bg-primary relative w-screen h-screen text-whitetext overflow-x-hidden transition ease-out duration-400 delay-200 " + (hideMode ? "scale-90" : "")}>
        <Image
            src="/background_raw_fit.jpg"
            width={900}
            height={506}
            className={"w-screen h-screen fixed object-center top-0 left-0 object-cover transition-opacity -z-10 duration-700  ease-out delay-300 opacity-" + background_opacity + (hideMode ? " rounded-3xl" : "")}
            quality={100}
            loading="lazy"
            onLoadingComplete={(image) => {setBackdrop(0)}}
            alt=""
        />

      <div className={"w-screen h-screen fixed bg-primary -z-20"}>
        
      </div>

      

      <div className="w-full h-full flex flex-row">
        <div className="flex-1 h-full pl-12 pt-10 pb-6 flex flex-col justify-between">
            <div className={"top_section transition duration-300 " + (hideMode ? "opacity-0" : "opacity-100")}>
              <h1 className="font-roboto text-5xl font-medium">SAT Seat Availability</h1>
              <h2 className="font-roboto text-4xl tracking-wide font-light">Uzbekistan</h2>

              <div className="form mt-10 space-y-10 w-3/5">
                <div className="date_selection">
                  <p className="text-xl font-publicsans">Select Date:</p>
                  <div className="date_badges flex flex-row flex-wrap gap-x-5 gap-y-4 mt-3">
                    {events.map((v, idx) => (
                        <div key={idx} onClick={() => setEventIndex(idx)} className={"bg-secondary flex flex-row items-center gap-x-2 py-2 px-5 rounded-full font-publicsans font-medium hover:cursor-pointer hover:bg-violet-50 hover:text-primary " + (idx == eventIndex && "ring-2 ring-violet-300")}>
                          {(idx == 0 && eventIndex <= 0) && <svg xmlns="http://www.w3.org/2000/svg" fill="violet" viewBox="0 0 24 24" strokeWidth={1.5} stroke="violet" className="w-4 h-4"> <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" /> </svg>}
                          {v.eventDisplayDate}
                        </div>
                    ))}
                  </div>
                </div>
                <div className="region_selection">
                  <p className="text-xl font-publicsans">Select region:</p>
                  <div className="mt-3 w-11/12">
                    <Example regions_list={regions} selected_region_idx={regionIndex} setRegionIndex={setRegionIndex} />
                  </div>
                </div>
              </div>
            </div>
            <div className={"bottom_section z-40 "}>
              <div className="w-full h-fit flex flex-row items-center flex-wrap gap-x-10">
                <Image src={"/uzlogo.png"} alt="" className="h-14 w-auto" width={130} height={125}></Image>
                <div className="bg-white h-12 px-5 rounded-full flex flex-row items-center justify-center">
                  <Image src={"/college_board.png"} alt="" className="h-10 w-auto" width={150} height={54.5}></Image>
                </div>
              </div>
              <div onClick={() => switchBackdrop()} className={"mt-4 w-fit transition-all rounded-xl text-white/80"}>
                <p className="font-publicsans font-light hover:underline hover:cursor-pointer w-fit">Part of Uzbekistan Sustainable Development Project. <br/> Background: Ulugbek's Observatory, Samarkand, Uzbekistan.</p>
              </div>
            </div>
        </div>


        <div className={"flex-1 h-full transition-all " + (hideMode ? "opacity-0" : "opacity-100")}>
          <div className="h-full scrollable_list text-blacktext pr-8 pt-6 pb-6 pl-3 space-y-10 scale-95">
            {filterExamPacks(exam_packs, regionIndex, eventIndex).map((v, idx) => (
              <div className="rounded-2xl px-6 py-5 hover:text-blacktext hover:bg-indigo-50 hover:ring-0 group transition bg-indigo-300/20 text-white/95 ring-white/40 ring-1">
                <div className="flex flex-row items-center flex-wrap justify-between">
                  <h2 className="text-[24px] font-publicsans font-light ">{test_centers[v.test_center_index].name}</h2>
                  <p className="font-publicsans group-hover:text-blacktext/90 text-white/50 ">{events[v.event_index].eventDisplayDate + ", " + events[v.event_index].weekdayDisplay}</p>
                </div>
                <div className="w-3/5 mt-1">
                  <p className="font-publicsans italic group-hover:text-blacktext/65 text-base text-white/50">{test_centers[v.test_center_index].address}</p>
                </div>
                <div className="flex flex-row items-center gap-x-4 mt-4">
                  <span className="relative flex h-3 w-3">
                    <span className={"group-hover:animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 " + (v.availibility ? "bg-[#47A40F]" : "bg-[#DA1E28]")}></span>
                    <span className={"relative inline-flex rounded-full h-3 w-3 " + (v.availibility ? "bg-[#47A40F]" : "bg-[#DA1E28]")}></span>
                  </span>
                  <p className="font-publicsans text-base">{(v.availibility ? "Available" : "Unavailable")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </body>
  );
}