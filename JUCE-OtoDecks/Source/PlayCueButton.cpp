#include <JuceHeader.h>
#include "PlayCueButton.h"

//==============================================================================
PlayCueButton::PlayCueButton()
{
    // In your constructor, you should add any child components, and
    // initialise any special settings that your component needs.

}

PlayCueButton::~PlayCueButton()
{
}

void PlayCueButton::paint (juce::Graphics& g)
{
    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));   // clear the background

    g.setColour (juce::Colours::grey);
    g.drawRect (getLocalBounds(), 1);   // draw an outline around the component

    g.setColour(juce::Colours::green);  // draw a green play symbol
    Path playSymbol;
    int xCenter = getWidth() / 2;
    int yCenter = getHeight() / 2;
    playSymbol.addTriangle(xCenter-15, yCenter-20, xCenter+25, yCenter, xCenter-15, yCenter+20);
    g.fillPath(playSymbol);

    g.setColour (juce::Colours::white); // add text on top of play symbol
    g.setFont (14.0f);
    g.drawText ("CUE", getLocalBounds(),
                juce::Justification::centred, true);
}

void PlayCueButton::resized()
{
    // This method is where you should set the bounds of any child
    // components that your component contains..

}
