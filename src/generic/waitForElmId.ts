export default function waitForElmId(selector: string): Promise<HTMLElement> {
   return new Promise((resolve) => {
      if (document.querySelector(selector)) {
         return resolve(document.getElementById(selector)!);
      }

      const observer = new MutationObserver(() => {
         if (document.querySelector(selector)) {
            observer.disconnect();
            resolve(document.getElementById(selector)!);
         }
      });

      // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
      observer.observe(document.body, {
         childList: true,
         subtree: true,
      });
   });
}
