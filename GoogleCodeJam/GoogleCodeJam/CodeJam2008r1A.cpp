#include "CodeJam2008r1A.h"

CodeJam2008r1A::CodeJam2008r1A(void)
{
}

CodeJam2008r1A::~CodeJam2008r1A(void)
{
}



void CodeJam2008r1A::Milkshakes(const char* file)
{
	std::ofstream out;
	std::fstream in(file);

	std::string filename = file;
    if(filename.find_last_of(".") != std::string::npos)
		filename = filename.substr(0,filename.find_last_of(".")+1)+"txt";

	int c;
	out.open(filename.c_str());
	in >> c;

	for (int i=0; i<c; i++)
	{
		std::vector<int> *malt, *unmalt, checklist;
		int *solution, *members;
		int n, m;

		in >> n;
		in >> m;

		solution = new int[n];
		members = new int[m];

		malt = new std::vector<int>[n];
		unmalt = new std::vector<int>[n];
		checklist = new std::vector<int>(m);

		for (int j=0; j<n; j++)
		{
			malt[j] = std::vector<int>(m);
			unmalt[j] = std::vector<int>(m);
		}

		for (int j=0; j<m; j++)
		{
			int t;
			in >> t;

			checklist.push_back(j);

			for (int k=0; k<t; k++)
			{
				int flavor, malt;
				in >> flavor; 
				in >> malt;

				if (malt == 0) unmalt[flavor-1].push_back(j);
				else malt[flavor-1].push_back(j);		
			}
		}

		for (int j=0; j<n; j++)
		{
  			for ( std::vector<int>::iterator it = unmalt.begin() ; it < unmalt.end(); it++ )
			{
				remove(checklist.begin(), checklist.end(), j);
				members[*it] = 1;
			}
    	
			int *no_flavor;
			no_flavor = find(&members[0], &members[m], 0);

			for (int k=0; k<m; k++)
			{
				p = find(&flavor[k][0], &flavor[k][flavor[k].length()], j);
				if (p != &flavor[k][flavor[k].length()]) solution[j] 
			}
		}
		
		out << "Case #" << i+1 << ": " << "Impossible" << "\n";

	}

	out.close();
	std::cout << "Output:" << filename << std::endl;

}

void CodeJam2008r1A::Scalar(const char* file)
{
	std::ofstream out;
	std::fstream in(file);

	std::string filename = file;
    if(filename.find_last_of(".") != std::string::npos)
		filename = filename.substr(0,filename.find_last_of(".")+1)+"txt";

	int c;
	out.open(filename.c_str());
	in >> c;

	for (int i=0; i<c; i++)
    {
		int size, m=0;

		in >> size;

		int *v1 = new int[size];
		int *v2 = new int[size];

		for (int j=0; j<size; j++)
			in >> v1[j];

		for (int j=0; i<size; j++)
			in >> v2[j];

		std::sort(&v1[0],&v1[size]);
		std::sort(&v2[0],&v2[size]);

		for (int j=0; j<size; j++)
		{
			m += v1[j]*v2[size-j-1];
			
		}
		
		out << "Case #" << i+1 << ": " << m << "\n";
	}

	out.close();
	std::cout << "Output:" << filename << std::endl;
}