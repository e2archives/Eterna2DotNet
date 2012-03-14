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
		std::vector<int> *malt, *unmalt;
		std::stack<int> maltchecklist;
		std::vector<int> **member_likes;
		int *solution, *members;
		int n, m;
		bool allunmalt = true, has_solution = false;

		in >> n;	// # flavors
		in >> m;	// # members

		solution = new int[n];
		members = new int[m];
		memset(solution,0,sizeof(bool));
		memset(members,0,sizeof(int));

		*member_likes = new std::vector<int>[m];
	
		malt = new std::vector<int>[n];
		unmalt = new std::vector<int>[n];
		maltchecklist = std::stack<int>();

		for (int j=0; j<n; j++)
		{
			malt[j] = std::vector<int>(m);
			unmalt[j] = std::vector<int>(m);
		}

		// member loop
		for (int j=0; j<m; j++)
		{
			member_likes[j] = new std::vector<int>[2];
			member_likes[j][0] = std::vector<int>(n);
			member_likes[j][1] = std::vector<int>(n);

			int t, num_unmalt = 0;
			in >> t;

			for (int k=0; k<t; k++)
			{
				int flavor, maltornot;
				in >> flavor; 
				in >> maltornot;
				
				member_likes[j][maltornot].push_back(flavor-1);

				if (malt == 0) 
				{
					unmalt[flavor-1].push_back(j);
					num_unmalt++;
				}
				else malt[flavor-1].push_back(j);		

			}
			if (allunmalt && num_unmalt == 0) 
			{
				allunmalt = false;
				maltchecklist.push(j);
			}
		}

		if (!allunmalt)
		{
			while (!maltchecklist.empty())
			{
				int p_member = maltchecklist.pop();

				for ( std::vector<int>::iterator it = member_likes[p_member][1].begin(); it < member_likes[p_member][1].end(); it++ )
				{
					solution[*it] = 1;
					for ( std::vector<int>::iterator it2 = unmalt[*it].begin(); it2 < unmalt[*it].end(); it2++ )
					{
						maltchecklist.push(*it2);
					}
				}
			}

			for (int j=0; j<n; j++)
			{
  				for ( std::vector<int>::iterator it = unmalt.begin(); it < unmalt.end(); it++ )
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
		}

		if (allunmalt || has_solution) 
		{
			out << "Case #" << i+1 << ": ";
			for (int a=0; a<n; a++)
			{
				out << solution[a] << " ";
			}
			out << endl;
		}
		else
			out << "Case #" << i+1 << ": " << "Impossible" << endl;


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