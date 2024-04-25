// import { useState } from "react";
import "./App.css";
import ShadowFrame from "./compos/ShadowFrame";
import waitForElm from "./generic/waitForElm";
import { TITIN } from "./svgs";

import { useEffect } from "react";

const getVwVh = (): [number, number] => {
   return [
      Math.max(
         document.documentElement.clientWidth || 0,
         window.innerWidth || 0,
      ),
      Math.max(
         document.documentElement.clientHeight || 0,
         window.innerHeight || 0,
      ),
   ];
};

// for red slant rotation
const rotateRedSlant = (
   redSlant: HTMLElement,
   vw: number,
   vh: number,
): number => {
   let tanhInput;
   //if landscape
   if (vw > vh) {
      //red slant has angled spans middle 60% of vh
      tanhInput = (vh * 0.6) / vw;
   } //if portrait
   else {
      //red slant has angled spans middle 40% of vh
      tanhInput = (vh * 0.4) / vw;
   }
   // console.log(tanhInput);
   // console.log(`tangent: ${Math.tan(tanhInput)}`);

   //slantAglRad is short for redSlantAngleRadians
   let slantAglRad = -1 * Math.tanh(tanhInput);

   redSlant.style.transform = `rotate(${slantAglRad}rad)`;
   //return angle for positionLuke()
   return slantAglRad;
};
//this function takes angle of redslant*(distance from vp center to lukephoto center) to get -y offest from vp center.
const positionLuke = (
   lukePhoto: HTMLElement,
   vw: number,
   vh: number,
   slantAglRad: number,
): DOMRect => {
   const lukeOffset = lukePhoto.getBoundingClientRect();
   //adj is the adjacent side of triangle for tanh function
   const adj = lukeOffset.left + lukeOffset.width * 0.5 - vw * 0.5;
   //y distance from view center to luke photo center
   const yFromVpCenterToLukePhotoCenter = -1 * slantAglRad * adj;
   //calculate the y pos of luke with angle and adjactent to find opposite
   const lukeYPos = vh * 0.5 - yFromVpCenterToLukePhotoCenter;
   //position luke
   lukePhoto.style.top = `${lukeYPos - lukeOffset.height * 0.5}px`;
   //return lukeOffset for slogan positioning
   return lukeOffset;
};
//postition slogan relative to luke
const positionSlogan = (slogan: HTMLElement, lukeOffset: DOMRect) => {
   slogan.style.top = `${lukeOffset.top}px`;
};

const resizeHandler = (
   redSlant: HTMLElement,
   lukePhoto: HTMLElement,
   slogan: HTMLElement,
) => {
   let [vw, vh] = getVwVh();
   let slantAglRad = rotateRedSlant(redSlant, vw, vh);
   let lukeOffset = positionLuke(lukePhoto, vw, vh, slantAglRad);
   positionSlogan(slogan, lukeOffset);
};

function App() {
   var redSlant: HTMLElement;
   var lukePhoto: HTMLElement;
   var slogan: HTMLElement;

   useEffect(() => {
      //execute all useEffect promises in parallel
      Promise.all([
         waitForElm("#red-slant").then((redSlantEl: HTMLElement | null) => {
            redSlant = redSlantEl!;
         }),
         waitForElm("#luke-photo").then((lukePhotoEl: HTMLElement | null) => {
            lukePhoto = lukePhotoEl!;
         }),
         waitForElm("#slogan").then((sloganEl: HTMLElement | null) => {
            slogan = sloganEl!;
         }),
      ]).then(() => {
         resizeHandler(redSlant, lukePhoto, slogan);
         addEventListener("resize", () => {
            resizeHandler(redSlant, lukePhoto, slogan);
         });
      });
   });

   return (
      <>
         <div id="red-slant" />

         <main className="flex justify-center">
            {/* stuff in margins */}
            <div className="w-4/6">
               {/* above the fold */}
               <div className="relative h-screen w-full">
                  <ShadowFrame
                     id="luke-photo"
                     className="absolute right-0 h-96 w-96"
                  >
                     <div className="absolute right-0 top-4 h-3/5 fill-greenwhite">
                        {TITIN}
                     </div>
                     <img
                        className="h-full w-full object-contain"
                        src="webp/lukePhotoNew.webp"
                     />
                  </ShadowFrame>
                  <div id="slogan" className="absolute left-0 stroke-grey-50">
                     <div className="flex flex-row flex-wrap space-x-2 text-6xl text-greenwhite">
                        <div className="font-avem md:w-full ">You,</div>
                        <div className="font-aver">at your best.</div>
                     </div>
                  </div>
               </div>
            </div>
         </main>
      </>
   );
}

export default App;
