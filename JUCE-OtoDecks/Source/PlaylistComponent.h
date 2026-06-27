#pragma once

#include <JuceHeader.h>
#include "PlaylistEntry.h"
#include "CSVHandler.h"
#include "DeckGUI.h"
#include <vector>
#include <string>

//==============================================================================
/*
*/
class PlaylistComponent  : public juce::Component,
                           public TableListBoxModel,
                           public Button::Listener,
                           public FileDragAndDropTarget
{
public:
    /** constructor */
    PlaylistComponent(AudioFormatManager& _formatManager,
                      DeckGUI* _deck1,
                      DeckGUI* _deck2,
                      std::string _playlistFile);

    /** destructor */
    ~PlaylistComponent() override;

    /** paint the Component */
    void paint (juce::Graphics&) override;

    /** implement Component resized */
    void resized() override;

    /** implement TableListBoxModel number of rows query */
    int getNumRows() override;

    /** implement TableListBoxModel painting of row background */
    void paintRowBackground(Graphics& g,
                    int rowNumber,
                    int width,
                    int height,
                    bool rowIsSelected) override;

    /** implement TableListBoxModel painting of a cell */
    void paintCell(Graphics& g,
                    int rowNumber,
                    int columnId,
                    int width,
                    int height,
                    bool rowIsSelected) override;

    /** implement TableListBoxModel click on a cell handling */
    void cellClicked(int rowNumber,
                     int columnId,
                     const MouseEvent&) override;

    /** implement TableListBoxModel double click on a cell handling */
    void cellDoubleClicked(int rowNumber,
                           int columnId,
                           const MouseEvent&) override;

    /** implement Button::Listener */
    void buttonClicked(Button* button) override;

    /** implement FileDragAndDropTarget */
    bool isInterestedInFileDrag(const StringArray& files) override;
    void filesDropped(const StringArray& files, int x, int y) override;


private:
    // the table
    TableListBox tableComponent;

    // the internal representation
    std::vector<PlaylistEntry> trackList;

    // to extract duration from added files
    AudioFormatManager& formatManager;

    // to load a file from the list into one of the decks
    DeckGUI* deck1;
    DeckGUI* deck2;

    // stored for saving playlist in deconstructor
    std::string playlistFile;

    // private method to read duration of an audio file without player
    double getDuration(URL audioURL);

    // added by Projucer
    JUCE_DECLARE_NON_COPYABLE_WITH_LEAK_DETECTOR (PlaylistComponent)
};
