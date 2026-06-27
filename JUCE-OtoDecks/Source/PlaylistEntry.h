#pragma once

#include <string>

class PlaylistEntry
{
public:

    PlaylistEntry(std::string _filepath,
        double _lengthInSeconds);

    std::string filepath;
    double lengthInSeconds;
};
