#include <JuceHeader.h>
#include "PlaylistComponent.h"

//==============================================================================
PlaylistComponent::PlaylistComponent(AudioFormatManager& _formatManager,
                                     DeckGUI* _deck1,
                                     DeckGUI* _deck2,
                                     std::string _playlistFile
                                    ) : formatManager(_formatManager),
                                        deck1(_deck1),
                                        deck2(_deck2),
                                        playlistFile(_playlistFile)

{
    // In your constructor, you should add any child components, and
    // initialise any special settings that your component needs.

    trackList = CSVHandler::readCSV(playlistFile);

    // column IDs start at 1, documentation + JUCE assertion say it can't be 0
    tableComponent.getHeader().addColumn("<", 1, 20);
    tableComponent.getHeader().addColumn(">", 2, 20);
    tableComponent.getHeader().addColumn("File name", 3, 700);
    tableComponent.getHeader().addColumn("Duration", 4, 50);
    tableComponent.setModel(this);

    addAndMakeVisible(tableComponent);
}

PlaylistComponent::~PlaylistComponent()
{
    CSVHandler::writeCSV(playlistFile, trackList);
}

void PlaylistComponent::paint (juce::Graphics& g)
{
    /* This demo code just fills the component's background and
       draws some placeholder text to get you started.

       You should replace everything in this method with your own
       drawing code..
    */

    g.fillAll (getLookAndFeel().findColour (juce::ResizableWindow::backgroundColourId));   // clear the background

    g.setColour (juce::Colours::grey);
    g.drawRect (getLocalBounds(), 1);   // draw an outline around the component

    g.setColour (juce::Colours::white);
    g.setFont (14.0f);
    g.drawText ("PlaylistComponent", getLocalBounds(),
                juce::Justification::centred, true);   // draw some placeholder text
}

void PlaylistComponent::resized()
{
    // This method is where you should set the bounds of any child
    // components that your component contains..
    tableComponent.setBounds(0, 0, getWidth(), getHeight());
}

int PlaylistComponent::getNumRows()
{
    return trackList.size();
}

void PlaylistComponent::paintRowBackground(Graphics& g,
                    int rowNumber,
                    int width,
                    int height,
                    bool rowIsSelected)
{
    // warning from the Juce documentation:
    // Note that the rowNumber value may be greater
    // than the number of rows in your list, so be careful
    // that you don't assume it's less than getNumRows()
    if (rowNumber >= trackList.size())
        return;

    if (rowIsSelected)
    {
        g.fillAll(Colours::orange);
    }
    else
    {
        g.fillAll(Colours::darkgrey);
    }
}

void PlaylistComponent::paintCell(Graphics& g,
                    int rowNumber,
                    int columnId,
                    int width,
                    int height,
                    bool rowIsSelected)
{
    // warning from the Juce documentation:
    // Note that the rowNumber value may be greater
    // than the number of rows in your list, so be careful
    // that you don't assume it's less than getNumRows()
    // checking to prevent out-of-bounds array access
    if (rowNumber >= trackList.size())
        return;

    if (rowIsSelected)
    {
        g.setColour(Colours::black);
    }
    else
    {
        g.setColour(Colours::lightgrey);
    }

    if (columnId == 1)
    {
        g.drawText("<", 2, 0,
            width - 4, height,
            juce::Justification::centred, true);
    }
    else if (columnId == 2)
    {
        g.drawText(">", 2, 0,
            width - 4, height,
            juce::Justification::centred, true);
    }
    else if (columnId == 3)
    {
        g.drawText(trackList[rowNumber].filepath,
            2, 0,
            width - 4, height,
            Justification::centredLeft,
            true);
    }
    else if (columnId == 4)
    {
        // credit:
        // https://stackoverflow.com/questions/9695329/c-how-to-round-a-double-to-an-int
        // https://stackoverflow.com/questions/5590381/easiest-way-to-convert-int-to-string-in-c
        int s = std::round(trackList[rowNumber].lengthInSeconds);
        int m = s / 60; // round down
        s -= (60 * m);  // remainder   
        std::stringstream durationStr;
        if (s < 10)
        {
            durationStr << m << ":0" << s;
        }
        else
        {
            durationStr << m << ":" << s;
        }

        std::string durationString = durationStr.str();
        g.drawText(durationString,
            2, 0,
            width - 4, height,
            Justification::centredRight,
            true);
    }
}

void PlaylistComponent::cellClicked(int rowNumber,
                                    int columnId,
                                    const MouseEvent&)
{
    if (rowNumber >= trackList.size())
        return;

    // upon single click, attempt load, but don't force if already playing
    if (columnId == 1)
    {
        deck1->loadFileFromPath(trackList[rowNumber].filepath, false);
    }
    else if (columnId == 2)
    {
        deck2->loadFileFromPath(trackList[rowNumber].filepath, false);
    }
}

void PlaylistComponent::cellDoubleClicked(int rowNumber,
                                          int columnId,
                                          const MouseEvent&)
{
    if (rowNumber >= trackList.size())
        return;

    // upon double click, force loading even if currently playing
    if (columnId == 1)
    {
        deck1->loadFileFromPath(trackList[rowNumber].filepath, true);
    }
    else if (columnId == 2)
    {
        deck2->loadFileFromPath(trackList[rowNumber].filepath, true);
    }
}

void PlaylistComponent::buttonClicked(Button* button)
{
    std::cout << "buttonClicked" << std::endl;
}

bool PlaylistComponent::isInterestedInFileDrag(const StringArray& files)
{
    std::cout << "PlaylistComponent::isInterestedInFileDrag" << std::endl;
    return true;
}

void PlaylistComponent::filesDropped(const StringArray& files, int x, int y)
{
    std::cout << "PlaylistComponent::filesDropped" << std::endl;

    for (int i = 0; i < files.size(); ++i)
    {
        PlaylistEntry ple{ files[i].toStdString(),
                            getDuration(URL{File{files[i]}}) };
        // only add files that have a duration, i.e. valid audio files
        if (ple.lengthInSeconds > 0)
        {
            trackList.push_back(ple);
        }
    }
    // notify tableComponent that the number of rows has changed
    tableComponent.updateContent();
    //repaint(); // not required
}

double PlaylistComponent::getDuration(URL audioURL)
{
    double length = 0;
    auto* reader = formatManager.createReaderFor(audioURL.createInputStream(false));
    if (reader != nullptr) // good file!
    {
        if (reader->sampleRate != 0)    // valid audio file and no division by zero
        {
            length = (reader->lengthInSamples / reader->sampleRate);
        }
    }
    return length;
}
