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
  ],
  "2604PCC551": [
    {
      id: "ir_q1",
      question: "What is the optimal spacing for skip pointers in a postings list of length L to minimize intersection comparisons?",
      options: [
        "L / 2",
        "floor(sqrt(L))",
        "log2(L)",
        "L / 4"
      ],
      correctAnswer: 1,
      explanation: "Placing skip pointers at intervals of floor(sqrt(L)) balances the number of skips with the length of each skipped segment, achieving O(sqrt(L)) skip comparisons."
    },
    {
      id: "ir_q2",
      question: "In the Okapi BM25 ranking model, what is the role of parameter k1?",
      options: [
        "It sets the damping factor for web crawling",
        "It controls term frequency saturation non-linearly",
        "It tunes document length normalization penalty",
        "It sets the Dirichlet prior smoothing value"
      ],
      correctAnswer: 1,
      explanation: "Parameter k1 controls term frequency saturation: as tf increases, BM25 term weight asymptotes towards (k1 + 1), preventing high term repetition from dominating ranking."
    },
    {
      id: "ir_q3",
      question: "How does the PageRank random surfer model eliminate spider traps and dead-ends?",
      options: [
        "By ignoring incoming links to leaf nodes",
        "By applying a teleportation factor (damping factor d ~ 0.85) to jump to a random web page",
        "By sorting pages by in-degree alphabetically",
        "By removing cyclic paths from the web graph"
      ],
      correctAnswer: 1,
      explanation: "With probability 1 - d (~0.15), the random surfer teleports to any random page uniformly, guaranteeing the Markov chain remains irreducible and aperiodic."
    },
    {
      id: "ir_q4",
      question: "Why is Normalized Discounted Cumulative Gain (NDCG) preferred over Precision@k for web search evaluation?",
      options: [
        "NDCG computes in O(1) time",
        "NDCG accommodates graded relevance judgements (e.g. 0 to 3) and applies logarithmic position discounts",
        "NDCG does not require an ideal ranking (IDCG)",
        "NDCG is only suitable for unranked Boolean sets"
      ],
      correctAnswer: 1,
      explanation: "NDCG supports multi-level graded relevance (e.g. 3=vital, 2=relevant, 1=marginal, 0=non-relevant) and discounts results appearing lower in the ranking by 1/log2(rank+1)."
    }
  ],
  "2604PCC552": [
    {
      id: "nlp_q1",
      question: "What primary problem in NLP does Byte-Pair Encoding (BPE) solve for modern language models?",
      options: [
        "Eliminates the need for self-attention",
        "Handles out-of-vocabulary (OOV) tokens by segmenting rare words into frequent subword units",
        "Guarantees context-free grammar parsing",
        "Computes exact semantic entailment"
      ],
      correctAnswer: 1,
      explanation: "BPE starts with characters and iteratively merges frequent byte/token pairs, allowing any unknown word to be decomposed into recognized subwords without OOV UNK tokens."
    },
    {
      id: "nlp_q2",
      question: "Why does the Transformer scaled dot-product attention divide QK^T by sqrt(d_k)?",
      options: [
        "To invert the key matrix",
        "To prevent large magnitude dot products from pushing the softmax function into regions with near-zero gradients",
        "To enforce orthogonal projections",
        "To reduce computational complexity from O(n^2) to O(n)"
      ],
      correctAnswer: 1,
      explanation: "For vectors of dimension d_k with independent zero-mean components, the dot product variance grows as d_k; dividing by sqrt(d_k) stabilizes variance to 1, preventing softmax saturation."
    },
    {
      id: "nlp_q3",
      question: "What is the structural difference between BERT and GPT architectural paradigms?",
      options: [
        "BERT uses recurrent LSTMs; GPT uses feedforward CNNs",
        "BERT is a bidirectional encoder with masked language modeling; GPT is an autoregressive decoder with causal masking",
        "BERT cannot process text sequences longer than 64 tokens",
        "GPT uses cross-encoders exclusively"
      ],
      correctAnswer: 1,
      explanation: "BERT uses bidirectional self-attention to encode full context for classification/retrieval; GPT uses causal triangular masking so each token only attends to previous tokens for generation."
    },
    {
      id: "nlp_q4",
      question: "In Word2Vec Skip-gram, how does Negative Sampling make training efficient?",
      options: [
        "It discards words with frequency less than 100",
        "It replaces the costly full-vocabulary softmax denominator with binary logistic regression against K negative samples",
        "It trains a separate recurrent network for context",
        "It factorizes the PPMI matrix with SVD"
      ],
      correctAnswer: 1,
      explanation: "Instead of normalizing over the entire vocabulary |V| (which can be millions of words), Negative Sampling updates only the target word and K (~5-20) sampled noise words."
    }
  ],
  "2604PCC553": [
    {
      id: "dl_q1",
      question: "In ResNet architectures, why do identity skip connections (y = F(x) + x) eliminate the vanishing gradient problem?",
      options: [
        "They set all weights to zero",
        "During backpropagation, the gradient dL/dx contains an additive '+ 1' term that propagates gradients directly to earlier layers",
        "They double the number of convolutional kernels",
        "They enforce ReLU outputs to be strictly negative"
      ],
      correctAnswer: 1,
      explanation: "By chain rule, dL/dx = (dL/dy) * (dF/dx + 1). Even if the learned layer weight gradient dF/dx is near zero, the +1 term ensures gradients flow directly through the shortcut."
    },
    {
      id: "dl_q2",
      question: "What distinction separates the Adam optimizer from standard SGD with momentum?",
      options: [
        "Adam uses fixed learning rates without decay",
        "Adam computes individual adaptive learning rates for each parameter using estimates of both first (mean) and second (uncentered variance) moments",
        "Adam cannot be used on mini-batches",
        "Adam discards past gradient information"
      ],
      correctAnswer: 1,
      explanation: "Adam maintains running exponential moving averages of both gradients (first moment m_t) and squared gradients (second moment v_t), with bias correction for early steps."
    },
    {
      id: "dl_q3",
      question: "What is the purpose of the Reparameterization Trick in Variational Autoencoders (VAEs)?",
      options: [
        "To quantize latent variables into integers",
        "To express the stochastic latent code as z = mu + sigma * epsilon (where epsilon ~ N(0, I)), allowing backpropagation through the sampling step",
        "To replace the encoder with an adversarial discriminator",
        "To remove KL divergence from the loss function"
      ],
      correctAnswer: 1,
      explanation: "Standard random sampling is non-differentiable; reparameterization isolates stochasticity into an external noise variable epsilon, making z a deterministic function of network outputs mu and sigma."
    },
    {
      id: "dl_q4",
      question: "In Vision Transformers (ViT), how are 2D images converted into input tokens suitable for the Transformer encoder?",
      options: [
        "By passing images through a 50-layer CNN first",
        "By dividing the image into non-overlapping patches (e.g. 16x16), linearly projecting them into 1D embeddings, and prepending a learnable [CLS] token",
        "By computing Fourier transforms of pixel rows",
        "By converting pixels to text descriptions"
      ],
      correctAnswer: 1,
      explanation: "ViT splits an image of size HxW into N = (HW)/P^2 patches of size PxP, projects each patch into a vector of dimension D, adds 1D learnable position embeddings, and feeds them as token sequences."
    }
  ],
  "2604RM601": [
    {
      id: "rm_q1",
      question: "What constitutes a Type I Error (alpha) in statistical hypothesis testing?",
      options: [
        "Accepting the alternative hypothesis when it is true",
        "Rejecting the null hypothesis (H0) when H0 is actually true (False Positive)",
        "Failing to reject the null hypothesis when H0 is false (False Negative)",
        "Calculating an invalid p-value"
      ],
      correctAnswer: 1,
      explanation: "Type I error occurs when a researcher mistakenly detects a statistically significant effect that does not exist in reality (rejecting a true H0), bounded by alpha (commonly 0.05)."
    },
    {
      id: "rm_q2",
      question: "Why is One-Way Analysis of Variance (ANOVA) preferred over multiple independent pairwise Student's t-tests across 4 treatment groups?",
      options: [
        "ANOVA does not require numerical data",
        "Multiple pairwise t-tests inflate the cumulative Type I family-wise error rate: alpha_FW = 1 - (1 - alpha)^k",
        "ANOVA cannot calculate an F-statistic",
        "t-tests only work on non-normal distributions"
      ],
      correctAnswer: 1,
      explanation: "Testing 4 groups with pairwise t-tests requires 6 tests; at alpha=0.05 each, the chance of at least one false positive increases to ~26%. ANOVA tests all group means simultaneously."
    },
    {
      id: "rm_q3",
      question: "Under the PRISMA guidelines for Systematic Literature Reviews, what is the sequence of the PRISMA flow stages?",
      options: [
        "Publication -> Peer Review -> Writing -> Sampling",
        "Identification -> Screening -> Eligibility -> Included",
        "Hypothesis -> Coding -> Debugging -> Presentation",
        "Scopus -> Patent -> Copyright -> Commercialization"
      ],
      correctAnswer: 1,
      explanation: "PRISMA protocol systematically documents: Identification (records from database search), Screening (duplicates removed & title/abstract filter), Eligibility (full-text review), and Included studies."
    },
    {
      id: "rm_q4",
      question: "What protection is provided by an Indian Patent versus Copyright in computer science innovations?",
      options: [
        "Patents protect the exact text of the source code; copyright protects underlying mathematical formulas",
        "Patents protect novel technical inventions and hardware-software implementations for 20 years; copyright protects the literal expression of source code for the author's lifetime + 60 years",
        "Patents are granted indefinitely with zero examination",
        "Copyright protects algorithmic ideas before they are written"
      ],
      correctAnswer: 1,
      explanation: "Section 3(k) of Indian Patent Act excludes computer programmes per se; however, technical processes with hardware utility are patentable for 20 years. Copyright protects code text expression."
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
  ],
  "2604PCC551": [
    {
      front: "Okapi BM25 Ranking Formula",
      back: "RSV = sum( IDF_t * [tf*(k1+1)] / [tf + k1*(1 - b + b*(L_d/L_avg))] )\nk1 in [1.2, 2.0] governs term saturation; b = 0.75 controls length penalty."
    },
    {
      front: "Skip Pointer Optimal Interval",
      back: "Interval step = floor(sqrt(L))\nFor posting list of length L, balances number of skips and skip distances, yielding O(sqrt(L)) comparisons."
    },
    {
      front: "Normalized Discounted Cumulative Gain (NDCG)",
      back: "NDCG_p = DCG_p / IDCG_p\nwhere DCG_p = sum_{i=1}^p (2^{rel_i} - 1) / log2(i + 1)\nEvaluates multi-graded relevance with position penalty."
    },
    {
      front: "PageRank Google Transition Matrix",
      back: "G = d * M + (1 - d)/N * E\nwhere d ~ 0.85 is damping factor, guaranteeing Markov chain is irreducible and aperiodic (Perron-Frobenius)."
    }
  ],
  "2604PCC552": [
    {
      front: "Scaled Dot-Product Self-Attention",
      back: "Attention(Q, K, V) = softmax( (Q K^T) / sqrt(d_k) ) V\nDivision by sqrt(d_k) keeps variance ~1 to prevent vanishing softmax gradients."
    },
    {
      front: "CKY Chart Parsing Complexity",
      back: "Time: O(n^3 * |G|)\nSpace: O(n^2 * |G|)\nRequires Context-Free Grammar in Chomsky Normal Form (A -> BC or A -> a)."
    },
    {
      front: "Word2Vec Negative Sampling Loss",
      back: "L = log sigma(v'_wO^T v_wI) + sum_{k=1}^K log sigma(-v'_wk^T v_wI)\nReplaces O(|V|) softmax with K binary logistic regressions."
    },
    {
      front: "Viterbi Algorithm for HMM POS Tagging",
      back: "v_t(j) = max_i [ v_{t-1}(i) * a_{ij} ] * b_j(w_t)\nComputes highest probability tag sequence in O(T * |S|^2) dynamic programming."
    }
  ],
  "2604PCC553": [
    {
      front: "ResNet Skip Connection Gradient",
      back: "y = F(x) + x\ndL/dx = (dL/dy) * (dF/dx + 1)\nThe '+ 1' term ensures gradients propagate uninterrupted even when dF/dx ~ 0."
    },
    {
      front: "Adam Optimizer Moments Update",
      back: "m_t = beta1*m_{t-1} + (1-beta1)*g_t\nv_t = beta2*v_{t-1} + (1-beta2)*g_t^2\ntheta_{t+1} = theta_t - (eta / [sqrt(v_hat) + eps]) * m_hat"
    },
    {
      front: "VAE Reparameterization Trick",
      back: "z = mu(x) + sigma(x) (.) epsilon,  epsilon ~ N(0, I)\nMakes sampling deterministic and differentiable for backpropagation."
    },
    {
      front: "GAN Minimax Objective",
      back: "min_G max_D V(D, G) = E_x[log D(x)] + E_z[log(1 - D(G(z)))]\nZero-sum game between Discriminator D and Generator G."
    }
  ],
  "2604RM601": [
    {
      front: "Type I vs Type II Errors",
      back: "Type I (alpha): Reject H0 when H0 is true (False Positive).\nType II (beta): Fail to reject H0 when H0 is false (False Negative).\nStatistical Power = 1 - beta."
    },
    {
      front: "One-Way ANOVA F-Ratio",
      back: "F = MS_between / MS_within = [SS_between / (k - 1)] / [SS_within / (N - k)]\nTests equality of k >= 3 means without family-wise alpha inflation."
    },
    {
      front: "Chi-Square Goodness-of-Fit",
      back: "chi^2 = sum( (O_i - E_i)^2 / E_i ), df = k - 1\nTests observed categorical distribution against expected theoretical distribution."
    },
    {
      front: "PRISMA Statement 4-Stage Flow",
      back: "1. Identification (database search results)\n2. Screening (title/abstract review & deduplication)\n3. Eligibility (full-text evaluation)\n4. Included (final synthesis studies)"
    }
  ]
};

