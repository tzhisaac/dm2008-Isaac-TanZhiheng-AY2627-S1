// DM2008 — Coding Jam (Week 9)
// Sensor-to-Screen
// By Tan Zhiheng Isaac & Belinda Chai Yu Xuan
// (Rebuilt from our Activity 9a code and our video — the original file is on Isaac's computer.)
//
// Reads the ultrasonic distance sensor on A0 and sends the distance (cm)
// to p5.js over serial, one number per line.
// The LED on pin 9 still gets brighter as your hand gets closer (from Activity 9a).

const int usSensorPin = A0;
const float usMaxRange = 520.0;
const float dataSize = 1023.0;

const int ledPin = 9; // PWM pin (~)

float sensorVal, distVal;
int brightness = 0;

void setup() {
  Serial.begin(9600); // must match port.open(9600) in sketch.js
  pinMode(ledPin, OUTPUT);
}

void loop() {
  sensorVal = analogRead(usSensorPin);
  distVal = sensorVal * usMaxRange / dataSize;

  // Clamp to a range that suits a desk setup (cm)
  if (distVal < 5)   distVal = 5;
  if (distVal > 100) distVal = 100;

  // closer = brighter
  brightness = map(distVal, 5, 100, 255, 0);
  brightness = constrain(brightness, 0, 255);
  analogWrite(ledPin, brightness);

  // send ONLY the number, so p5.js can turn it straight into a float
  Serial.println(distVal);

  delay(50);
}
