#pragma once

#include "PlaylistEntry.h"
#include <vector>
#include <string>


class CSVHandler
{
    public:
        CSVHandler();

        static std::vector<PlaylistEntry> readCSV(std::string csvFile);
        static std::vector<std::string> tokenise(std::string csvLine, char separator);

        static PlaylistEntry stringsToPLE(std::string filepath,
            std::string length);

        static void writeCSV(std::string csvFilename, std::vector<PlaylistEntry> list);

    private:
        static PlaylistEntry stringsToPLE(std::vector<std::string> strings);

};