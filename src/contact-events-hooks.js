// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

import { useEffect, useState } from "react";
import { genLogger } from "./lib";
import "amazon-connect-streams";
import session from "./session";

export const useInterval = (ms) => {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setDate(new Date()), ms);
    return () => clearInterval(interval);
  }, [ms]);
  return date;
};

const checkCallbackIsFunc = (fn) => {
  if (typeof fn !== "function") throw new Error("Callback not a function");
};

const useContactPrivate = (logger, callback, params) => {
  checkCallbackIsFunc(callback);
  useEffect(() => {
    let isCancelled = false;
    const { log } = logger;
    log("---1---");
    const sub = window.connect.contact((c) => {
      log("contacted");
      session.contact = c;
      try {
        if (isCancelled === false) {
          callback(c, params);
        } else {
          log("was canceled, not calling callback");
        }
      } catch (e) {
        logger.error("connect error", e);
      }
    });
    return () => {
      isCancelled = true;
      log("unsubscribing");
      sub.unsubscribe();
    };
  }, [logger, callback]);
};

export const useContact = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useContact");
  useContactPrivate(logger, callback);
};

export const useAccepted = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useAccepted");
  logger.log("init");

  useContactPrivate(logger, (c) => {
    c.onAccepted(() => {
      logger.log("accepted");
      try {
        callback(c);
      } catch (e) {
        logger.error("connect error", e);
      }
    });
  });
};

export const useConnecting = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useConnecting");
  logger.log("init");

  useContactPrivate(logger, (c) => {
    c.onConnecting(() => {
      logger.log("connecting");
      try {
        callback(c);
      } catch (e) {
        logger.error("connect error", e);
      }
    });
  });
};

export const useConnected = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useConnected");
  logger.log("init");

  useContactPrivate(logger, (c) => {
    c.onConnected(() => {
      logger.log("connected");
      try {
        callback(c);
      } catch (e) {
        logger.error("connect error", e);
      }
    });
  });
};

export const useDestroy = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useDestroy");
  useContactPrivate(logger, (c) => {
    c.onDestroy(() => {
      logger.log("destroyed");
      try {
        callback(c);
      } catch (e) {
        logger.error("connect error", e);
      }
    });
  });
};

export const useCallEnded = (callback, params) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useCallEnded");
  useContactPrivate(
    logger,
    (c) => {
      c.onEnded(() => {
        logger.log("call ended");
        try {
          callback(c);
        } catch (e) {
          logger.error("connect error", e);
        }
      });
    },
    params
  );
};

export const useCallCompleted = (callback) => {
  checkCallbackIsFunc(callback);
  const logger = genLogger("useCallCompleted");
  useContactPrivate(logger, (c) => {
    let wasOnCall = false;
    c.onConnected(() => {
      logger.log("call initiated");
      wasOnCall = true;
    });
    c.onACW(() => {
      logger.log("ACW initiated");
      if (wasOnCall) {
        logger.log("ACW after on call");
        try {
          callback(c);
        } catch (e) {
          logger.error("connect error", e);
        }
      } else {
        logger.log("ACW without being on call");
      }
    });
  });
};

export const useGetAgentName = (callback) => {
  checkCallbackIsFunc(callback);
  useEffect(() => {
    window.connect.agent((agent) => {
      callback(agent);
    });
  }, []);
};

export const acceptCall = () => {
  console.log("acceptCall:::session::contact", session.contact);
  session.contact.accept({
    success: function () {
      console.log("Accepted contact via Streams");
    },
    failure: function () {
      console.log("Failed to accept contact via Streams");
    },
  });
  console.log("acceptCall:::completed", session.contact);
};

export const rejectCall = () => {
  console.log("rejectCall:::session::contact", session.contact);

  session.contact.reject({
    success: function () {
      console.log("Rejected contact via Streams");
    },
    failure: function () {
      console.log("Failed to reject contact via Streams");
    },
  });
  console.log("rejectCall:::completed", session.contact);
};

export const endCall = () => {
  console.log("endCall:::session::contact", session.contact);

  session.contact.getAgentConnection().destroy({
    success: function () {
      console.log("destroy contact via Streams");
    },
    failure: function () {
      console.log("Failed to destroy contact via Streams");
    },
  });
  console.log("endCall:::completed", session.contact);
};

export const muteAgent = () => {
  const agent = new window.connect.Agent();
  const contact = agent.getContacts(window.connect.ContactType.VOICE)?.[0];

  // Get all open active connections
  const activeConnections = contact?.getConnections().filter((conn) => conn.isActive()) || [];

  if (activeConnections.length === 0) {
    console.log("No Active Connections to mute");
    return;
  }

  // Check if we are using multiparty and see if there more than 2 active connections
  if (contact.isMultiPartyConferenceEnabled() && activeConnections.length > 2) {
    // if any of those are in connecting mode
    const connectingConnections =
      contact?.getConnections().filter((conn) => conn.isConnecting()) || [];
    if (connectingConnections.length === 0) {
      console.log("Agent Connection is muted at the server side");
      contact.getAgentConnection().muteParticipant();
    } else {
      console.log("Agent Connection cannot be muted while multi party participant is connecting");
    }
  } else {
    console.log("Agent connection muted at the client side");
    agent.mute();
  }
};
