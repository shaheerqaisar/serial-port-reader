// References to HTML elements
const connectButton = document.getElementById("connectButton");
const output = document.getElementById("output");

let port;
let reader;

// Function to connect to a serial port
async function connectToSerialPort() {
    try {
        // Request user to select a serial port
        port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Set the baud rate (match your device's setting)

        output.textContent += "Serial port connected.\n";

        // Read data from the serial port
        readFromSerialPort();
    } catch (error) {
        console.error("Error connecting to serial port:", error);
        output.textContent += "Failed to connect to serial port.\n";
    }
}

// Function to read data from the serial port
async function readFromSerialPort() {
    try {
        const textDecoder = new TextDecoderStream();
        const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
        reader = textDecoder.readable.getReader();

        output.textContent += "Reading data...\n";

        while (true) {
            const { value, done } = await reader.read();
            if (done) {
                output.textContent += "Reader stopped.\n";
                break;
            }
            // Append the received data to the output
            output.textContent += `Received: ${value}\n`;
        }

        reader.releaseLock();
    } catch (error) {
        console.error("Error reading from serial port:", error);
        output.textContent += "Error reading from serial port.\n";
    }
}

// Event listener for the button
connectButton.addEventListener("click", connectToSerialPort);
