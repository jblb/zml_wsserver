#ifndef LEDS_LAYOUT_H_
#define LEDS_LAYOUT_H_

// Be carefull num_pixel is uint8_t , so between 0 and 255.
// But we wiil use int8_t for the leds layout, so a max of 127

#define NUM_PIXELS 10
#define NB_LED_GROUPS 2
#define NB_LED_MAX_PER_GROUP 5

const int8_t LEDS_LAYOUT[NB_LED_GROUPS][NB_LED_MAX_PER_GROUP] = {
    { 4, 3, 2, 1, 0},
    { 5, 6, 7, 8, 9}
};

#endif  // LEDS_LAYOUT_H_
