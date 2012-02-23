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

	std::string filename = file;
    if(filename.find_last_of(".") != std::string::npos)
		filename = filename.substr(0,filename.find_last_of(".")+1)+"txt";

	int n;
	out_file.open(filename.c_str());
	in_file >> n;

	int count = 0;

	for (int c=0; c<n; c++)
    {
		int size, m=0;

		in_file >> size;

		int *v1 = new int[size];
		int *v2 = new int[size];

		for (int i=0; i<size; i++)
			in_file >> v1[i];

		for (int i=0; i<size; i++)
			in_file >> v2[i];

		std::sort(&v1[0],&v1[size]);
		std::sort(&v2[0],&v2[size]);

		for (int i=0; i<size; i++)
		{
			m += v1[i]*v2[size-i-1];
			
		}
		
		count++;
		out_file << "Case #" << count << ": " << m << "\n";
	}

	out_file.close();
	std::cout << "Output:" << filename << std::endl;
}