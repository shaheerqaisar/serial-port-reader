async function connectAndReadSerialPort() {
    try {
        // Request and open the serial port
        console.log("Requesting serial port...");
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        console.log("Serial port connected.");

        const reader = port.readable.getReader();
        console.log("Reader initialized, waiting for data...");

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Reader stopped.");
                break;
            }

            const weightData = new TextDecoder().decode(value).trim();
            console.log("Received weight data:", weightData);

            // Send data to the API
            try {
                const response = await fetch("https://shaheerqaisar.pythonanywhere.com/api/weight", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ weight: weightData }),
                });
                const responseData = await response.json();
                console.log("API Response:", responseData);
            } catch (apiError) {
                console.error("Error sending data to API:", apiError);
            }
        }

        reader.releaseLock();
        await port.close();
        console.log("Serial port disconnected.");
    } catch (error) {
        console.error("Error during serial port communication:", error);
    }
}

// Add an event listener to the button
document.getElementById("connectButton").addEventListener("click", connectAndReadSerialPort);
