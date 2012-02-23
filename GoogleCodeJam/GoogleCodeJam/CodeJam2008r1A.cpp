#include "CodeJam2008r1A.h"

CodeJam2008r1A::CodeJam2008r1A(void)
{
}

CodeJam2008r1A::~CodeJam2008r1A(void)
{
}

void CodeJam2008r1A::A(const char* file)
{
	std::ofstream out_file;
	std::fstream in_file(file);
	std::string res = "";

	int n;
	out_file.open("solution.txt");
	in_file >> n;

	int count = 0;

	for (int c=0; c<n; c++)
    {
		int size, m=0;
		int *v1, *v2;

		in_file >> size;

		v1 = new int[size];
		v2 = new int[size];

		for (int i=0; i<size; i++)
			in_file >> v1[i];

		for (int i=0; i<size; i++)
			in_file >> v2[i];

		for (int i=0; i<size; i++)
			m += v1[i]*v2[i];

		count++;
		out_file << "Case #" << count << ": " << m << "\n";
	}

	out_file.close();
}