// AI Chatbot Knowledge Base & Context Engine for M.Tech CSE Curriculum (2026 Pattern)

export const AI_KNOWLEDGE_ENTRIES = [
  {
    keywords: ["knapsack", "0/1 knapsack", "knapsack recurrence", "knapsack dp"],
    subject: "Advanced Algorithms",
    topic: "0/1 Knapsack Problem",
    response: `### 🎒 0/1 Knapsack Problem (Dynamic Programming)

**Problem Formulation**:
Given $n$ items with values $v_1, v_2, \\dots, v_n$ and positive weights $w_1, w_2, \\dots, w_n$, along with a knapsack of capacity $W$, choose a subset of items to maximize total value without exceeding capacity $W$. Items cannot be broken (0-1 property).

#### 🧮 Recurrence Relation:
Let $K(i, w)$ be the maximum value that can be obtained from the first $i$ items with capacity $w$:
$$K(i, w) = \\begin{cases} 
0 & \\text{if } i = 0 \\text{ or } w = 0 \\\\
K(i-1, w) & \\text{if } w_i > w \\\\
\\max(K(i-1, w), \\; v_i + K(i-1, w - w_i)) & \\text{if } w_i \\le w 
\\end{cases}$$

#### ⏱️ Complexity:
- **Time Complexity**: $\\mathcal{O}(n \\cdot W)$ (Pseudo-polynomial time)
- **Space Complexity**: $\\mathcal{O}(n \\cdot W)$ for 2D DP table, or $\\mathcal{O}(W)$ using space optimization with single row.

#### 💡 Key Exam Tip:
Notice that Fractional Knapsack can be solved greedily in $\\mathcal{O}(n \\log n)$, but 0/1 Knapsack requires Dynamic Programming because the greedy property does not hold!`
  },
  {
    keywords: ["chandy lamport", "snapshot", "global state", "distributed snapshot"],
    subject: "Distributed Computing",
    topic: "Chandy-Lamport Distributed Snapshot Algorithm",
    response: `### 📸 Chandy-Lamport Snapshot Algorithm

The **Chandy-Lamport Algorithm** captures a consistent global state (checkpoint) of an asynchronous distributed system without stopping normal process execution.

#### ⚙️ Assumptions:
1. No process crashes and channels are reliable.
2. Channels are strictly **FIFO (First-In, First-Out)**.
3. Strongly connected communication graph.

#### 🔄 Algorithm Steps:
1. **Initiator Process $P_{init}$**:
   - Takes a local snapshot of its own state.
   - Sends a special control message called a **Marker** on all its outgoing channels before sending any further messages.
2. **Receiving a Marker at Process $P_j$ on incoming channel $C_{ij}$**:
   - **Case A (First time seeing Marker)**:
     - $P_j$ records its own local state.
     - Marks channel $C_{ij}$ as empty (no in-flight messages).
     - Sends Marker along all of its outgoing channels.
   - **Case B (Already recorded state)**:
     - $P_j$ records all messages received on channel $C_{ij}$ between when $P_j$ saved its state and when the Marker arrived. This sequence of messages represents the in-flight channel state!
3. **Termination**: When every process has received a Marker on all incoming channels.`
  },
  {
    keywords: ["vector clock", "scalar clock", "lamport clock", "logical time", "causality"],
    subject: "Distributed Computing",
    topic: "Lamport Scalar Clocks vs Vector Clocks",
    response: `### ⏰ Lamport Logical Clocks vs Vector Clocks

| Feature | Lamport Scalar Clock | Vector Clock (Mattern & Fidge) |
| :--- | :--- | :--- |
| **Clock Representation** | Single Integer $C_i$ | Vector of Integers $V_i[1..n]$ |
| **Causality Detection** | Partial ($e \\to e' \\implies C(e) < C(e')$) | Exact: $e \\to e' \\iff V(e) < V(e')$ |
| **Concurrent Events** | ❌ Cannot detect if two events are concurrent | ✅ If neither $V(a) \\le V(b)$ nor $V(b) \\le V(a)$, then $a \\parallel b$ |
| **Space Overhead** | $\\mathcal{O}(1)$ per message | $\\mathcal{O}(n)$ integers per message |

#### 📐 Vector Clock Update Rules:
1. Before recording an internal or send event at process $P_i$:
   $$V_i[i] = V_i[i] + 1$$
2. Message send includes timestamp $V_i$.
3. Upon receiving message with timestamp $V_{msg}$:
   $$V_j[k] = \\max(V_j[k], V_{msg}[k]) \\quad \\forall k \\in [1..n]$$
   $$V_j[j] = V_j[j] + 1$$`
  },
  {
    keywords: ["floyd warshall", "apsp", "all pairs shortest path", "johnson"],
    subject: "Advanced Algorithms",
    topic: "All-Pairs Shortest Paths (Floyd-Warshall & Johnson)",
    response: `### 🛣️ All-Pairs Shortest Paths

#### 1. Floyd-Warshall Algorithm (Dynamic Programming)
Computes shortest paths between all pairs of vertices in a directed graph.
- **Recurrence**:
  $$d_{ij}^{(k)} = \\min\\left(d_{ij}^{(k-1)}, \\; d_{ik}^{(k-1)} + d_{kj}^{(k-1)}\\right)$$
  where $k$ is the maximum intermediate vertex allowed.
- **Time Complexity**: $\\Theta(V^3)$
- **Space Complexity**: $\\Theta(V^2)$
- **Handles negative edge weights**: Yes, and detects negative-weight cycles if $d_{ii} < 0$.

#### 2. Johnson's Algorithm for Sparse Graphs
- **Strategy**: Reweights edges using Bellman-Ford to make all weights non-negative without altering shortest path structure:
  $$\\hat{w}(u, v) = w(u, v) + h(u) - h(v) \\ge 0$$
- Runs Dijkstra's algorithm from each vertex in $\\mathcal{O}(V^2 \\log V + VE)$ time.
- Far superior to Floyd-Warshall when graph is sparse ($E \\ll V^2$).`
  },
  {
    keywords: ["r tree", "rtree", "spatial data", "spatial index", "b tree"],
    subject: "Advanced Database Systems",
    topic: "R-Trees for Spatial Indexing",
    response: `### 🗺️ R-Trees for Spatial Data Management

An **R-Tree (Region Tree)** is a height-balanced multidimensional index tree designed for spatial access methods (e.g. GIS maps, CAD geometries, GPS locations).

#### 🌲 Key Properties:
- Similar to a B+ Tree, but nodes store **Minimum Bounding Boxes (MBR)** instead of 1D scalar intervals.
- **Leaf nodes**: Store pairs $(MBR, Object\\_ID)$ where MBR tightly encloses the spatial object.
- **Internal nodes**: Store pairs $(MBR, Child\\_Pointer)$ where MBR is the smallest bounding rectangle enclosing all children's MBRs.
- Unlike B-Trees, bounding rectangles of siblings **can overlap**.

#### 🔍 Supported Queries:
1. **Range Query / Window Query**: Find all polygons intersecting a given bounding rectangle.
2. **k-Nearest Neighbor (k-NN)**: Branch and bound search guided by distance to MBRs.
3. **Spatial Join**: Find pairs of overlapping polygons across two spatial relations.`
  },
  {
    keywords: ["graham scan", "convex hull", "jarvis march", "computational geometry"],
    subject: "Advanced Algorithms",
    topic: "Convex Hull Algorithms (Graham Scan & Jarvis March)",
    response: `### 📐 Convex Hull: Graham's Scan Algorithm

The **Convex Hull** of a set $Q$ of points in 2D plane is the smallest convex polygon containing all points in $Q$.

#### 🚶‍♂️ Graham's Scan Steps:
1. Find point $p_0$ with lowest $y$-coordinate (leftmost in case of tie).
2. Sort remaining $n-1$ points by polar angle with respect to $p_0$ counterclockwise.
3. Push $p_0, p_1, p_2$ onto a stack.
4. For each subsequent point $p_i$:
   - Check if $p_i$ makes a **left turn** or **non-left turn** with the top two points on stack.
   - Use the **2D cross product**:
     $$\\tau = (x_2 - x_1)(y_3 - y_1) - (y_2 - y_1)(x_3 - x_1)$$
     - If $\\tau > 0$: Counterclockwise / Left turn (Keep).
     - If $\\tau \\le 0$: Clockwise / Non-left turn $\\implies$ Pop top of stack!
   - Push $p_i$ onto stack.
5. **Time Complexity**: $\\mathcal{O}(n \\log n)$ due to sorting; the stack traversal takes linear $\\mathcal{O}(n)$ time.`
  },
  {
    keywords: ["svm", "support vector machine", "kernel trick", "margin", "slack"],
    subject: "Machine Learning",
    topic: "Support Vector Machines (Primal, Dual & Kernel Trick)",
    response: `### 🎯 Support Vector Machines (SVM)

SVM finds the maximum-margin hyperplane separating two classes: $w^T x + b = 0$.

#### 1. Primal Formulation (Soft-Margin):
$$\\min_{w, b, \\xi} \\frac{1}{2} ||w||^2 + C \\sum_{i=1}^N \\xi_i \\quad \\text{s.t.} \\quad y_i(w^T x_i + b) \\ge 1 - \\xi_i, \\quad \\xi_i \\ge 0$$
- $C$ controls tradeoff between margin size and training classification errors.

#### 2. Dual Formulation:
$$\\max_\\alpha \\sum_{i=1}^N \\alpha_i - \\frac{1}{2} \\sum_{i,j} \\alpha_i \\alpha_j y_i y_j (x_i^T x_j)$$
subject to $0 \\le \\alpha_i \\le C$ and $\\sum \\alpha_i y_i = 0$.

#### 3. The Kernel Trick:
Replaces dot product $x_i^T x_j$ with kernel function $K(x_i, x_j) = \\langle \\Phi(x_i), \\Phi(x_j) \\rangle$ in an infinite-dimensional feature space without explicitly computing $\\Phi(x)$!
- **RBF / Gaussian Kernel**: $K(x, x') = \\exp(-\\gamma ||x - x'||^2)$`
  },
  {
    keywords: ["lstm", "rnn", "gru", "recurrent neural network", "vanishing gradient"],
    subject: "Machine Learning",
    topic: "Recurrent Neural Networks, LSTM and GRU",
    response: `### 🧠 LSTM (Long Short-Term Memory) Architecture

Standard RNNs suffer from the **vanishing gradient problem** when backpropagating through long sequences. LSTMs solve this by introducing an explicit **Cell State ($C_t$)** governed by three interactive gates:

1. **Forget Gate ($f_t$)**: Decides what information to discard from the past:
   $$f_t = \\sigma(W_f [h_{t-1}, x_t] + b_f)$$
2. **Input Gate ($i_t$) & Candidate Memory ($\\tilde{C}_t$)**: Decides what new information to store:
   $$i_t = \\sigma(W_i [h_{t-1}, x_t] + b_i)$$
   $$\\tilde{C}_t = \\tanh(W_c [h_{t-1}, x_t] + b_c)$$
3. **Cell State Update**:
   $$C_t = f_t \\odot C_{t-1} + i_t \\odot \\tilde{C}_t$$
4. **Output Gate ($o_t$) & Hidden State ($h_t$)**:
   $$o_t = \\sigma(W_o [h_{t-1}, x_t] + b_o)$$
   $$h_t = o_t \\odot \\tanh(C_t)$$`
  },
  {
    keywords: ["flp", "flp impossibility", "byzantine", "consensus"],
    subject: "Distributed Computing",
    topic: "Consensus, Byzantine Agreement & FLP Impossibility",
    response: `### ⚖️ Distributed Consensus & FLP Impossibility Theorem

#### 1. FLP Impossibility Theorem (Fischer, Lynch, Paterson 1985):
> **Theorem**: In an asynchronous network, no deterministic consensus protocol can guarantee safety and liveness in the presence of even **one unannounced crash failure**.

- **Why?** In an asynchronous system, a process cannot distinguish between a node that has crashed and a node that is merely responding very slowly.
- **Workarounds**: Randomization (Ben-Or), Failure detectors (Chandra-Toueg), Partial synchrony (Paxos, Raft).

#### 2. Byzantine Generals Problem:
- In synchronous networks with $m$ arbitrary/malicious (Byzantine) traitorous nodes:
- Consensus is possible **if and only if** the total number of processes $n \\ge 3m + 1$.`
  },
  {
    keywords: ["lakehouse", "delta lake", "iceberg", "data lake", "data warehouse"],
    subject: "Elective-I: Data Engineering",
    topic: "Data Lakehouse: Delta Lake & Apache Iceberg",
    response: `### 🏢 Modern Data Lakehouse Architecture

A **Data Lakehouse** combines the cost-effective scalability of object storage (S3, GCS, ADLS) with the enterprise transactional reliability and performance of data warehouses.

#### 🔑 Core Capabilities:
- **ACID Transactions**: Supported using atomic commit logs (e.g. \`_delta_log/\` JSON commits).
- **Time Travel & Versioning**: Query historical data snapshots using timestamps or commit version numbers.
- **Schema Enforcement & Evolution**: Rejects writes that violate schema, allowing safe migration without corrupted data.
- **Open File Formats**: Data is stored in Apache Parquet format, preventing proprietary vendor lock-in.`
  },
  {
    keywords: ["qubit", "quantum", "bloch sphere", "deutsch", "shor", "grover"],
    subject: "Elective-I: Quantum Computing",
    topic: "Qubits, Quantum Gates & Grover/Shor Algorithms",
    response: `### ⚛️ Quantum Computing Fundamentals

#### 1. Qubit & Superposition:
A qubit state $|\\psi\\rangle$ is a linear combination of basis states $|0\\rangle$ and $|1\\rangle$:
$$|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle \\quad \\text{where } |\\alpha|^2 + |\\beta|^2 = 1$$
Upon measurement, collapses to $|0\\rangle$ with probability $|\\alpha|^2$, or $|1\\rangle$ with probability $|\\beta|^2$.

#### 2. Key Quantum Gates:
- **Hadamard ($H$)**: Creates equal superposition $\\frac{|0\\rangle + |1\\rangle}{\\sqrt{2}}$.
- **CNOT**: Entangles two qubits (target flipped if control is 1).
- **Pauli-X**: Bit-flip gate ($X|0\\rangle = |1\\rangle$).

#### 3. Breakthrough Quantum Algorithms:
- **Grover's Algorithm**: Unsorted database search in $\\mathcal{O}(\\sqrt{N})$ queries (Quadratic speedup).
- **Shor's Algorithm**: Integer prime factorization in $\\mathcal{O}((\\log N)^3)$ time via Quantum Fourier Transform (Exponential speedup over classical RSA).`
  },
  {
    keywords: ["scheme", "marks", "credits", "syllabus structure", "evaluation", "grading"],
    subject: "Curriculum Overview",
    topic: "M.Tech Computer Engineering (2026 Pattern) Exam & Credit Scheme",
    response: `### 📋 Examination & Evaluation Scheme (2026 Pattern)

- **Total Semester-I Credits**: 22 Credits
- **Standard Theory Course Evaluation (Total 100 Marks)**:
  - **TAE (Teacher Assessment Exam / Continuous Assessment)**: 20 Marks
  - **CAE (Continuous Assessment Exam / Mid-Sem Exam)**: 20 Marks
  - **ESE (End Semester Examination - Autonomous Board)**: 60 Marks
- **Lab Practice - I (Course Code: 2604PCC526)**:
  - Term Work: 25 Marks
  - Oral / Practical Exam: 25 Marks
  - Total: 50 Marks (2 Credits)
- **Introduction to Constitution of India (2604VSEC506)**:
  - 1 Credit (Audit / Satisfactory grading requirement)`
  }
];

export function findAiResponse(query) {
  const cleanQuery = query.toLowerCase().trim();
  
  // Score entries by keyword matches
  let bestEntry = null;
  let highestScore = 0;

  for (const entry of AI_KNOWLEDGE_ENTRIES) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (cleanQuery.includes(kw)) {
        score += kw.length * 2;
      }
    }
    // Check topic or subject direct match
    if (cleanQuery.includes(entry.topic.toLowerCase())) score += 15;
    if (cleanQuery.includes(entry.subject.toLowerCase())) score += 8;

    if (score > highestScore) {
      highestScore = score;
      bestEntry = entry;
    }
  }

  if (highestScore > 4 && bestEntry) {
    return {
      source: "Built-in Neural Syllabus Engine",
      confidence: Math.min(99, 70 + highestScore * 3),
      topic: bestEntry.topic,
      subject: bestEntry.subject,
      text: bestEntry.response
    };
  }

  // Fallback intelligent response
  return {
    source: "Built-in Neural Syllabus Engine",
    confidence: 65,
    topic: "Curriculum Academic Assistant",
    subject: "General Syllabus Guidance",
    text: `### 🎓 M.Tech Computer Engineering AI Assistant

I can answer in-depth academic questions, explain algorithms with derivations, solve recurrences, and assist with lab assignments for your **M.Tech (2026 Pattern)** curriculum.

**Popular topics you can ask me about:**
- *0/1 Knapsack problem dynamic programming recurrence and complexity*
- *Chandy-Lamport distributed snapshot algorithm step-by-step*
- *Vector clocks vs Lamport scalar clocks with update rules*
- *Floyd-Warshall vs Johnson's algorithm for All-Pairs Shortest Paths*
- *Support Vector Machines (Primal, Dual formulation, Kernel trick)*
- *R-Trees spatial indexing and bounding boxes*
- *Graham's Scan algorithm for Convex Hull*
- *LSTM forget, input, and output gate equations*
- *Delta Lake / Lakehouse ACID transactions and schema evolution*
- *Examination and credit scheme (TAE 20, CAE 20, ESE 60)*

*(Tip: You can also configure your Gemini API Key in the settings toggle above to activate free-form Live LLM generation!)*`
  };
}
