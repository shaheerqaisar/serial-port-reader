// References to HTML elements
const connectButton = document.getElementById("connectButton");
const output = document.getElementById("output");

// Function to log messages to the UI
function logMessage(message) {
    output.textContent += `${message}\n`;
}

async function connectAndReadSerialPort() {
    try {
        logMessage("Requesting serial port...");
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });
        logMessage("Serial port connected.");

        const reader = port.readable.getReader();
        logMessage("Reader initialized. Waiting for data...");

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                logMessage("Reader stopped.");
                break;
            }
        
            // Decode and process the received data
            let weightData = new TextDecoder().decode(value).trim();
        
            // Remove 'kg' and any extra spaces
            weightData = weightData.replace("kg", "").trim();
        
            // Check if the processed weight data is numeric
            if (!isNaN(weightData)) {
                logMessage(`Processed weight data: ${weightData}`);
                try {
                    const response = await fetch("https://shaheerqaisar.pythonanywhere.com/api/weight", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ weight: weightData }),
                    });
        
                    const responseData = await response.json();
                    logMessage(`API Response: ${JSON.stringify(responseData)}`);
                } catch (apiError) {
                    logMessage(`Error sending data to API: ${apiError}`);
                }
            } else {
                logMessage(`Invalid weight data received: ${weightData}`);
            }
        }
        

        reader.releaseLock();
        await port.close();
        logMessage("Serial port disconnected.");
    } catch (error) {
        logMessage(`Error during serial port communication: ${error}`);
    }
}

// Add an event listener to the button
connectButton.addEventListener("click", connectAndReadSerialPort);
