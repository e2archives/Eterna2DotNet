#include <windows.h>
#include <string>
#include <iostream>
#include "CodeJam2008r1A.h"

#ifdef UNICODE
#define tcout wcout
#else
#define tcout cout
#endif

using namespace std;

int main()
{
	TCHAR buffer[MAX_PATH];//always use MAX_PATH for filepaths
	GetCurrentDirectory(sizeof(buffer),buffer);

	tcout << "Filepath:" << buffer << endl;

	string file;	
	cin >> file;

	
	CodeJam2008r1A::Milkshakes(file.c_str());

	
	cin.get();
	std::cout << "Press Return to Quit" <<std::endl;
	cin.get();
	return 0;
}