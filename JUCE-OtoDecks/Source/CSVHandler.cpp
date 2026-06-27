#include "CSVHandler.h"
#include <iostream>
#include <fstream>


CSVHandler::CSVHandler()
{

}

std::vector<PlaylistEntry> CSVHandler::readCSV(std::string csvFilename)
{
    std::vector<PlaylistEntry> entries;

    std::ifstream csvFile{csvFilename};
    std::string line;
    std::cout << "Reading playlist CSV..." << std::endl;
    if (csvFile.is_open())
    {
        while (std::getline(csvFile, line))
        {
            try {
                PlaylistEntry ple = stringsToPLE(tokenise(line, '?'));
                entries.push_back(ple);
            }
            catch (const std::exception& e)
            {
                std::cout << "CSVHandler::readCSV bad data" << std::endl;
            }
        }// end of while
        csvFile.close();
    }

    std::cout << "CSVHandler::readCSV read " << entries.size() << " entries" << std::endl;
    return entries;
}

std::vector<std::string> CSVHandler::tokenise(std::string csvLine, char separator)
{
    std::vector<std::string> tokens;
    signed int start, end;
    std::string token;
    start = csvLine.find_first_not_of(separator, 0);
    do {
        end = csvLine.find_first_of(separator, start);
        if (start == csvLine.length() || start == end) break;
        if (end >= 0) token = csvLine.substr(start, end - start);
        else token = csvLine.substr(start, csvLine.length() - start);
        tokens.push_back(token);
        start = end + 1;
    } while (end > 0);

    return tokens;
}

PlaylistEntry CSVHandler::stringsToPLE(std::vector<std::string> tokens)
{
    double lengthInSeconds;

    if (tokens.size() != 2) // bad
    {
        std::cout << "Bad line " << std::endl;
        throw std::exception{};
    }
    // we have 2 tokens
    try {
        lengthInSeconds = std::stod(tokens[1]);
    }
    catch (const std::exception& e) {
        std::cout << "CSVHandler::stringsToPLE Bad float! " << tokens[1] << std::endl;
        throw;
    }

    PlaylistEntry ple{ tokens[0],
                        lengthInSeconds};

    return ple;
}


PlaylistEntry CSVHandler::stringsToPLE(std::string filepath,
    std::string lengthString)
{
    double lengthInSeconds;
    try {
        lengthInSeconds = std::stod(lengthString);
    }
    catch (const std::exception& e) {
        std::cout << "CSVHandler::stringsToPLE Bad float! " << lengthString << std::endl;
        throw;
    }
    PlaylistEntry ple{ filepath,
                    lengthInSeconds };

    return ple;
}


void CSVHandler::writeCSV(std::string csvFilename, std::vector<PlaylistEntry> list)
{
    std::ofstream csvFile{csvFilename};
    if (csvFile.is_open())
    {
        for (int i = 0; i < list.size(); i++)
        {
            csvFile << list[i].filepath;
            csvFile << "?"; // ? can never be part of a file path, using as separator
            csvFile << list[i].lengthInSeconds;
            csvFile << std::endl;
        }
        csvFile.close();
    }
    else
    {
        std::cout << "Failed to open playlist file for writing" << std::endl;
        std::cout << "Please run executable from a path with write permission" << std::endl;
    }
}
