import "amazon-connect-streams";
import React, { memo, useRef, useEffect } from "react";

const CONNECT_NAME = "contact-center-poc";

const ConnectCCP = () => {
  const ref = useRef();

  useEffect(() => {
    try {
      if (typeof window === "undefined") throw new Error("window missing");
      if (typeof window.connect === "undefined") throw new Error("global connect missing");
      console.log("init start CCP");
      window.connect.core.initCCP(ref.current, {
        ccpUrl: `https://${CONNECT_NAME}.awsapps.com/connect/ccp-v2/softphone`,
        loginPopup: true,
        region: "eu-west-2",
        loginPopupAutoClose: true,
        loginOptions: {
          autoClose: true,
          height: 600,
          width: 400,
          top: 0,
          left: 0,
        },
        softphone: {
          allowFramedSoftphone: true,
          // disableRingtone: false,
          // ringtoneUrl: "./ringtone.mp3"
        },
      });
      console.log("init end CCP");
      // window.connect.contact(subscribeToContactEvents);
    } catch (e) {
      console.log(e);
    }
  }, []);

  return <div ref={ref} style={{ height: "100%", border: "solid", display: "none" }} />;
};

export default memo(ConnectCCP);
