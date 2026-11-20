// DM2008 — Activity 8b
// Type 1: Phototransistor Sensor (10 min)
// (Recreated from the DM2008 class code — the original file is on a teammate's computer.)

// SIG connected to analog pin A0
const int lightPin = A0;

void setup() {
  // start communication with your computer at 9600 baud
  Serial.begin(9600);
}

void loop() {
  int luxVal = analogRead(lightPin); // read light level (0 = dark, 1023 = bright)
  Serial.println(luxVal);            // print the value to the Serial Monitor
  delay(100);                        // slow down the output so it's easier to read
}
