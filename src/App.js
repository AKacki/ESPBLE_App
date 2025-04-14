import React, { useState } from 'react';
import './App.css';

// UUIDs for Device 1 (DHT Sensor)
const DHT_SERVICE_UUID = '12345678-1234-5678-1234-56789abcdef0';
const TEMPERATURE_UUID = '12345678-1234-5678-1234-56789abcdef1';
const HUMIDITY_UUID = '12345678-1234-5678-1234-56789abcdef2';

// UUIDs for Device 2 (BMP Sensor)
const BMP_SERVICE_UUID = '22345678-1234-5678-1234-56789abcdef0';
const BMP_UUID = '22345678-1234-5678-1234-56789abcdef1';

function App() {
  // Device 1 states
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [isDHTConnected, setIsDHTConnected] = useState(false);

  // Device 2 states
  const [lightLevel, setLightLevel] = useState(null);
  const [isLightConnected, setIsLightConnected] = useState(false);

  // Connect to DHT Sensor
  const connectDHTDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [DHT_SERVICE_UUID] }],
      });
      const server = await device.gatt.connect();
      setIsDHTConnected(true);

      const service = await server.getPrimaryService(DHT_SERVICE_UUID);

      const tempChar = await service.getCharacteristic(TEMPERATURE_UUID);
      const tempValue = await tempChar.readValue();
      setTemperature(new TextDecoder().decode(tempValue));

      const humChar = await service.getCharacteristic(HUMIDITY_UUID);
      const humValue = await humChar.readValue();
      setHumidity(new TextDecoder().decode(humValue));
    } catch (error) {
      console.error('Failed to connect to DHT device:', error);
    }
  };

  // Connect to Light Sensor
  const connectLightDevice = async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [LIGHT_SERVICE_UUID] }],
      });
      const server = await device.gatt.connect();
      setIsLightConnected(true);

      const service = await server.getPrimaryService(LIGHT_SERVICE_UUID);
      const lightChar = await service.getCharacteristic(LIGHT_UUID);
      const lightValue = await lightChar.readValue();
      setLightLevel(new TextDecoder().decode(lightValue));
    } catch (error) {
      console.error('Failed to connect to Light device:', error);
    }
  };

  return (
    <div className="App">
      <h1>📡 BLE Weather Station Dashboard</h1>

      <div className="device-section">
        <h2>Device 1: DHT Sensor</h2>
        <button onClick={connectDHTDevice} disabled={isDHTConnected}>
          {isDHTConnected ? 'Connected ✅' : 'Connect DHT Device'}
        </button>
        {temperature && humidity ? (
          <div>
            <p>🌡️ Temperature: {temperature} °C</p>
            <p>💧 Humidity: {humidity} %</p>
          </div>
        ) : (
          <p>Waiting for DHT sensor data...</p>
        )}
      </div>

      <hr />

      <div className="device-section">
        <h2>Device 2: Light Sensor</h2>
        <button onClick={connectLightDevice} disabled={isLightConnected}>
          {isLightConnected ? 'Connected ✅' : 'Connect Light Device'}
        </button>
        {lightLevel ? (
          <p>💡 Light Level: {lightLevel}</p>
        ) : (
          <p>Waiting for light sensor data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
