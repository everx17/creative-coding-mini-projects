#pragma once

#include <JuceHeader.h>

//==============================================================================
/*
*/
class PlayCueButton  : public juce::TextButton
{
public:
    PlayCueButton();
    ~PlayCueButton() override;

    void paint (juce::Graphics&) override;
    void resized() override;

private:
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (PlayCueButton)
};
