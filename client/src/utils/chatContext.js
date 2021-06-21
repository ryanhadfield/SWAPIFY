import React from "react";

const chatContext = React.createContext({
  matchId: "",
  recentText: "",
  setChat: () => {},
  setNewText: () => {}
});

export default chatContext;
