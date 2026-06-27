/*
  ==============================================================================

    DeckGUI.cpp
    Created: 13 Mar 2020 6:44:48pm
    Author:  matthew

  ==============================================================================
*/

#include "../JuceLibraryCode/JuceHeader.h"
#include "DeckGUI.h"

//==============================================================================
DeckGUI::DeckGUI(DJAudioPlayer* _player, 
                AudioFormatManager & 	formatManagerToUse,
                AudioThumbnailCache & 	cacheToUse
           ) : player(_player), 
               waveformDisplay(formatManagerToUse, cacheToUse),
               cuepos(0)
{

    addAndMakeVisible(playButton);
    addAndMakeVisible(pauseButton);
    addAndMakeVisible(stopButton);
    addAndMakeVisible(loadButton);
    addAndMakeVisible(setcueButton);
    addAndMakeVisible(playcueButton);
       
    addAndMakeVisible(volSlider);
    addAndMakeVisible(speedSlider);
    addAndMakeVisible(posSlider);

    addAndMakeVisible(waveformDisplay);


    playButton.addListener(this);
    pauseButton.addListener(this);
    stopButton.addListener(this);
    loadButton.addListener(this);
    setcueButton.addListener(this);
    playcueButton.addListener(this);

    volSlider.addListener(this);
    speedSlider.addListener(this);
    posSlider.addListener(this);


    volSlider.setRange(0.0, 1.0);
    // give volume slider a logarithmic feel
    volSlider.setSkewFactorFromMidPoint(0.25);
    volSlider.setValue(1.0);

    speedSlider.setRange(0.0, 100.0);
    speedSlider.setValue(1.0);

    posSlider.setRange(0.0, 1.0);
    // posSlider.setValue(0.0); // 0.0 is default; also handled in timer

    startTimer(200);
}

DeckGUI::~DeckGUI()
{
    stopTimer();
}

void DeckGUI::paint (Graphics& g)
{
    /* This demo code just fills the component's background and
       draws some placeholder text to get you started.

       You should replace everything in this method with your own
       drawing code..
    */

    g.fillAll (getLookAndFeel().findColour (ResizableWindow::backgroundColourId));   // clear the background

    g.setColour (Colours::grey);
    g.drawRect (getLocalBounds(), 1);   // draw an outline around the component

    g.setColour (Colours::white);
    g.setFont (14.0f);
    /* g.drawText("DeckGUI", getLocalBounds(),
                Justification::centred, true);   // draw some placeholder text */
}

void DeckGUI::resized()
{
    double rowH = getHeight() / 7;
    double controlsW = getWidth() / 5;
    playButton.setBounds(0, 0, controlsW, rowH);
    pauseButton.setBounds(controlsW, 0, controlsW, rowH);
    stopButton.setBounds(controlsW * 2, 0, controlsW, rowH);
    setcueButton.setBounds(controlsW * 3, 0, controlsW, rowH);
    playcueButton.setBounds(controlsW * 4, 0, controlsW, rowH);
    volSlider.setBounds(0, rowH * 1, getWidth(), rowH);
    speedSlider.setBounds(0, rowH * 2, getWidth(), rowH);
    // leave a bit left and right so it's in sync with pos slider
    waveformDisplay.setBounds(10, rowH * 3, getWidth()-20, rowH * 2);
    posSlider.setBounds(0, rowH * 5, getWidth(), rowH);
    loadButton.setBounds(0, rowH * 6, getWidth(), rowH);

}

void DeckGUI::buttonClicked(Button* button)
{
    if (button == &playButton)
    {
        std::cout << "Play button was clicked " << std::endl;
        player->start();
    }
    if (button == &pauseButton)
    {
        std::cout << "Pause button was clicked " << std::endl;
        player->stop();

    }
    if (button == &stopButton)
    {
        std::cout << "Stop button was clicked " << std::endl;
        player->stop();
        player->setPositionRelative(0);    //rewind

    }
    if (button == &loadButton)
    {
        FileChooser chooser{"Select a file..."};
        if (chooser.browseForFileToOpen())
        {
            player->loadURL(URL{chooser.getResult()});
            waveformDisplay.loadURL(URL{chooser.getResult()});
            // clear cue position upon loading new file
            cuepos = 0;
            waveformDisplay.setCuePositionRelative(0);
        }
    }
    if (button == &setcueButton)
    {
        std::cout << "Set Cue button was clicked " << std::endl;
        cuepos = player->getPositionRelative();
        waveformDisplay.setCuePositionRelative(cuepos);
    }
    if (button == &playcueButton)
    {
        std::cout << "Play Cue button was clicked " << std::endl;
        player->setPositionRelative(cuepos);
        player->start();
    }
}

void DeckGUI::sliderValueChanged (Slider *slider)
{
    if (slider == &volSlider)
    {
        player->setGain(slider->getValue());
    }

    if (slider == &speedSlider)
    {
        player->setSpeed(slider->getValue());
    }
    
    if (slider == &posSlider)
    {
        player->setPositionRelative(slider->getValue());
    }
    
}

bool DeckGUI::isInterestedInFileDrag (const StringArray &files)
{
  std::cout << "DeckGUI::isInterestedInFileDrag" << std::endl;

  // only allow drag&drop directly to player if not currently playing
  if (player->isPlaying())
  {
      return false;
  }
  // no more that 1 file is acceptable directly to player
  if (files.size() != 1)
  {
      return false;
  }
  return true;
}

void DeckGUI::filesDropped (const StringArray &files, int x, int y)
{
    std::cout << "DeckGUI::filesDropped" << std::endl;
    if (files.size() == 1)
    {
        player->loadURL(URL{File{files[0]}});

        // update waveform display upon drag & drop as well
        waveformDisplay.loadURL(URL{File{files[0]}});
        // clear cue position upon loading new file
        cuepos = 0;
        waveformDisplay.setCuePositionRelative(0);
    }
}

void DeckGUI::timerCallback()
{
    //std::cout << "DeckGUI::timerCallback" << std::endl;
    double currentPos = player->getPositionRelative();

    // update position slider and prevent ValueChanged message
    // (otherwise playback stutters because of a feedback loop
    // between player's and slider's position set and get)
    posSlider.setValue(currentPos, dontSendNotification);

    waveformDisplay.setPositionRelative(currentPos);
}

void DeckGUI::loadFileFromPath(std::string filepath,
                               bool forceWhilePlaying)
{
    // if player is playing and forcing is not selected,
    // do nothing
    if ((player->isPlaying() == true) &&
        (forceWhilePlaying == false))
    {
        return;
    }

    // load file into player
    player->loadURL(URL{File{filepath}});

    // load file into waveform display
    waveformDisplay.loadURL(URL{File{filepath}});

    // reset cue position in both components
    cuepos = 0;
    waveformDisplay.setCuePositionRelative(0);
}