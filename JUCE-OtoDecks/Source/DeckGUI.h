/*
  ==============================================================================

    DeckGUI.h
    Created: 13 Mar 2020 6:44:48pm
    Author:  matthew

  ==============================================================================
*/

#pragma once

#include "../JuceLibraryCode/JuceHeader.h"
#include "DJAudioPlayer.h"
#include "WaveformDisplay.h"
#include "PlayCueButton.h"

//==============================================================================
/*
*/
class DeckGUI    : public Component,
                   public Button::Listener, 
                   public Slider::Listener, 
                   public FileDragAndDropTarget, 
                   public Timer
{
public:
    /** constructor */
    DeckGUI(DJAudioPlayer* player, 
           AudioFormatManager & 	formatManagerToUse,
           AudioThumbnailCache & 	cacheToUse );

    /** destructor */
    ~DeckGUI();

    /** paint the Component */
    void paint (Graphics&) override;

    /** implement Component resized */
    void resized() override;

    /** implement Button::Listener */
    void buttonClicked (Button *) override;

    /** implement Slider::Listener */
    void sliderValueChanged (Slider *slider) override;

    /** implement FileDragAndDropTarget */
    bool isInterestedInFileDrag (const StringArray &files) override;
    void filesDropped (const StringArray &files, int x, int y) override; 

    /** implement Timer */
    void timerCallback() override;

    /** load a file into DeckGUI from given path (used by playlist) */
    void loadFileFromPath(std::string filepath,
                          bool forceWhilePlaying);

private:

    TextButton playButton{"PLAY"};
    TextButton pauseButton{"PAUSE"};
    TextButton stopButton{"STOP"};
    TextButton loadButton{"LOAD"};
    TextButton setcueButton{"SET CUE"};
    PlayCueButton playcueButton;
  
    Slider volSlider; 
    Slider speedSlider;
    Slider posSlider{Slider::LinearHorizontal, Slider::NoTextBox};

    WaveformDisplay waveformDisplay;

    DJAudioPlayer* player;

    double cuepos;

    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (DeckGUI)
};
