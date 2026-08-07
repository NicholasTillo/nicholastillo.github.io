// Arduino source for the Rotom Tamagotchi project, shown as read-only code on
// the Creative Works page. Stored as a plain string so no bundler raw-loader is
// needed. ponytail: hand-pasted string, regenerate from the .ino if it changes.
const rotomTamagatchiCode = String.raw`//Liquid Crystal for LCD display with alot of pins.
//#include <LiquidCrystal.h>

//Gyatta Figure out low power later,
//#include "ArduinoLowPower.h"


//OLED Libraries,
#include <SPI.h>
#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

// Sprite bitmaps (128x64px each) live in the .ino: epd_bitmap_RotomSprite1,
// epd_bitmap_RotomSprite2, epd_bitmap_RotomNeutral3, and the Banana/Cheri/Leppa
// feed frames. Omitted here for length -- see the GitHub repo for the full data.

//OLED Init Stuff,
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels

// Declaration for an SSD1306 display connected to I2C (SDA, SCL pins)
#define OLED_RESET     -1 // Reset pin # (or -1 if sharing Arduino reset pin)

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

uint8_t image_data[SCREEN_WIDTH * SCREEN_HEIGHT / 8];

int touch = 10;  // pin for touch sensor
int ledPin = 5; // pin for the LED

enum States {
  greetings,
  touching,
  feeding,

  super_happy,
  happy,
  neutral,
  sad,
  super_sad
};


int rotom_happiness = 0;
const int rotom_max_happiness = 2000;


enum States rotom_current_state = neutral;
enum States rotom_previous_state = neutral;

int counter;
int counter2;


void setup() {

  Serial.begin(115200);

  // SSD1306_SWITCHCAPVCC = generate display voltage from 3.3V internally
  if(!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
    Serial.println(F("SSD1306 allocation failed"));
    for(;;); // Don't proceed, loop forever
  }

  // Clear the buffer
  display.clearDisplay();

  display.setTextSize(2); // Draw 2X-scale text
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.println(F("I Love You Raksha"));
  display.display();      // Show initial text

  delay(2000);
  randomSeed(100);
}


void playAnimation(enum States state, int counter_number){
  if(state == neutral){
    int randomNum = random(7);
    if(randomNum == 0){ rotomAnimationNeutral1(); }
    if(randomNum == 1){ rotomAnimationNeutral2(); }
    if(randomNum == 2){ rotomAnimationNeutral3(); }
    if(randomNum == 3){ rotomAnimationNeutral4(); }
    if(randomNum == 4){ rotomAnimationNeutral5(); }
    if(randomNum == 5){ rotomAnimationNeutral6(); }
    if(randomNum == 6){ rotomAnimationNeutral7(); }
  }
  if(state == feeding){
    int randomNum = random(3);
    if(randomNum == 0){ rotomAnimationFeedLeppa(); }
    else if(randomNum == 1){ rotomAnimationFeedBanana(); }
    else if(randomNum == 2){ rotomAnimationFeedCheri(); }
  }
}

void rotomAnimationNeutral1(){
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite2, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);
}

void rotomAnimationNeutral2(){
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite2, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(300);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(300);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(300);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(300);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);
}

void rotomAnimationNeutral3(){
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);
}

void rotomAnimationNeutral4(){
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(1000);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite2, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(1000);

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 - rotom_happiness);
}

void rotomAnimationNeutral5(){
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(3000 + rotom_happiness);

  display.drawCircle(64, 30, 15, WHITE);
  display.display();
  delay(1000);

  if(rotom_happiness > 1500){
    display.drawLine(0, 0, 21, 17, WHITE);
    display.drawLine(57, 0, 55, 6, WHITE);
    display.drawLine(128, 0 , 100, 10, WHITE);
    display.drawLine(128,28, 112, 28, WHITE);
    display.drawLine(128,64, 116,54, WHITE);
    display.drawLine(64,64, 70,57, WHITE);
    display.drawLine(0,64, 14,47 ,WHITE);
    display.drawLine(0,32, 14,25 ,WHITE);
    display.display();
    delay(300);

    display.drawLine(21, 17, 34, 18, WHITE);
    display.drawLine(55, 6, 58, 10, WHITE);
    display.drawLine(100,10, 92,22, WHITE);
    display.drawLine(112, 28, 108,33, WHITE);
    display.drawLine(116,54, 106, 44, WHITE);
    display.drawLine(70,57, 65,50,WHITE);
    display.drawLine(14,47, 31,44, WHITE);
    display.drawLine(14,25, 24,31, WHITE);
    display.display();
    delay(1000);
  }
  else if (rotom_happiness > 1000){
    display.drawLine(0, 0, 21, 17, WHITE);
    display.drawLine(128, 0 , 100, 10, WHITE);
    display.drawLine(128,64, 116,54, WHITE);
    display.drawLine(0,64, 14,47 , WHITE);
    display.display();
    delay(300);

    display.drawLine(21, 17, 34, 18, WHITE);
    display.drawLine(100,10, 92,22, WHITE);
    display.drawLine(116,54, 106, 44, WHITE);
    display.drawLine(14,47, 31,44, WHITE);
    display.display();
    delay(1000);
  }
  else if (rotom_happiness > 500){
    display.drawLine(0, 0, 21, 17, WHITE);
    display.drawLine(128,64, 116,54, WHITE);
    display.display();
    delay(300);

    display.drawLine(21, 17, 34, 18, WHITE);
    display.drawLine(116,54, 106, 44, WHITE);
    display.display();
    delay(1000);
  }

  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite1, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
}

void rotomAnimationNeutral7(){
  if (rotom_happiness < 1500){ return; }

  int StartingX;
  int StartingY;
  for(int i = 0; i < 8; i++){
    display.clearDisplay();
    display.drawBitmap(0, 0, epd_bitmap_RotomNeutral3, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    display.display();
    delay(200);

    StartingX = 87;
    StartingY = 17;
    drawHeart(StartingX, StartingY);
    display.display();
    delay(500);

    display.clearDisplay();
    display.drawBitmap(0, 0, epd_bitmap_RotomSprite2, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    display.display();
    delay(200);

    StartingX = 27;
    StartingY = 36;
    drawHeart(StartingX, StartingY);
    display.display();
    delay(500);
  }
}

void drawHeart(int StartingX, int StartingY){
  display.drawPixel(StartingX, StartingY,WHITE);
  display.drawPixel(StartingX- 1, StartingY - 1,WHITE);
  display.drawPixel(StartingX + 1, StartingY - 1,WHITE);
  display.drawPixel(StartingX - 2, StartingY - 2 ,WHITE);
  display.drawPixel(StartingX + 2, StartingY - 2,WHITE);
  display.drawPixel(StartingX - 3, StartingY - 3, WHITE);
  display.drawPixel(StartingX + 3, StartingY - 3,WHITE);
  display.drawPixel(StartingX, StartingY - 4,WHITE);
  display.drawPixel(StartingX - 4, StartingY - 4,WHITE);
  display.drawPixel(StartingX + 4, StartingY - 4,WHITE);
  display.drawPixel(StartingX - 3, StartingY - 5,WHITE);
  display.drawPixel(StartingX + 3, StartingY - 5,WHITE);
  display.drawPixel(StartingX - 1, StartingY - 5,WHITE);
  display.drawPixel(StartingX + 1, StartingY - 5,WHITE);
  display.drawPixel(StartingX - 2, StartingY - 6 ,WHITE);
  display.drawPixel(StartingX + 2, StartingY - 6 ,WHITE);
}

void rotomAnimationNeutral6(){
  if (rotom_happiness < 1000){ return; }
  display.clearDisplay();
  display.drawBitmap(0, 0, epd_bitmap_RotomSprite2, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
  display.display();
  delay(1000);

  for(int i = 0; i < 8; i++){
    int randStarX = random(32);
    int randStarY = random(64);
    int leftOrRight = random(2);
    display.drawPixel(randStarX + (96*leftOrRight), randStarY, WHITE);
    display.drawPixel(randStarX + (96*leftOrRight) + 1, randStarY, WHITE);
    display.drawPixel(randStarX + (96*leftOrRight) - 1, randStarY, WHITE);
    display.drawPixel(randStarX + (96*leftOrRight), randStarY - 1, WHITE);
    display.drawPixel(randStarX + (96*leftOrRight), randStarY + 1, WHITE);
    display.display();
    delay(500);
  }
}

//Feed Rotom Banana
void rotomAnimationFeedBanana(){
  float ratio = ((float)rotom_happiness / rotom_max_happiness);
  int number = (int)(ratio * 60);
  int width = 4;
  for(int frame = 0; frame < 8; frame++){
    display.clearDisplay();
    if(frame % 2 == 0){
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite3Banana__1_, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    } else {
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite4Banana__1_, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    }
    display.drawRect(123, 60 - number, width, number, WHITE);
    display.display();
    delay(200);
  }
  if(rotom_happiness <= rotom_max_happiness){ rotom_happiness += 100; }
}

//Feed Rotom Leppa
void rotomAnimationFeedLeppa(){
  float ratio = ((float)rotom_happiness / rotom_max_happiness);
  int number = (int)(ratio * 60);
  int width = 4;
  for(int frame = 0; frame < 8; frame++){
    display.clearDisplay();
    if(frame % 2 == 0){
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite3LeppaTest, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    } else {
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite4Leppa__1_, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    }
    display.drawRect(123, 60 - number, width, number, WHITE);
    display.display();
    delay(200);
  }
  if(rotom_happiness <= rotom_max_happiness){ rotom_happiness += 100; }
}

//Feed Rotom Cheri
void rotomAnimationFeedCheri(){
  float ratio = ((float)rotom_happiness / rotom_max_happiness);
  int number = (int)(ratio * 60);
  int width = 4;
  for(int frame = 0; frame < 8; frame++){
    display.clearDisplay();
    if(frame % 2 == 0){
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite3Cheri__1_, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    } else {
      display.drawBitmap(0, 0, epd_bitmap_RotomSprite4Cheri__1_, SCREEN_WIDTH, SCREEN_HEIGHT, WHITE);
    }
    display.drawRect(123, 60 - number, width, number, WHITE);
    display.display();
    delay(200);
  }
  if(rotom_happiness <= rotom_max_happiness){ rotom_happiness += 100; }
}


void loop() {
  if(counter >= 10){
    playAnimation(rotom_current_state, 1);
    counter = 0;
    counter2 += 1;
    Serial.println("coutner2:");
    Serial.println(counter2);

    if(counter2 >= 10){
      if(rotom_happiness > 1){
        rotom_happiness -= 1;
        Serial.println("rotom_happiness: ");
        Serial.println(rotom_happiness);
      }
      counter2 = 0;
    }
  }

  int touchValue = digitalRead(touch);

  if(touchValue == HIGH){
    digitalWrite(ledPin, HIGH);
    if(rotom_current_state == neutral){
      rotom_current_state = feeding;
    }
  }
  else{
    digitalWrite(ledPin,LOW);
    if(rotom_current_state == feeding){
      rotom_current_state = neutral;
    }
  }

  delay(200);
  counter += 1;
  //LowPower.sleep(5000)
}
`;

export default rotomTamagatchiCode;
