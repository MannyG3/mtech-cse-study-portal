// Comprehensive Study Notes, Key Concepts, Formulas, and Question Banks
// for M.Tech Computer Engineering (2026 Pattern)

export const SUBJECT_NOTES = {
  "2604PCC501": {
    courseCode: "2604PCC501",
    courseTitle: "Advanced Algorithms",
    overview: "Advanced analysis of computational algorithms, amortization, dynamic programming, network flows, computational geometry, approximation algorithms, and string matching.",
    units: [
      {
        unitNo: "Unit I",
        title: "Algorithms Analysis Methods",
        keyConcepts: [
          {
            heading: "Divide and Conquer: Maximum Subarray Problem",
            content: `The **Maximum Subarray Problem** finds a contiguous subarray within a one-dimensional array of numbers that has the largest sum.
- **Divide and Conquer Approach**:
  1. Divide the array into two halves: Left $[low..mid]$ and Right $[mid+1..high]$.
  2. The maximum subarray must either:
     - Lie entirely in the left subarray $[low..mid]$
     - Lie entirely in the right subarray $[mid+1..high]$
     - Cross the midpoint $mid$
  3. Combine: Find the crossing maximum subarray in linear $O(n)$ time by scanning outwards from $mid$.
  4. Recurrence: $T(n) = 2T(n/2) + \Theta(n) \implies T(n) = \Theta(n \\log n)$.
- **Kadane's Algorithm Comparison**: Dynamic programming approach operates in $O(n)$ linear time with $O(1)$ space.`,
            formula: "T(n) = 2T(n/2) + \\Theta(n) = \\Theta(n \\log n)"
          },
          {
            heading: "Strassen's Matrix Multiplication",
            content: `Standard matrix multiplication of two $n \\times n$ matrices takes $O(n^3)$ operations (8 sub-matrix multiplications).
- Strassen showed that only **7 sub-matrix multiplications** are necessary instead of 8, by computing clever linear combinations ($P_1$ to $P_7$).
- Recurrence: $T(n) = 7T(n/2) + \Theta(n^2)$.
- By Master Theorem: $a = 7, b = 2, \\log_2 7 \\approx 2.807$.
- Thus, Time Complexity is $\\Theta(n^{\\log_2 7}) \\approx O(n^{2.81})$.
- Trade-offs: Higher constant factors and numerical instability due to precision issues for small matrices ($n < 64$).`,
            formula: "T(n) = 7T(n/2) + O(n^2) \\implies O(n^{2.807})"
          },
          {
            heading: "Matrix Chain Multiplication (MCM)",
            content: `Determines the optimal parenthesization of a chain of matrices $A_1 A_2 \\dots A_n$ such that the total number of scalar multiplications is minimized.
- Matrix dimensions: $A_i$ has dimension $p_{i-1} \\times p_i$.
- Recurrence relation:
  $$m[i, j] = \\begin{cases} 0 & \\text{if } i = j \\\\ \\min_{i \\le k < j} \\{ m[i, k] + m[k+1, j] + p_{i-1}p_k p_j \\} & \\text{if } i < j \\end{cases}$$
- Time Complexity: $O(n^3)$, Space Complexity: $O(n^2)$ using bottom-up DP table.`,
            formula: "m[i,j] = \\min_{i \\le k < j} (m[i,k] + m[k+1,j] + p_{i-1}p_k p_j)"
          },
          {
            heading: "0/1 Knapsack Problem vs Fractional Knapsack",
            content: `Given $n$ items with values $v_i$ and weights $w_i$, and knapsack capacity $W$:
- **0/1 Knapsack (DP)**: Items cannot be divided. Either take item or leave it.
  $$K(i, w) = \\begin{cases} 0 & \\text{if } i=0 \\text{ or } w=0 \\\\ K(i-1, w) & \\text{if } w_i > w \\\\ \\max(K(i-1, w), v_i + K(i-1, w - w_i)) & \\text{if } w_i \\le w \\end{cases}$$
  Time Complexity: $O(n W)$ (pseudo-polynomial), Space: $O(n W)$ or $O(W)$ with 1D array.
- **Fractional Knapsack (Greedy)**: Items can be divided. Sort items by value-to-weight ratio $v_i/w_i$ descending and greedily pick. Time Complexity: $O(n \\log n)$.`,
            formula: "K[i, w] = \\max(K[i-1, w], v_i + K[i-1, w - w_i])"
          },
          {
            heading: "Activity Selection & Huffman Coding",
            content: `**Activity Selection**:
- Choose the maximum number of mutually compatible activities given start times $s_i$ and finish times $f_i$.
- Greedy strategy: Always pick the activity with the earliest finish time $f_i$ that is compatible with previously selected activities.
- Time Complexity: $O(n \\log n)$ for sorting by finish times, then $O(n)$ scanning.

**Huffman Codes**:
- Lossless data compression algorithm creating variable-length prefix-free codes based on character frequencies.
- Uses a Min-Priority Queue to build a binary tree from bottom up.
- Time Complexity: $O(n \\log n)$ where $n$ is alphabet size.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "State the optimal substructure and overlapping subproblems properties in Dynamic Programming." },
          { marks: 2, q: "Why is Strassen's matrix multiplication faster than standard matrix multiplication?" },
          { marks: 5, q: "Explain the Divide and Conquer approach for finding the Maximum Subarray. State its recurrence and solve it." },
          { marks: 5, q: "Differentiate between Greedy approach and Dynamic Programming with suitable examples." },
          { marks: 10, q: "Find the optimal parenthesization for a matrix chain with dimensions: P = [30, 35, 15, 5, 10, 20, 25]. Show all tables and optimal parenthesization." }
        ]
      },
      {
        unitNo: "Unit II",
        title: "Graph Algorithms",
        keyConcepts: [
          {
            heading: "All-Pairs Shortest Paths (APSP)",
            content: `Finding shortest paths between every pair of vertices in a directed graph $G = (V, E)$ with edge weights.
1. **Floyd-Warshall Algorithm**:
   - Uses Dynamic Programming. Let $d_{ij}^{(k)}$ be the weight of shortest path from $i$ to $j$ using intermediate vertices from $\{1, 2, \\dots, k\}$.
   - Recurrence: $d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)}, d_{ik}^{(k-1)} + d_{kj}^{(k-1)})$.
   - Handles negative weights; detects negative weight cycles if $d_{ii} < 0$.
   - Complexity: Time $O(V^3)$, Space $O(V^2)$.
2. **Johnson's Algorithm for Sparse Graphs**:
   - Computes APSP on sparse graphs in $O(V^2 \\log V + VE)$ time.
   - Reweights edges using Bellman-Ford to produce non-negative weights: $\\hat{w}(u, v) = w(u, v) + h(u) - h(v) \\ge 0$.
   - Then runs Dijkstra's algorithm from each vertex.`,
            formula: "d_{ij}^{(k)} = \\min(d_{ij}^{(k-1)}, d_{ik}^{(k-1)} + d_{kj}^{(k-1)})"
          },
          {
            heading: "Maximum Flow & Ford-Fulkerson Method",
            content: `A flow network is a directed graph where each edge has a capacity $c(u, v) > 0$.
- Flow constraints:
  1. **Capacity constraint**: $0 \\le f(u, v) \\le c(u, v)$ for all $u, v \\in V$.
  2. **Flow conservation**: For every vertex $u \\notin \\{s, t\\}$, $\\sum_{v} f(v, u) = \\sum_{v} f(u, v)$.
- **Residual Network**: $G_f$ contains edges with residual capacity $c_f(u, v) = c(u, v) - f(u, v)$.
- **Augmenting Path**: A simple path from source $s$ to sink $t$ in residual network $G_f$.
- **Max-Flow Min-Cut Theorem**: The maximum value of an $(s, t)$-flow is equal to the minimum capacity of an $(s, t)$-cut.
- **Edmonds-Karp Algorithm**: Implements Ford-Fulkerson using BFS to find shortest augmenting paths in $O(V E^2)$ time.`
          },
          {
            heading: "Maximum Bipartite Matching",
            content: `Given an undirected bipartite graph $G = (L \\cup R, E)$, find a matching of maximum size.
- Reduction to Max-Flow:
  1. Add source vertex $s$ with directed edges of capacity 1 to all vertices in $L$.
  2. Direct all original edges from $L$ to $R$ with capacity 1.
  3. Add sink vertex $t$ with directed edges of capacity 1 from all vertices in $R$.
  4. Run Ford-Fulkerson / Edmonds-Karp. The maximum flow value equals maximum bipartite matching size in $O(V E)$ time.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define residual network and augmenting path in flow networks." },
          { marks: 5, q: "State and prove the Max-Flow Min-Cut Theorem." },
          { marks: 5, q: "Explain Johnson's algorithm for All-Pairs Shortest Paths and why reweighting is necessary." },
          { marks: 10, q: "Execute the Floyd-Warshall algorithm on a given 4-node directed graph with negative edge weights and write its recurrence relation." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "Advanced Data Structures & Amortized Analysis",
        keyConcepts: [
          {
            heading: "Red-Black Trees",
            content: `A self-balancing Binary Search Tree where each node has a color (RED or BLACK).
- **Properties**:
  1. Every node is either RED or BLACK.
  2. The root is BLACK.
  3. Every leaf (NIL) is BLACK.
  4. If a node is RED, both its children are BLACK (No two consecutive REDs).
  5. For each node, all simple paths to descendant leaves contain the same number of black nodes (**Black-height** $bh(x)$).
- **Height Bound**: A red-black tree with $n$ internal nodes has height at most $2 \\log_2(n + 1)$.
- Search, Minimum, Maximum, Successor, Predecessor: $O(\\log n)$.
- Insert and Delete: $O(\\log n)$ time using at most 2 rotations for insert, 3 rotations for delete.`,
            formula: "Height \\le 2 \\log_2(n + 1) \\implies O(\\log n)"
          },
          {
            heading: "Binomial & Fibonacci Heaps",
            content: `**Binomial Heaps**:
- Collection of Binomial Trees $B_k$ satisfying min-heap property. Tree $B_k$ has $2^k$ nodes, height $k$, and degree $k$ at root.
- Union operation takes $O(\\log n)$ time.

**Fibonacci Heaps**:
- Collection of min-heap-ordered trees; relaxing binomial constraints to allow lazy operations.
- **Amortized Time Complexities**:
  - Insert: $O(1)$ amortized
  - Find-Min: $O(1)$ actual
  - Union: $O(1)$ amortized
  - Decrease-Key: $O(1)$ amortized
  - Extract-Min: $O(\\log n)$ amortized
- Makes Dijkstra's algorithm run in $O(E + V \\log V)$ time.`
          },
          {
            heading: "Amortized Analysis Methods",
            content: `Guarantees the average performance of each operation in the worst-case sequence of operations.
1. **Aggregate Method**: Total cost of $n$ operations $T(n)$ is determined; amortized cost per operation is $T(n)/n$.
2. **Accounting Method**: Assign different charges (amortized costs $\\hat{c}_i$) to operations. Extra charges are stored as 'credit' in data objects to pay for expensive future operations. Requirement: $\\sum \\hat{c}_i \\ge \\sum c_i$.
3. **Potential Method**: Represents prepaid work as potential energy $\\Phi(D_i)$ of the data structure.
   - Amortized cost: $\\hat{c}_i = c_i + \\Phi(D_i) - \\Phi(D_{i-1})$.
   - Valid potential function requires $\\Phi(D_n) \\ge \\Phi(D_0)$ for all $n$.
4. **Dynamic Table Expansion**: Doubling table size when full has amortized cost $O(1)$ per insert.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define Black-Height of a Red-Black Tree." },
          { marks: 2, q: "What is the amortized cost of Decrease-Key in a Fibonacci Heap vs Binary Heap?" },
          { marks: 5, q: "Explain the three methods of Amortized Analysis with the example of dynamic table expansion." },
          { marks: 10, q: "Insert the keys [10, 85, 15, 70, 20, 60, 30, 50, 65] into an initially empty Red-Black Tree. Show tree after each rotation and recoloring." }
        ]
      },
      {
        unitNo: "Unit IV",
        title: "Linear Programming & Computational Geometry",
        keyConcepts: [
          {
            heading: "Linear Programming & Simplex Algorithm",
            content: `Linear Programming optimizes a linear objective function subject to linear equality and inequality constraints.
- **Standard Form**: Maximize $c^T x$ subject to $Ax \\le b$ and $x \\ge 0$.
- **Slack Form**: Convert inequalities to equalities using slack variables $s_i \\ge 0$.
- **Simplex Algorithm**: Moves from one basic feasible solution (extreme point/vertex of simplex polytope) to an adjacent vertex with non-decreasing objective value.
- **Duality**: Every primal LP has a dual LP. Weak Duality: Primal $\\le$ Dual. Strong Duality: $\\max(c^T x) = \\min(b^T y)$ at optimality.`
          },
          {
            heading: "Convex Hull Algorithms",
            content: `The Convex Hull of a set $Q$ of points in the plane is the smallest convex polygon $P$ containing all points in $Q$.
1. **Graham's Scan Algorithm**:
   - Find point $p_0$ with lowest y-coordinate (and leftmost x in case of tie).
   - Sort remaining points by polar angle with respect to $p_0$.
   - Push first 3 points to stack. For each point $p_i$, pop while angle between top-2 and $p_i$ makes a non-left turn (using cross product: $(p_2 - p_1) \\times (p_3 - p_1) \\le 0$).
   - Complexity: $O(n \\log n)$ due to sorting.
2. **Jarvis March (Gift Wrapping)**:
   - Starts at leftmost point; iteratively selects point with highest polar angle relative to current point.
   - Complexity: $O(nh)$ where $h$ is number of vertices on convex hull. Output-sensitive.`
          },
          {
            heading: "Closest Pair of Points",
            content: `Given $n$ points in Euclidean plane, find pair with smallest distance $d(p_1, p_2) = \\sqrt{(x_1-x_2)^2 + (y_1-y_2)^2}$.
- **Divide and Conquer**:
  1. Sort points by x-coordinate and divide with vertical line $x = x_{mid}$ into left $P_L$ and right $P_R$.
  2. Recursively find minimum distance $\\delta = \\min(\\delta_L, \\delta_R)$.
  3. Check the strip $[x_{mid} - \\delta, x_{mid} + \\delta]$: sort points by y-coordinate.
  4. For each point in strip, only need to check at most 7-8 subsequent points!
  5. Time Complexity: $O(n \\log n)$ with pre-sorted y-array.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define Standard Form and Slack Form of a Linear Program." },
          { marks: 5, q: "Explain the Graham Scan algorithm for computing the Convex Hull with pseudo-code." },
          { marks: 5, q: "Formulate the Single-Source Shortest Path problem as a Linear Program." },
          { marks: 10, q: "Explain the Divide and Conquer algorithm for finding the Closest Pair of Points. Prove why checking 7 points in the strip suffices." }
        ]
      },
      {
        unitNo: "Unit V",
        title: "Approximation Algorithms",
        keyConcepts: [
          {
            heading: "Approximation Ratio & Classes",
            content: `An algorithm for an optimization problem has an approximation ratio $\\rho(n)$ if for any input of size $n$, the cost $C$ satisfies:
$$\\max\\left(\\frac{C}{C^*}, \\frac{C^*}{C}\\right) \\le \\rho(n)$$
where $C^*$ is optimal solution cost.
- **PTAS (Polynomial-Time Approximation Scheme)**: For any fixed $\\epsilon > 0$, running time is polynomial in $n$ (e.g. $O(n^{2/\\epsilon})$) and approximation ratio is $1 + \\epsilon$.
- **FPTAS**: Running time is polynomial in both $n$ and $1/\\epsilon$ (e.g. $O((1/\\epsilon)^2 n^3)$).`
          },
          {
            heading: "Classic Approximation Problems",
            content: `1. **Vertex Cover (2-Approximation)**:
   - Greedily pick arbitrary edge $(u, v)$, add both $u$ and $v$ to cover $C$, and remove all incident edges.
   - Guaranteed $|C| \\le 2 \\cdot |C^*|$. Runs in $O(V + E)$ time.
2. **Metric Traveling Salesman Problem (Metric TSP)**:
   - Triangle inequality holds: $c(u, w) \\le c(u, v) + c(v, w)$.
   - 2-Approximation: Compute MST using Prim's algorithm, do preorder tree walk with shortcuts. Cost $\\le 2 \\cdot \\text{cost}(\\text{MST}) \\le 2 \\cdot \\text{cost}(\\text{OPT})$.
   - Christofides Algorithm: Combines MST with minimum weight perfect matching on odd degree vertices $\\implies$ 1.5-approximation.
3. **Set Covering Problem**:
   - Greedy algorithm: At each step, pick set that covers the maximum number of uncovered elements.
   - Approximation ratio: $H(d) = \\sum_{i=1}^d \\frac{1}{i} \\le \\ln n + 1$.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define PTAS and FPTAS." },
          { marks: 5, q: "Prove that the greedy 2-approximation algorithm for Vertex Cover never exceeds twice optimal cost." },
          { marks: 10, q: "Explain the 2-approximation algorithm for Metric TSP using Minimum Spanning Trees. Prove the approximation ratio." }
        ]
      },
      {
        unitNo: "Unit VI",
        title: "String Matching & NP-Completeness",
        keyConcepts: [
          {
            heading: "String Matching Algorithms",
            content: `Given text $T[1..n]$ and pattern $P[1..m]$, find all valid shifts $s$ such that $T[s+1..s+m] = P[1..m]$.
1. **Naive Algorithm**: Checks all shifts. Worst-case: $O((n - m + 1)m)$.
2. **Rabin-Karp Algorithm**:
   - Uses rolling hash function: $p = (d \\cdot p + P[i]) \\bmod q$.
   - Computes hash of next window in $O(1)$ time: $t_{s+1} = (d(t_s - T[s+1]h) + T[s+m+1]) \\bmod q$.
   - Worst case $O(nm)$, Average case $O(n + m)$.
3. **Knuth-Morris-Pratt (KMP) Algorithm**:
   - Precomputes $\\pi$ table (Prefix function): length of longest proper prefix of $P[1..q]$ that is a suffix of $P[1..q]$.
   - Matches in linear time without backtracking in text: Time $O(n + m)$.
4. **Boyer-Moore Algorithm**:
   - Scans characters from right to left within pattern.
   - Uses Bad Character Rule and Good Suffix Rule for large leaps. Best-case $O(n/m)$, worst-case $O(nm)$.`
          },
          {
            heading: "NP-Completeness Reductions",
            content: `A language $L \\in \\text{NP-Complete}$ if:
1. $L \\in \\text{NP}$ (verifiable in polynomial time).
2. For every $L' \\in \\text{NP}$, $L' \\le_P L$ (polynomial-time reducible).
- **Cook-Levin Theorem**: Circuit-SAT is NP-Complete.
- Canonical Reductions Chain:
  Circuit-SAT $\\to$ 3-CNF SAT $\\to$ Clique $\\to$ Vertex Cover $\\to$ Hamiltonian Cycle $\\to$ TSP $\\to$ Subset Sum.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "State the Prefix Function recurrence in the KMP algorithm." },
          { marks: 5, q: "Explain the rolling hash technique in Rabin-Karp algorithm with modulo arithmetic." },
          { marks: 10, q: "Compute the $\\pi$ table for pattern $P = \\text{'ababaa'}$ and show step-by-step trace of KMP searching in $T = \\text{'ababbababaa'}$. Prove KMP time complexity." }
        ]
      }
    ]
  },
  "2604PCC502": {
    courseCode: "2604PCC502",
    courseTitle: "Advanced Database Systems",
    overview: "Parallel & distributed databases, OODBMS, Big Data storage, blockchain consensus, spatial indexes (R-trees), web/text mining, and deductive databases.",
    units: [
      {
        unitNo: "Unit I",
        title: "Parallel and Distributed Databases",
        keyConcepts: [
          {
            heading: "Parallel Database Architectures",
            content: `Architectures for scale-out parallel query execution:
1. **Shared Memory**: All processors share common memory and disk via high-speed bus. Bottleneck: memory bus contention.
2. **Shared Disk**: Processors have private memories but share common disks via SAN/NAS. Good fault isolation, disk network bottleneck.
3. **Shared Nothing**: Each node has independent CPU, memory, and disk. Nodes communicate over network. Highly scalable (e.g. Teradata, Greenplum, Google BigQuery).
4. **Hierarchical**: Hybrid combining shared-memory nodes connected via shared-nothing clusters.`
          },
          {
            heading: "Query Parallelism & Partitioning",
            content: `- **I/O Parallelism**: Partitioning relations across disks (Round-robin, Hash partitioning, Range partitioning).
- **Intra-Query Parallelism**: Executing multiple operators or multiple instances of an operator in parallel within a single query.
- **Inter-Query Parallelism**: Concurrently executing independent transactions/queries across CPUs.
- **Intra-Operation Parallelism**: Parallelizing a single relational operator (e.g. parallel hash join, parallel sort).`
          },
          {
            heading: "Distributed Transactions & 2-Phase Commit (2PC)",
            content: `Ensures atomicity across multiple distributed database sites:
- **Phase 1: Prepare Phase**:
  1. Coordinator sends PREPARE message to all participants.
  2. Participants execute locally, write redo/undo logs, and reply with VOTE-COMMIT or VOTE-ABORT.
- **Phase 2: Commit Phase**:
  1. If all participants voted COMMIT: Coordinator writes COMMIT log and broadcasts GLOBAL-COMMIT.
  2. If any participant voted ABORT (or timed out): Coordinator writes ABORT log and broadcasts GLOBAL-ABORT.
  3. Participants execute decision and reply with ACK.
- **Weakness of 2PC**: It is a blocking protocol. If the coordinator crashes during Phase 2, participants who voted commit remain blocked.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is the difference between Shared-Memory and Shared-Nothing database architecture?" },
          { marks: 5, q: "Explain the two phases of the Two-Phase Commit (2PC) protocol with state diagrams." },
          { marks: 10, q: "Discuss Horizontal, Vertical, and Mixed Fragmentation in Distributed Database Systems with an example schema. State the rules for correctness (Completeness, Reconstruction, Disjointness)." }
        ]
      },
      {
        unitNo: "Unit II",
        title: "Object Based Databases",
        keyConcepts: [
          {
            heading: "ORDBMS vs OODBMS",
            content: `- **ORDBMS (Object-Relational DBMS)**: Extends traditional relational model with user-defined types (UDTs), object identifiers (OIDs), inheritance, and methods (e.g. PostgreSQL, Oracle).
- **OODBMS (Object-Oriented DBMS)**: Integrates database capabilities directly with OOP languages (C++, Java, Python) without impedance mismatch (e.g. ObjectStore, db4o).
- **ODMG Standard**:
  - **ODL (Object Definition Language)**: Specification language for schema definition.
  - **OQL (Object Query Language)**: Declarative query language resembling SQL but navigating relationships via dot notation ($employee.department.name$).`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is an Object Identifier (OID) and how does it differ from a primary key?" },
          { marks: 5, q: "Explain the ODMG object data model and compare ODL with SQL DDL." },
          { marks: 10, q: "Design an Object-Relational schema for a University System with inheritance (Person -> Student, Faculty) and complex nested attributes in PostgreSQL/Oracle syntax." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "Big Data & Blockchain Databases",
        keyConcepts: [
          {
            heading: "MapReduce Paradigm & Beyond",
            content: `- **Map Function**: $(k_1, v_1) \\to \\text{list}(k_2, v_2)$ transforms raw records into intermediate key-value pairs.
- **Shuffle & Sort**: Group intermediate values by key $\\to (k_2, \\text{list}(v_2))$.
- **Reduce Function**: $(k_2, \\text{list}(v_2)) \\to \\text{list}(k_3, v_3)$ aggregates values.
- **Beyond MapReduce**: Apache Spark uses resilient distributed datasets (RDDs) in memory, avoiding MapReduce's disk I/O bottleneck.`
          },
          {
            heading: "Blockchain as a Distributed Database",
            content: `- Cryptographically linked chain of blocks containing state transitions.
- Key properties: Immutability, Tamper-evidence, Decentralization, High Byzantine Fault Tolerance.
- **Consensus Algorithms**: Proof of Work (PoW), Proof of Stake (PoS), Practical Byzantine Fault Tolerance (PBFT).
- **Smart Contracts**: Turing-complete programs executing deterministically on-chain upon transaction triggers.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define Shuffle and Sort phase in MapReduce." },
          { marks: 5, q: "How does a Blockchain database maintain tamper-evident immutability using Merkle Trees and cryptographic hashes?" },
          { marks: 10, q: "Write a MapReduce algorithm to count word frequencies across large text documents. Trace map, shuffle, and reduce steps." }
        ]
      },
      {
        unitNo: "Unit IV",
        title: "Spatial Data Management",
        keyConcepts: [
          {
            heading: "Spatial Queries & R-Trees",
            content: `- **Spatial Queries**: Point query, Range query (bounding box), k-Nearest Neighbor (k-NN), Spatial Join.
- **R-Tree (Region Tree)**: Height-balanced tree similar to B+ tree for spatial indexing.
  - Leaves store Minimum Bounding Boxes (MBR) containing actual spatial objects and pointers.
  - Internal nodes store MBRs that enclose all children MBRs.
  - Allows overlapping bounding boxes (unlike B-trees).
  - Node splitting algorithms: Quadratic split, Linear split, R* tree split (minimizes area overlap and perimeter).
- **Space Filling Curves**: Z-order curve (Morton code) and Hilbert curve map multi-dimensional space into 1D sequence for B+ tree indexing.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define Minimum Bounding Box (MBR)." },
          { marks: 5, q: "Compare R-Trees and Quad-Trees for indexing 2D spatial objects." },
          { marks: 10, q: "Explain the insertion and node-splitting algorithms in R-Trees. How does an R-Tree execute a range query?" }
        ]
      },
      {
        unitNo: "Unit V",
        title: "Text & Web Mining",
        keyConcepts: [
          {
            heading: "Text Categorization & Web Link Analysis",
            content: `- **TF-IDF (Term Frequency - Inverse Document Frequency)**:
  $$\\text{TF-IDF}(t, d, D) = \\text{TF}(t, d) \\times \\log\\left(\\frac{|D|}{|\\{d \\in D : t \\in d\\}|}\\right)$$
- **Web Content Mining**: Extracts patterns from HTML/text.
- **Web Structure Mining**:
  - **PageRank (Brin & Page)**: Random surfer model with damping factor $d = 0.85$:
    $$PR(u) = \\frac{1-d}{|V|} + d \\sum_{v \\in In(u)} \\frac{PR(v)}{Out(v)}$$
  - **HITS (Kleinberg)**: Computes Authority scores and Hub scores mutually reinforcing each other.
- **Web Usage Mining**: Analyzes server logs, session tracking, clickstream paths.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is the damping factor in Google's PageRank algorithm?" },
          { marks: 5, q: "Explain Hubs and Authorities in Kleinberg's HITS algorithm with update equations." },
          { marks: 10, q: "Explain the text mining preprocessing pipeline (Tokenization, Stopword removal, Stemming/Lemmatization, Vector Space Model) and classification using Multinomial Naive Bayes." }
        ]
      },
      {
        unitNo: "Unit VI",
        title: "Deductive Databases & Recent Trends",
        keyConcepts: [
          {
            heading: "Deductive Databases & Emerging DB Technologies",
            content: `- **Deductive DB & Datalog**: Declarative query language based on first-order predicate logic.
  - Extensional Database (EDB): Stored base facts/tables.
  - Intentional Database (IDB): Deduced rules: $Head \\leftarrow Body_1, Body_2, \\dots$.
  - Fixed-point semantics: Naive and Semi-naive evaluation.
- **Main Memory Databases (IMDB)**: Store primary data in RAM (e.g. Redis, SAP HANA), avoiding disk block access.
- **Temporal Databases**: Support valid-time (world time) and transaction-time (system recording time) bi-temporal models.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is Datalog and how does it relate to Prolog?" },
          { marks: 5, q: "Explain Semi-naive evaluation of recursive Datalog queries with an ancestor-parent example." },
          { marks: 5, q: "What are Bi-temporal databases? Differentiate valid time and transaction time." }
        ]
      }
    ]
  },
  "2604PCC503": {
    courseCode: "2604PCC503",
    courseTitle: "Machine Learning",
    overview: "Comprehensive mathematical treatment of supervised and unsupervised learning, kernel methods, deep convolutional neural networks, recurrent optimization, and real-world AI applications.",
    units: [
      {
        unitNo: "Unit I",
        title: "Introduction & Supervised Learning Algorithms",
        keyConcepts: [
          {
            heading: "Bayesian Decision Theory & MLE",
            content: `Given feature vector $x$ and class $\\omega_i$:
- **Bayes Rule**:
  $$P(\\omega_i | x) = \\frac{p(x | \\omega_i) P(\\omega_i)}{p(x)} = \\frac{p(x | \\omega_i) P(\\omega_i)}{\\sum_j p(x | \\omega_j) P(\\omega_j)}$$
- **Bayes Decision Rule**: Decide $\\omega_1$ if $P(\\omega_1 | x) > P(\\omega_2 | x)$, which minimizes probability of error.
- **Maximum Likelihood Estimation (MLE)**: Estimates parameter $\\theta$ maximizing log-likelihood:
  $$\\hat{\\theta}_{MLE} = \\arg\\max_\\theta \\sum_{k=1}^N \\ln p(x_k | \\theta)$$
- **Bias-Variance Tradeoff**:
  $$\\text{Expected Error} = \\text{Bias}^2(f) + \\text{Var}(f) + \\sigma^2$$`
          },
          {
            heading: "Support Vector Machines (SVM)",
            content: `Finds the maximum margin hyperplane separating classes:
- Optimization Problem (Hard Margin):
  $$\\min_{w, b} \\frac{1}{2} ||w||^2 \\quad \\text{s.t.} \\quad y_i(w^T x_i + b) \\ge 1$$
- Margin width is $\\frac{2}{||w||}$.
- Dual Formulation with Lagrange Multipliers $\\alpha_i$:
  $$\\max_\\alpha \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j x_i^T x_j \\quad \\text{s.t.} \\quad 0 \\le \\alpha_i \\le C, \\sum \\alpha_i y_i = 0$$
- Support vectors are data points with $\\alpha_i > 0$.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "State the Bias-Variance decomposition formula." },
          { marks: 5, q: "Derive the Maximum Likelihood Estimator for mean $\\mu$ and variance $\\sigma^2$ of a 1D Gaussian distribution." },
          { marks: 10, q: "Formulate the primal and dual optimization problems for Support Vector Machines (SVM). Explain how the Kernel trick handles non-linear boundaries." }
        ]
      },
      {
        unitNo: "Unit II",
        title: "Unsupervised Learning & Kernel Methods",
        keyConcepts: [
          {
            heading: "Principal Component Analysis (PCA)",
            content: `Orthogonal linear transformation that projects data to a lower-dimensional subspace maximizing variance:
1. Standardize data matrix $X$ (zero mean, unit variance).
2. Compute Covariance Matrix $\\Sigma = \\frac{1}{N} X^T X$.
3. Compute Eigenvalues $\\lambda_i$ and Eigenvectors $v_i$: $\\Sigma v_i = \\lambda_i v_i$.
4. Sort eigenvectors by descending eigenvalues; pick top $k$ eigenvectors to form projection matrix $W$.
5. Transformed data: $Z = X W$.`
          },
          {
            heading: "Kernel Trick & Mercer's Theorem",
            content: `Maps input features to high-dimensional Hilbert space $\\Phi(x)$ without explicitly calculating coordinates, using kernel function:
$$K(x, x') = \\langle \\Phi(x), \\Phi(x') \\rangle$$
- Popular kernels:
  - Linear: $K(x, x') = x^T x'$
  - Polynomial: $K(x, x') = (x^T x' + c)^d$
  - Radial Basis Function (RBF / Gaussian): $K(x, x') = \\exp\\left(-\\gamma ||x - x'||^2\\right)$`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is Mercer's Theorem in Kernel methods?" },
          { marks: 5, q: "Derive the step-by-step mathematical formulation of Principal Component Analysis (PCA)." },
          { marks: 10, q: "Explain the Forward-Backward and Viterbi algorithms in Hidden Markov Models (HMM) for speech and sequence analysis." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "Convolutional Neural Networks (CNN)",
        keyConcepts: [
          {
            heading: "CNN Architecture & Operations",
            content: `1. **Convolution Layer**:
   - Performs discrete 2D cross-correlation: $S(i, j) = (I * K)(i, j) = \\sum_m \\sum_n I(i-m, j-n) K(m, n)$.
   - Key benefits: Sparse interactions, Parameter sharing, Equivariant representations.
   - Output spatial dimension: $O = \\lfloor \\frac{W - K + 2P}{S} \\rfloor + 1$.
2. **Pooling Layer**:
   - Max Pooling, Average Pooling downsamples feature maps, achieving translation invariance.
3. **Fully Connected (FC) Layer**: Flattened feature maps connected to dense classifier (Softmax).
4. **Infinitely Strong Prior**: Convolution acts as an infinitely strong prior that weights must be localized and shift-invariant.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Calculate output dimension for input $32 \\times 32$, filter $5 \\times 5$, stride $1$, padding $2$." },
          { marks: 5, q: "Why is convolution and pooling considered an 'infinitely strong prior' in Bayesian deep learning?" },
          { marks: 10, q: "Draw and explain the end-to-end architecture of a CNN for Face Recognition. Detail every layer (Conv, ReLU, MaxPool, Dropout, Dense, Softmax/Triplet Loss)." }
        ]
      },
      {
        unitNo: "Unit IV",
        title: "Optimization & Recurrent Networks",
        keyConcepts: [
          {
            heading: "RNNs, LSTM & GRU",
            content: `- **Standard RNN**: $h_t = \\tanh(W_{hh} h_{t-1} + W_{xh} x_t + b_h)$. Suffering from vanishing/exploding gradients over long sequences.
- **LSTM (Long Short-Term Memory)** maintains cell state $C_t$:
  1. **Forget Gate**: $f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$ (What to drop from memory).
  2. **Input Gate**: $i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i), \\tilde{C}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$.
  3. **Update Cell State**: $C_t = f_t * C_{t-1} + i_t * \\tilde{C}_t$.
  4. **Output Gate**: $o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o), h_t = o_t * \\tanh(C_t)$.
- **GRU (Gated Recurrent Unit)**: Merges cell state and hidden state, uses Reset and Update gates.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Why do standard RNNs fail to learn long-term dependencies?" },
          { marks: 5, q: "Explain the four gates of an LSTM cell and write their equations." },
          { marks: 10, q: "Explain Sequence-to-Sequence (Seq2Seq) Encoder-Decoder architecture with attention mechanism for language translation." }
        ]
      },
      {
        unitNo: "Unit V",
        title: "Ensemble Methods & Applications",
        keyConcepts: [
          {
            heading: "Ensemble Learning & Real-world AI Applications",
            content: `- **Bagging (Bootstrap Aggregation)**: Trains multiple models on bootstrap resamples in parallel; reduces variance (e.g. Random Forests).
- **Boosting**: Sequentially trains weak learners where each model focuses on errors of previous models; reduces bias (e.g. AdaBoost, Gradient Boosting, XGBoost).
- **Industrial Case Studies**:
  - Financial Fraud Detection: Extreme class imbalance handling with SMOTE, anomaly scoring.
  - Sentiment Analysis: TF-IDF / BERT fine-tuning on customer reviews.
  - Medical Diagnosis: ResNet-based cancer detection on MRI/CT scans with ROC-AUC evaluation.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Differentiate between Bagging and Boosting." },
          { marks: 5, q: "Explain AdaBoost weight update rule for misclassified training samples." },
          { marks: 10, q: "Design an end-to-end Machine Learning pipeline for Credit Card Fraud Detection addressing high data imbalance, feature engineering, and production monitoring." }
        ]
      }
    ]
  },
  "2604PCC504": {
    courseCode: "2604PCC504",
    courseTitle: "Distributed Computing",
    overview: "Logical time, vector clocks, snapshot algorithms (Chandy-Lamport), distributed mutual exclusion, deadlock detection, consensus algorithms, and cloud virtualization.",
    units: [
      {
        unitNo: "Unit I",
        title: "Distributed Computations & Global State",
        keyConcepts: [
          {
            heading: "Distributed System Models & Cuts",
            content: `- **Message-Passing vs Shared Memory**: No shared physical memory or common global clock. Communication is purely through message transmission.
- **Cuts and Consistency**:
  - A cut $C = (c_1, c_2, \\dots, c_n)$ is a partition of event history into past and future.
  - **Consistent Cut**: If an event $e$ is in the cut and $e' \\to e$ (happened-before), then $e'$ must also be in the cut. (No message can be received before it is sent).
  - **Inconsistent Cut**: Contains the receipt of a message without its corresponding send event.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Define Consistent Cut and Inconsistent Cut in distributed systems." },
          { marks: 5, q: "Explain the asynchronous message-passing model and channel classifications (FIFO, Non-FIFO, Causal)." }
        ]
      },
      {
        unitNo: "Unit II",
        title: "Logical Time & Snapshot Algorithms",
        keyConcepts: [
          {
            heading: "Lamport's Clocks & Vector Clocks",
            content: `1. **Lamport's Scalar Logical Clock**:
   - Condition: If $a \\to b$, then $C(a) < C(b)$.
   - Rule 1: Before each local event, process $P_i$ executes $C_i = C_i + 1$.
   - Rule 2: When sending message $m$, attach timestamp $ts(m) = C_i$.
   - Rule 3: Upon receiving $(m, ts)$, update $C_j = \\max(C_j, ts) + 1$.
   - Limitation: $C(a) < C(b)$ does NOT imply $a \\to b$ (cannot detect concurrency).
2. **Vector Clocks (Mattern & Fidge)**:
   - Each process maintains vector $V_i[1..n]$.
   - Condition: $a \\to b \\iff V(a) < V(b)$. Exactly captures causality!
3. **Chandy-Lamport Snapshot Algorithm**:
   - Records consistent global state on FIFO channels without halting system execution.
   - Initiator records state and sends Marker message on all outgoing channels.
   - When node receives Marker for first time: records local state, marks channel as empty, and forwards Marker.
   - If node has already recorded state: records all incoming messages on channel until Marker arrives as in-flight channel state.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Why can Scalar Clocks not detect concurrent events?" },
          { marks: 5, q: "Illustrate Vector Clock rules and prove how vector clocks identify concurrent events." },
          { marks: 10, q: "Explain Chandy-Lamport distributed snapshot algorithm step-by-step with a 3-process example showing channel state recording." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "Mutual Exclusion & Deadlock Detection",
        keyConcepts: [
          {
            heading: "Distributed Mutual Exclusion",
            content: `1. **Ricart-Agrawala Algorithm (Non-Token Based)**:
   - Process sends timestamped REQUEST to all other $N-1$ processes.
   - Reply deferred if local process is in CS or has requested with smaller timestamp.
   - Enter CS when $N-1$ replies received.
   - Message complexity: $2(N-1)$ messages per CS entry.
2. **Suzuki-Kasami Broadcast Algorithm (Token Based)**:
   - Token holds array $LN[1..N]$ of last granted request.
   - Process requests token by broadcasting REQUEST$(i, sn)$.
   - Holder of token passes it to next requesting process.
   - Message complexity: 0 messages if already holding token; $N$ messages otherwise.`
          },
          {
            heading: "Chandy-Misra-Haas Deadlock Algorithm",
            content: `- **Edge-Chasing Algorithm**:
  - When process $P_i$ is blocked waiting for resource held by $P_j$, it initiates probe $(init, sender, receiver)$.
  - Probe propagates along dependency edges of Wait-For Graph (WFG).
  - If probe returns to initiating process $P_{init}$, a deadlock cycle is detected!`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is the message complexity of Ricart-Agrawala algorithm?" },
          { marks: 5, q: "Explain the Suzuki-Kasami token-based mutual exclusion algorithm." },
          { marks: 10, q: "Explain Chandy-Misra-Haas edge-chasing algorithm for deadlock detection in the AND model with a diagram." }
        ]
      },
      {
        unitNo: "Unit IV",
        title: "Consensus & Checkpointing Recovery",
        keyConcepts: [
          {
            heading: "Consensus, Byzantine Generals & FLP Impossibility",
            content: `- **Consensus Problem**: Multiple processes propose values and must decide on a common value satisfying:
  1. **Agreement**: All non-faulty processes decide the same value.
  2. **Validity**: The decided value was proposed by some process.
  3. **Termination**: All non-faulty processes eventually decide.
- **FLP Impossibility Theorem (Fischer, Lynch, Paterson)**: No deterministic consensus protocol can guarantee agreement in an asynchronous system even with just ONE unannounced crash failure!
- **Byzantine Generals Problem**: In synchronous systems with $m$ traitorous nodes, consensus is possible if and only if total nodes $n \\ge 3m + 1$.
- **Coordinated Checkpointing**: Processes coordinate (e.g. 2-phase) to take consistent snapshots, preventing the **Domino Effect** (cascading rollback).`
          }
        ],
        examQuestions: [
          { marks: 2, q: "State the FLP Impossibility Theorem." },
          { marks: 5, q: "Explain the Domino Effect in uncoordinated checkpointing and how coordinated checkpointing avoids it." },
          { marks: 10, q: "Explain the Byzantine Generals Problem. Prove why $3m + 1$ generals are required to handle $m$ traitors using oral messages." }
        ]
      },
      {
        unitNo: "Unit V",
        title: "Cloud Computing Architectures",
        keyConcepts: [
          {
            heading: "Virtualization & Cloud Services",
            content: `- **Service Models**: IaaS (Infrastructure as a Service - EC2), PaaS (Platform as a Service - App Engine), SaaS (Software as a Service - Google Docs).
- **Hypervisors**: Type 1 (Bare-Metal e.g. ESXi, KVM) vs Type 2 (Hosted e.g. VirtualBox).
- **Load Balancing**: Round-Robin, Weighted Least Connections, IP Hash.
- **Elasticity vs Scalability**: Scalability is the ability to handle increased workload; Elasticity is automatic dynamic scaling up/down based on real-time traffic.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Differentiate between Type-1 and Type-2 Hypervisors." },
          { marks: 5, q: "Explain Load Balancing techniques used in Cloud Data Centers." }
        ]
      }
    ]
  },
  "2604OE505A": {
    courseCode: "2604OE505A",
    courseTitle: "Elective-I: Data Engineering",
    overview: "Data lifecycle, columnar storage (Parquet), modern Lakehouse architectures (Delta Lake, Iceberg), ETL vs ELT (dbt, Airbyte), Kafka & Spark distributed stream processing, and pipeline orchestration.",
    units: [
      {
        unitNo: "Unit I",
        title: "Data Formats & Lifecycle",
        keyConcepts: [
          {
            heading: "Columnar Storage: Parquet vs Row Storage (CSV/Avro)",
            content: `- **Row-Oriented (CSV, JSON, Avro)**: Best for transactional writes (OLTP) where entire rows are frequently inserted or updated.
- **Columnar (Apache Parquet, ORC)**: Stores column values together.
  - Dramatically improves analytical queries (OLAP) via projection pushdown (only read requested columns).
  - Superior compression ratios (Snappy, ZSTD) because values in a column share data type.
  - Stores min/max statistics for partition pruning.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "Why does Apache Parquet provide superior query performance over CSV for analytical queries?" },
          { marks: 5, q: "Explain the stages of the Data Engineering Lifecycle (Ingestion, Storage, Transformation, Serving)." }
        ]
      },
      {
        unitNo: "Unit II",
        title: "Data Lakes, Warehouses & Modern Lakehouses",
        keyConcepts: [
          {
            heading: "Data Lakehouse: Delta Lake & Apache Iceberg",
            content: `- **Data Warehouse**: Structured, high-performance SQL, expensive, rigid schema (Snowflake, Redshift).
- **Data Lake**: Raw storage on S3/GCS, cheap, semi/unstructured data, suffers from lack of ACID transactions and 'data swamp' syndrome.
- **Data Lakehouse**: Combines best of both! Implements an open metadata transaction log (Delta Lake, Apache Iceberg, Apache Hudi) on top of cheap object storage.
  - ACID transactions
  - Time travel and data versioning
  - Schema enforcement and schema evolution`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Compare Data Warehouse, Data Lake, and Data Lakehouse architectures." },
          { marks: 10, q: "Explain how Delta Lake achieves ACID transactions on top of object storage using the JSON transaction log (_delta_log)." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "ETL vs ELT & Dimensional Modeling",
        keyConcepts: [
          {
            heading: "Modern ELT & Dimensional Schemas",
            content: `- **ETL (Extract, Transform, Load)**: Data transformed before loading; historically required due to storage constraints.
- **ELT (Extract, Load, Transform)**: Load raw data directly into Lakehouse; transform inside the warehouse using SQL tools like **dbt (data build tool)**.
- **Star Schema vs Snowflake Schema**:
  - Star Schema: Fact table directly surrounded by denormalized dimension tables. Faster query joins.
  - Snowflake Schema: Dimension tables are normalized into sub-dimensions. Saves storage but requires multi-table joins.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "What is dbt (data build tool) and why is it popular in modern ELT?" },
          { marks: 5, q: "Differentiate between Star Schema and Snowflake Schema with an e-commerce sales example." }
        ]
      },
      {
        unitNo: "Unit IV",
        title: "Distributed Stream Processing (Kafka & Spark)",
        keyConcepts: [
          {
            heading: "Apache Kafka & Spark Streaming",
            content: `- **Kafka Architecture**: Distributed commit log. Topics partitioned across brokers. Consumers form consumer groups for parallel consumption.
- **Spark Structured Streaming**: Micro-batch and continuous processing model based on Spark SQL engine, with checkpointing for exactly-once processing guarantees.`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Explain Apache Kafka topic partitioning and consumer group rebalancing." },
          { marks: 10, q: "Design a real-time event streaming pipeline using Kafka and Spark Structured Streaming for IoT temperature anomaly detection." }
        ]
      },
      {
        unitNo: "Unit V",
        title: "Data Orchestration & Governance",
        keyConcepts: [
          {
            heading: "Apache Airflow & Data Lineage",
            content: `- **Airflow DAGs (Directed Acyclic Graphs)**: Programmatic workflow specification in Python defining tasks, upstream/downstream dependencies, retries, and SLA alerts.
- **Data Governance**: Data catalogs (Amundsen, DataHub), data lineage (OpenLineage), and GDPR/CCPA anonymization.`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Explain the role of Apache Airflow DAGs, Operators, and Schedulers in pipeline orchestration." }
        ]
      }
    ]
  },
  "2604OE505D": {
    courseCode: "2604OE505D",
    courseTitle: "Elective-I: Quantum Computing",
    overview: "Qubits, Bloch sphere, quantum logic gates, Deutsch-Jozsa, Grover, Shor algorithms, Qiskit programming, BB84 quantum key distribution, and quantum hardware.",
    units: [
      {
        unitNo: "Unit I & II",
        title: "Qubits, Superposition & Quantum Gates",
        keyConcepts: [
          {
            heading: "The Qubit & Bloch Sphere",
            content: `A qubit state $|\\psi\\rangle$ is a superposition in a 2D complex Hilbert space:
$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle \\quad \\text{where} \\quad |\\alpha|^2 + |\\beta|^2 = 1$$
On the **Bloch Sphere**:
$$|\\psi\\rangle = \\cos\\left(\\frac{\\theta}{2}\\right) |0\\rangle + e^{i\\phi} \\sin\\left(\\frac{\\theta}{2}\\right) |1\\rangle$$
- **Hadamard Gate (H)**: Creates equal superposition:
  $$H|0\\rangle = \\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}} = |+\\rangle, \\quad H|1\\rangle = \\frac{|0\\rangle - |1\\rangle}{\\sqrt{2}} = |-\\rangle$$
- **CNOT Gate**: Two-qubit entangling gate: $|00\\rangle \\to |00\\rangle, |10\\rangle \\to |11\\rangle$.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "State the No-Cloning Theorem in quantum mechanics." },
          { marks: 5, q: "Represent a qubit on the Bloch Sphere and explain physical meaning of angles $\\theta$ and $\\phi$." },
          { marks: 10, q: "Construct the Bell state $|\\Phi^+\\rangle = \\frac{|00\\rangle + |11\\rangle}{\\sqrt{2}}$ using Hadamard and CNOT gates. Show matrix representation." }
        ]
      },
      {
        unitNo: "Unit III",
        title: "Quantum Algorithms (Grover & Shor)",
        keyConcepts: [
          {
            heading: "Grover's Search & Shor's Factoring",
            content: `- **Grover's Search Algorithm**: Searches unsorted database of $N$ items in $O(\\sqrt{N})$ queries (quadratic speedup over classical $O(N)$).
  - Uses Oracle to flip phase of marked item, followed by Grover Diffusion Operator (inversion about the mean).
- **Shor's Algorithm**: Factors large integers in polynomial time $O((\\log N)^3)$, breaking RSA cryptography.
  - Reduces factoring to order finding; solves order finding using **Quantum Fourier Transform (QFT)**.`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Explain Grover's amplitude amplification and diffusion operator with a geometric diagram." },
          { marks: 10, q: "Explain Shor's algorithm for factoring integers. How does the Quantum Fourier Transform (QFT) achieve exponential speedup?" }
        ]
      },
      {
        unitNo: "Unit IV & V",
        title: "Quantum Cryptography & Hardware",
        keyConcepts: [
          {
            heading: "BB84 Quantum Key Distribution Protocol",
            content: `Allows Alice and Bob to establish a shared secret key with unconditional security guaranteed by the laws of quantum physics:
1. Alice generates random bits and chooses random bases (Rectilinear $+$: $\{|0\\rangle, |1\\rangle\}$ or Diagonal $\\times$: $\{|+\\rangle, |-\\rangle\}$).
2. Bob chooses random bases to measure incoming photons.
3. Over public channel, Alice and Bob announce the bases used.
4. They keep bits where bases matched (sifted key).
5. Any eavesdropping by Eve disturbs quantum states (Heisenberg uncertainty), inducing detectable bit error rate (QBER).`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Explain the step-by-step working of the BB84 Quantum Key Distribution protocol." }
        ]
      }
    ]
  },
  "2604VSEC506": {
    courseCode: "2604VSEC506",
    courseTitle: "Introduction to Constitution of India",
    overview: "Constitutional history, Preamble, Fundamental Rights & Duties, Directive Principles, Union & State Executive, Supreme Court, and Emergency powers.",
    units: [
      {
        unitNo: "Module 1",
        title: "Constitutional Framework & Philosophy",
        keyConcepts: [
          {
            heading: "Preamble & Salient Features",
            content: `The Preamble embodies the fundamental values and philosophy of the Constitution of India:
- **Key Words**: SOVEREIGN, SOCIALIST, SECULAR, DEMOCRATIC, REPUBLIC.
- **Objectives**: JUSTICE (social, economic, political), LIBERTY of thought, expression, belief, faith and worship, EQUALITY of status and opportunity, FRATERNITY assuring dignity of individual and unity and integrity of Nation.
- **Salient Features**: Longest written constitution, blend of rigidity and flexibility, federal system with unitary bias, Parliamentary form of government.`
          }
        ],
        examQuestions: [
          { marks: 2, q: "When was the Constitution of India adopted and when did it come into effect?" },
          { marks: 5, q: "Explain the philosophical significance of the keywords in the Preamble of the Indian Constitution." }
        ]
      },
      {
        unitNo: "Module 2",
        title: "Fundamental Rights & Duties",
        keyConcepts: [
          {
            heading: "Fundamental Rights (Articles 12-35) & Writs",
            content: `1. Right to Equality (Articles 14-18)
2. Right to Freedom (Articles 19-22) - speech, assembly, movement, life and liberty (Art. 21).
3. Right against Exploitation (Articles 23-24).
4. Right to Freedom of Religion (Articles 25-28).
5. Cultural and Educational Rights (Articles 29-30).
6. Right to Constitutional Remedies (Article 32 - Heart and Soul of the Constitution according to Dr. B.R. Ambedkar).
- **Writs issued by Supreme Court / High Courts**:
  - **Habeas Corpus**: Produce the detained person in court.
  - **Mandamus**: Command a public authority to perform duty.
  - **Prohibition**: Prevent lower court from exceeding jurisdiction.
  - **Certiorari**: Quash order of lower tribunal.
  - **Quo-Warranto**: Challenge legality of holding public office.`
          }
        ],
        examQuestions: [
          { marks: 5, q: "Explain the five types of Constitutional Writs under Article 32 and 226." },
          { marks: 5, q: "Differentiate between Fundamental Rights and Directive Principles of State Policy (DPSP)." }
        ]
      }
    ]
  }
};
