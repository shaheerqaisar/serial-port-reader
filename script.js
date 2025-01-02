async function connectAndReadSerialPort() {
    try {
        // Request user to select a serial port
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Match the baud rate with your device

        const reader = port.readable.getReader();
        console.log("Serial port connected and ready.");

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                console.log("Reader closed.");
                break;
            }

            // Decode and process the data
            const weightData = new TextDecoder().decode(value).trim();
            console.log("Weight Data:", weightData);

            // Send the weight data to your Flask API
            await fetch("https://shaheerqaisar.pythonanywhere.com/api/weighscale", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ weight: weightData }),
            })
                .then((response) => response.json())
                .then((data) => console.log("API Response:", data))
                .catch((error) => console.error("Error sending data to API:", error));
        }

        reader.releaseLock();
        await port.close();
        console.log("Serial port disconnected.");
    } catch (error) {
        console.error("Error connecting to the serial port:", error);
    }
}

// Add an event listener to trigger the function
document.getElementById("connectButton").addEventListener("click", connectAndReadSerialPort);
