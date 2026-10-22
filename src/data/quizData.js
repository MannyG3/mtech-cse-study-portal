// Interactive Practice Quizzes and Flashcard Decks for M.Tech CSE

export const QUIZ_QUESTIONS = {
  "2604PCC501": [
    {
      id: "algo_q1",
      question: "What is the time complexity of Strassen's Matrix Multiplication algorithm?",
      options: [
        "O(n^3)",
        "O(n^2.807)",
        "O(n^2 log n)",
        "O(n^2)"
      ],
      correctAnswer: 1,
      explanation: "Strassen's algorithm computes only 7 sub-matrix multiplications instead of 8, leading to recurrence T(n) = 7T(n/2) + O(n^2), which by Master's theorem evaluates to O(n^(log2 7)) ~ O(n^2.807)."
    },
    {
      id: "algo_q2",
      question: "Which data structure provides an O(1) amortized time complexity for the Decrease-Key operation?",
      options: [
        "Binary Heap",
        "Binomial Heap",
        "Fibonacci Heap",
        "Red-Black Tree"
      ],
      correctAnswer: 2,
      explanation: "Fibonacci Heaps achieve O(1) amortized time for Insert, Union, and Decrease-Key operations by deferring tree consolidation until Extract-Min."
    },
    {
      id: "algo_q3",
      question: "In Graham's Scan algorithm for Convex Hull, how is a non-left (clockwise) turn detected between points p1, p2, and p3?",
      options: [
        "Dot product is negative",
        "2D Cross product is <= 0",
        "Euclidean distance between p1 and p3 is minimal",
        "Slope of line p1-p2 is zero"
      ],
      correctAnswer: 1,
      explanation: "The signed 2D cross product (x2 - x1)(y3 - y1) - (y2 - y1)(x3 - x1) is <= 0 for clockwise (non-left) turns, signaling that the top point must be popped from the stack."
    },
    {
      id: "algo_q4",
      question: "What is the guaranteed approximation ratio of the greedy vertex cover algorithm that picks both endpoints of an arbitrary edge?",
      options: [
        "1.5",
        "2.0",
        "ln(V)",
        "log(V)"
      ],
      correctAnswer: 1,
      explanation: "Because any valid vertex cover must select at least one endpoint from each edge of a maximal matching, selecting both endpoints guarantees a cost at most 2 * OPT."
    }
  ],
  "2604PCC502": [
    {
      id: "db_q1",
      question: "What is the primary drawback of the Two-Phase Commit (2PC) protocol in distributed databases?",
      options: [
        "It does not guarantee serializability",
        "It is a blocking protocol if the coordinator fails during commit phase",
        "It cannot handle intra-query parallelism",
        "It requires shared-memory architecture"
      ],
      correctAnswer: 1,
      explanation: "2PC is blocking: if the coordinator crashes after participants have voted COMMIT, participants must wait indefinitely for coordinator recovery."
    },
    {
      id: "db_q2",
      question: "In R-Trees for spatial indexing, what geometric shape is stored at internal and leaf nodes?",
      options: [
        "Voronoi Polygon",
        "Delaunay Triangle",
        "Minimum Bounding Rectangle (MBR)",
        "Convex Hull"
      ],
      correctAnswer: 2,
      explanation: "R-Trees index spatial data using Minimum Bounding Rectangles (MBRs) parallel to coordinate axes that enclose child nodes or spatial objects."
    },
    {
      id: "db_q3",
      question: "Which database architectural model scales best to thousands of commodity servers with zero shared components?",
      options: [
        "Shared Memory",
        "Shared Disk",
        "Shared Nothing",
        "Centralized Mainframe"
      ],
      correctAnswer: 2,
      explanation: "Shared-nothing architectures eliminate bus and storage network bottlenecks, allowing linear scale-out by adding independent nodes."
    }
  ],
  "2604PCC503": [
    {
      id: "ml_q1",
      question: "Which gate in an LSTM cell determines which portion of the past cell state (C_t-1) should be eliminated?",
      options: [
        "Input Gate",
        "Forget Gate",
        "Output Gate",
        "Reset Gate"
      ],
      correctAnswer: 1,
      explanation: "The forget gate f_t = sigma(W_f [h_t-1, x_t] + b_f) outputs numbers between 0 and 1, where 0 means completely discard and 1 means completely retain."
    },
    {
      id: "ml_q2",
      question: "How does the Kernel Trick enable Support Vector Machines to separate non-linearly separable data?",
      options: [
        "By applying gradient clipping",
        "By computing dot products in a higher-dimensional Hilbert space implicitly",
        "By removing outlier points",
        "By converting labels to continuous targets"
      ],
      correctAnswer: 1,
      explanation: "By Mercer's theorem, kernel functions K(x, z) evaluate dot products in higher-dimensional feature space without explicitly mapping vectors."
    },
    {
      id: "ml_q3",
      question: "What is the effect of increasing the number of base estimators in a Random Forest (Bagging)?",
      options: [
        "It causes heavy overfitting on test set",
        "It reduces model variance without increasing bias significantly",
        "It increases bias towards majority class",
        "It reduces training time linearly"
      ],
      correctAnswer: 1,
      explanation: "Bagging aggregates decorrelated predictions, reducing the variance of high-variance decision trees without causing overfitting."
    }
  ],
  "2604PCC504": [
    {
      id: "dc_q1",
      question: "What does the FLP Impossibility Theorem state about distributed consensus?",
      options: [
        "Consensus requires at least 4 rounds of communication",
        "No deterministic consensus protocol can guarantee safety and liveness in asynchronous systems with even one unannounced crash failure",
        "Byzantine fault tolerance requires 5m + 1 nodes",
        "Clock synchronization can never achieve less than 1ms error"
      ],
      correctAnswer: 1,
      explanation: "Fischer, Lynch, and Paterson proved that in an asynchronous message-passing system, deterministic agreement is impossible in the presence of even a single fail-stop crash."
    },
    {
      id: "dc_q2",
      question: "In the Chandy-Lamport snapshot algorithm, how are in-flight channel messages recorded?",
      options: [
        "By freezing all network traffic",
        "By recording messages received on incoming channels between when local state was saved and when the Marker arrived",
        "By re-requesting messages from the initiator",
        "By reading physical clock timestamps"
      ],
      correctAnswer: 1,
      explanation: "Under FIFO assumptions, all messages sent before the marker that arrive after the receiving process recorded state constitute in-flight channel state."
    }
  ]
};

export const FLASHCARD_DECKS = {
  "2604PCC501": [
    {
      front: "Strassen's Matrix Multiplication Recurrence",
      back: "T(n) = 7T(n/2) + Theta(n^2)\nComplexity: O(n^2.807)\nSaves 1 multiplication per recursive step."
    },
    {
      front: "Floyd-Warshall DP Recurrence",
      back: "d[i][j]^(k) = min( d[i][j]^(k-1), d[i][k]^(k-1) + d[k][j]^(k-1) )\nTime: O(V^3), Space: O(V^2)"
    },
    {
      front: "Red-Black Tree Black-Height Property",
      back: "Every path from any node to its descendant NIL leaves contains the same number of black nodes. Guarantees max height <= 2 log2(n+1)."
    },
    {
      front: "Graham Scan 2D Cross Product",
      back: "tau = (x2 - x1)(y3 - y1) - (y2 - y1)(x3 - x1)\ntau > 0: Left turn (Counter-clockwise)\ntau <= 0: Right turn / collinear (Pop top of stack)"
    }
  ],
  "2604PCC502": [
    {
      front: "Two-Phase Commit (2PC) Phases",
      back: "Phase 1: Coordinator PREPARE -> Participants vote COMMIT/ABORT\nPhase 2: Coordinator writes log & broadcasts GLOBAL-COMMIT or GLOBAL-ABORT"
    },
    {
      front: "TF-IDF Formula",
      back: "TF-IDF(t, d, D) = TF(t, d) * log( |D| / |{d in D : t in d}| )\nMeasures term importance relative to corpus."
    },
    {
      front: "PageRank Formula",
      back: "PR(u) = (1-d)/N + d * sum( PR(v) / Out(v) )\nd is damping factor typically set to 0.85."
    }
  ],
  "2604PCC503": [
    {
      front: "Bayes Decision Rule",
      back: "P(w|x) = [p(x|w) * P(w)] / p(x)\nDecide class w1 if P(w1|x) > P(w2|x) to minimize classification error."
    },
    {
      front: "SVM Margin Width",
      back: "Margin Width = 2 / ||w||\nMaximized by minimizing 1/2 ||w||^2 subject to y_i(w^T x_i + b) >= 1."
    },
    {
      front: "CNN Conv Layer Output Dimension",
      back: "Output Width O = floor((W - K + 2P)/S) + 1\nW: input width, K: filter size, P: padding, S: stride."
    }
  ],
  "2604PCC504": [
    {
      front: "Vector Clock Condition",
      back: "Event a happened-before b (a -> b) IF AND ONLY IF V(a) < V(b).\nAccurately detects concurrent events!"
    },
    {
      front: "Byzantine Generals Consensus Condition",
      back: "In synchronous systems with m traitors, consensus is possible IF AND ONLY IF total nodes n >= 3m + 1."
    },
    {
      front: "Chandy-Misra-Haas Probe Format",
      back: "Probe: (initiator_i, sender_j, receiver_k)\nDeadlock exists if probe returns back to initiating process i."
    }
  ]
};
