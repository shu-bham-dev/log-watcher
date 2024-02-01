import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001");

function App() {
  const [logData, setLogData] = useState([]);

  useEffect(() => {
    // Initial data
    socket.on("initialData", (data) => {
      console.log("Initial Data:", data);
      setLogData((prevData) => [...prevData, data]);
    });

    // Update data
    socket.on("update", (data) => {
      console.log("Update:", data);
      setLogData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log("Log Data::", logData);

  return (
    <div>
      <h1>Log Watcher - </h1>
      <div>
        {logData.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
