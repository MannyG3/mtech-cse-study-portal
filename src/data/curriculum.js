// M.Tech (Computer Engineering) - NEP-2020 Compliant Curriculum (2026 Pattern)
// Ajeenkya DY Patil School of Engineering

export const CURRICULUM_METADATA = {
  institution: "Ajeenkya DY Patil School of Engineering",
  trust: "Dr. D Y Patil Educational Enterprises Charitable Trust's",
  department: "Department of Computer Engineering",
  program: "Master of Technology (M.Tech) in Computer Engineering",
  pattern: "2026 Pattern (NEP-2020 Compliant)",
  effectiveFrom: "Academic Year 2026-27",
  accreditation: "Autonomous Institute Affiliated to SPPU, Approved by AICTE, Accredited by NBA & NAAC 'A' Grade",
};

export const SEMESTERS = [
  {
    id: "sem1",
    name: "Semester I",
    totalCredits: 22,
    totalTeachingHours: 24,
    totalMarks: 600,
    courses: [
      {
        code: "2604PCC501",
        title: "Advanced Algorithms",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Design and Analysis of Algorithms, Data Structures",
        description: "Advanced algorithmic design paradigms, graph algorithms, advanced data structures, linear programming, computational geometry, approximation algorithms, and string matching.",
        courseOutcomes: [
          { id: "CO1", text: "Analysis of various algorithm techniques to solve graph algorithms." },
          { id: "CO2", text: "Perform amortized analysis on Advanced data structures." },
          { id: "CO3", text: "Solve Computational Geometric problems using Linear Programming." },
          { id: "CO4", text: "Apply Approximation algorithm to solve vertex cover, TSP and set covering problem." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Algorithms Analysis Methods",
            hours: 8,
            topics: [
              "Divide and Conquer: Maximum Subarray Problem, Strassen's Matrix Multiplication.",
              "Dynamic Programming: Matrix Chain Multiplication, Longest Common Subsequence (LCS), Optimal Binary Search Trees (OBST), 0/1 Knapsack Problem.",
              "Greedy Algorithms: Activity Selection Problem, Huffman Codes, Task Scheduling Problem."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Graph Algorithms",
            hours: 6,
            topics: [
              "All-Pairs Shortest Paths: Shortest paths and matrix multiplication, The Floyd-Warshall algorithm, Johnson's algorithm for sparse graphs.",
              "Maximum Flow: Flow networks, The Ford-Fulkerson method, Cuts in flow networks, Maximum bipartite matching."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Advanced Data Structure",
            hours: 6,
            topics: [
              "Red-Black Trees: Properties, Rotations, Insertion and Deletion.",
              "Augmenting Data Structures: Order-statistic trees, Interval trees.",
              "Binomial Heaps and Fibonacci Heaps: Structure, mergeable-heap operations, bounding maximum degree.",
              "Disjoint Sets: Disjoint-set operations, linked-list representation, disjoint-set forests, union by rank and path compression.",
              "Amortized Analysis: Aggregate method, Accounting method, Potential method, Dynamic tables."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Linear Programming and Computational Geometry",
            hours: 8,
            topics: [
              "Linear Programming: Standard and Slack forms, formulation of problems as linear programs, Simplex algorithm, Duality, Initial basic feasible solution. Problem formulation for Single-source shortest path and Maximum flow problem.",
              "Geometric Algorithms: Line-segment properties, determining whether any pair of segments intersects.",
              "Convex Hull Problem: Formulation, solving by Graham Scan algorithm, Jarvis March algorithm.",
              "Closest Pair of Points: Problem formulation, solving by Divide & Conquer method."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Approximation Algorithms",
            hours: 6,
            topics: [
              "Introduction to NP-Completeness and Approximation: Performance ratios, Absolute approximation, Epsilon approximation, Polynomial-time approximation schemes (PTAS), Fully polynomial-time approximation schemes (FPTAS).",
              "Probabilistically good algorithms.",
              "Classic Problems: The Vertex Cover problem, Traveling Salesman Problem (metric TSP), Set Covering problem, and Subset Sum problem."
            ]
          },
          {
            unitNo: "Unit VI",
            title: "String Matching",
            hours: 6,
            topics: [
              "Naive String Matching algorithm.",
              "The Rabin-Karp algorithm with rolling hash.",
              "String Matching with Finite Automata.",
              "The Knuth-Morris-Pratt (KMP) Algorithm and prefix function.",
              "The Boyer-Moore Algorithm.",
              "NP-Completeness: Circuit satisfiability, 3-CNF satisfiability, reductions."
            ]
          }
        ],
        textBooks: [
          "Cormen, Leiserson, Rivest, Stein, 'Introduction to Algorithms', 3rd Edition, PHI / MIT Press.",
          "Horowitz and Sahani, 'Fundamentals of Computer Algorithms', 2nd Edition, Universities Press.",
          "M. T. Goodrich et.al, 'Algorithm Design: Foundations, Analysis, and Internet Examples', John Wiley."
        ],
        referenceBooks: [
          "Levitin, 'Introduction to Design and Analysis of Algorithms', Pearson Education.",
          "Sara Baase, Alan Van Gelder, 'Computer Algorithms: Introduction to Design & Analysis', 3rd Edition, Pearson Education.",
          "A. V. Aho & Ullman, 'The Design and Analysis of Algorithms', Pearson Education."
        ]
      },
      {
        code: "2604PCC502",
        title: "Advanced Database Systems",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Database Management System (DBMS), Relational Algebra, SQL",
        description: "Covers parallel and distributed architectures, object databases, big data storage, blockchain consensus in databases, spatial data indexing, text and web mining, and deductive databases.",
        courseOutcomes: [
          { id: "CO1", text: "Model and represent the real world data using advanced database concepts." },
          { id: "CO2", text: "Design the high performance databases for various applications." },
          { id: "CO3", text: "Apply various concepts of text and web mining for meaningful data access." },
          { id: "CO4", text: "Summarize and illustrate recent trends in databases." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Parallel and Distributed Databases",
            hours: 8,
            topics: [
              "Database System Architectures: Centralized and Client-Server Architectures, Server System Architectures, Parallel Systems, Distributed Systems.",
              "Parallel Databases: I/O Parallelism, Inter and Intra Query Parallelism, Inter and Intra Operation Parallelism, Design of Parallel Systems.",
              "Distributed Database Concepts: Distributed Data Storage, Fragmentation & Replication, Distributed Transactions, Commit Protocols (2-Phase Commit, 3-Phase Commit), Concurrency Control, Distributed Query Processing, Case Studies."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Object Based Database",
            hours: 8,
            topics: [
              "Structured data types, operations of structured data, encapsulations and ADTs, Inheritance.",
              "Object OIDs and reference types, database design for an ORDBMS (Object-Relational DBMS).",
              "OODBMS: the ODMG data model, Object Definition Language (ODL), Object Query Language (OQL)."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Big Data, Blockchain Databases",
            hours: 8,
            topics: [
              "Big Data: Big Data Storage System, The MapReduce Paradigm, Beyond MapReduce: Algebraic Operations, Streaming Data, Graph Databases.",
              "Blockchain Databases: Overview, Blockchain Properties, achieving Blockchain properties via cryptographic hash functions, consensus mechanisms (PoW, PoS, PBFT), data management in Blockchain, smart contracts, performance enhancement, emerging applications."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Spatial Data Management",
            hours: 8,
            topics: [
              "Types of spatial data (Raster vs Vector) and spatial queries (range query, nearest neighbor).",
              "Applications involving spatial data (GIS, GPS tracking, urban planning).",
              "Introduction to spatial indexes, indexing based on space filling curves (Z-order, Hilbert curves), grid files.",
              "R-Trees: Point and region data, bounding boxes, R* trees, issues in high-dimensional indexing."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Text and Web Mining",
            hours: 8,
            topics: [
              "Text Mining: Introduction, natural language processing and information extraction, text categorization methods (TF-IDF, Naive Bayes, Cosine Similarity).",
              "Web Mining: Introduction, Web Content Mining, Web Structure Mining (PageRank, HITS), Web Usage Mining, Data Modeling for Web Usage Mining, Mining Web linkage structures, Discovery and Analysis of Web Usage Patterns: Session and Visitor Analysis, Analysis of Sequential and Navigational patterns."
            ]
          },
          {
            unitNo: "Unit VI",
            title: "Deductive Databases and Recent Trends",
            hours: 8,
            topics: [
              "Deductive Databases: Introduction, theoretical foundations, recursive queries with negation, from Datalog to SQL recursive CTEs.",
              "Recent Trends: Multimedia Databases, Main-Memory Databases (IMDB), Mobile Databases, Temporal Databases, Biological Databases."
            ]
          }
        ],
        textBooks: [
          "Henry F Korth, Abraham Silberschatz, S. Sudarshan, 'Database System Concepts', 7th Edition, McGraw Hill.",
          "Raghu Ramakrishnan, Johannes Gehrke, 'Database Management Systems', McGraw Hill.",
          "J. Han, M. Kamber, 'Data Mining: Concepts and Techniques', Morgan Kaufmann."
        ],
        referenceBooks: [
          "R. Elmasri, S. B. Navathe, 'Fundamentals of Database Systems', Pearson Education.",
          "C. J. Date, 'An Introduction to Database Systems', Addison-Wesley."
        ]
      },
      {
        code: "2604PCC503",
        title: "Machine Learning",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Design and Analysis of Algorithms, Machine Learning Basics, Linear Algebra, Probability",
        description: "Comprehensive coverage of Supervised learning, Parametric models, Kernel methods, Unsupervised learning, Convolutional Neural Networks, Recurrent architectures, Optimization, and real-world ML applications.",
        courseOutcomes: [
          { id: "CO1", text: "Apply different feature extraction, classification, regression, algorithms and modeling." },
          { id: "CO2", text: "Evaluate the performance of an algorithm and comparison of different learning techniques." },
          { id: "CO3", text: "Understand unsupervised methods and their applications." },
          { id: "CO4", text: "Optimize the algorithms effectively." },
          { id: "CO5", text: "Apply techniques using different case studies." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Introduction & Supervised Learning Algorithms",
            hours: 12,
            topics: [
              "Introduction: Pattern Representation, Concept of Pattern Recognition, Basics of Probability, Bayes' Decision Theory, Maximum-Likelihood and Bayesian Parameter Estimation, Error Probabilities, Learning of Patterns, Modeling, Regression.",
              "Supervised Learning Algorithms: Linear Regression, K-Nearest Neighbor (KNN), Naïve Bayes, Bayesian Networks, Bayes Classification, Bayesian Decision Theory, Losses and Risks.",
              "Parametric Methods: Gaussian Parameter Estimation, Maximum Likelihood Estimation (MLE), Bias and Variance Tradeoff, Bayes' Estimator, Bayesian Estimation, Parametric Classification, Regression, Hidden Markov Models (HMM), Support Vector Machines (SVM), Decision Trees."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Unsupervised Learning Algorithms",
            hours: 12,
            topics: [
              "Kernel Methods: Basic kernels (Linear, Polynomial, RBF/Gaussian), Types of Kernel, Properties of kernels (Mercer's theorem).",
              "Pattern Analysis using Eigen Decomposition, Principal Component Analysis (PCA) derivation and variance maximization.",
              "Hidden Markov Models (Forward-Backward, Viterbi algorithms).",
              "Markov Decision Processes (MDPs), Bellman equations.",
              "Nonparametric techniques for density estimation: Parzen-window method, k-nearest neighbor density estimation."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Convolutional Neural Networks",
            hours: 12,
            topics: [
              "Convolutional Neural Networks: The convolution operation, feature maps, kernel filters, stride and padding.",
              "Pooling Layers (Max pooling, Average pooling), Fully connected layers.",
              "Convolution and Pooling as an infinitely strong prior.",
              "Variants of the basic functions (dilated convolution, depthwise separable convolution), efficient algorithms.",
              "Random or Unsupervised Features, Neuroscientific Basis for Convolutional Networks, Computer Vision Applications."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Optimization Methods & Recurrent Architectures",
            hours: 12,
            topics: [
              "Recurrent Neural Networks (RNN): Types of RNN, Backpropagation Through Time (BPTT), Exploding and Vanishing Gradient Problems.",
              "Encoder-Decoder Sequence to sequence architecture, Deep Recurrent Networks, Recursive Neural Networks.",
              "Gated RNNs: The Long Short-Term Memory (LSTM) - Forget, Input, Output gates, Gated Recurrent Unit (GRU).",
              "Optimization for Long Term Dependencies, Attention mechanisms overview, NLP applications."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Use Cases and Applications",
            hours: 12,
            topics: [
              "Advanced Machine Learning Techniques: Ensemble Learning Methods (Bagging, Random Forests, Boosting - AdaBoost, Gradient Boosting, XGBoost).",
              "Support Vector Machines (Soft Margin SVM, Kernel Trick, Slack variables).",
              "Dimensionality Reduction Techniques (t-SNE, LDA, Autoencoders), Introduction to Deep Learning.",
              "Industry Case Studies & Applications: Fraud detection in banking, Sentiment analysis in social feeds, Computer vision face recognition, Medical diagnosis case studies."
            ]
          }
        ],
        textBooks: [
          "Peter Flach, 'Machine Learning: The Art and Science of Algorithms that make sense of data', Cambridge University Press, 2012.",
          "Ethem Alpaydin, 'Introduction to Machine Learning', PHI, 2nd Edition, 2013.",
          "Richard O. Duda, Peter E. Hart, David G. Stork, 'Pattern Classification', 2nd Edition, Wiley, 2001.",
          "Christopher M. Bishop, 'Pattern Recognition and Machine Learning', Springer, 2006.",
          "Geoff Dougherty, 'Pattern Recognition and Classification an Introduction', Springer, 2013.",
          "John Shawe-Taylor and Nello Cristianini, 'Kernel Methods for Pattern Analysis', Cambridge University Press, 2004."
        ],
        referenceBooks: [
          "Ian Goodfellow, Yoshua Bengio, Aaron Courville, 'Deep Learning', MIT Press, 2016.",
          "Tom M. Mitchell, 'Machine Learning', McGraw-Hill."
        ]
      },
      {
        code: "2604PCC504",
        title: "Distributed Computing",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Data structures and algorithms, Programming, Discrete Mathematics, Probability",
        description: "Principles, architectures, logical clocks, message ordering, distributed mutual exclusion, deadlock detection, consensus algorithms, checkpointing & recovery, and cloud computing architectures.",
        courseOutcomes: [
          { id: "CO1", text: "Understand the design principles in distributed systems and the architectures for distributed systems." },
          { id: "CO2", text: "Apply various distributed algorithms related to clock synchronization, concurrency control, deadlock detection, load balancing, voting etc." },
          { id: "CO3", text: "Analyse fault tolerance and recovery in distributed systems and algorithms for the same." },
          { id: "CO4", text: "Analyse the design and functioning of existing distributed systems and file systems." },
          { id: "CO5", text: "Implement different distributed algorithms over current distributed platforms." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Introduction & Models of Distributed Computation",
            hours: 12,
            topics: [
              "Introduction: Definition - Relation to Computer System Components, Motivation, Message-Passing Systems versus Shared Memory Systems.",
              "Primitives for Distributed Communication: Synchronous versus Asynchronous Executions, Design Issues and Challenges.",
              "A Model of Distributed Computations: A Distributed Program, A Model of Distributed Executions, Models of Communication Networks (FIFO, Non-FIFO), Global State of a Distributed System, Cuts (Consistent and Inconsistent cuts)."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Logical Time & Group Communication",
            hours: 12,
            topics: [
              "Logical Time: Physical Clock Synchronization (Network Time Protocol - NTP), A Framework for a System of Logical Clocks.",
              "Scalar Time (Lamport's Logical Clocks) and Vector Time (Mattern & Fidge vector clocks).",
              "Message Ordering and Group Communication: Message Ordering Paradigms, Asynchronous Execution with Synchronous Communication, Synchronous Program Order on Asynchronous System, Group Communication, Causal Order, Total Order (Atomic broadcast).",
              "Global State and Snapshot Recording Algorithms: Introduction, System Model and Definitions, Snapshot Algorithms for FIFO Channels (Chandy-Lamport Algorithm)."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Distributed Mutual Exclusion & Deadlock",
            hours: 12,
            topics: [
              "Distributed Mutual Exclusion Algorithms: Introduction and Preliminaries, Non-Token-Based: Lamport's Algorithm, Ricart-Agrawala's Algorithm; Token-Based: Suzuki-Kasami's Broadcast Algorithm.",
              "Deadlock Detection in Distributed Systems: Introduction, System Model, Preliminaries, Models of Deadlocks (Single-resource model, AND model, OR model).",
              "Chandy-Misra-Haas Algorithm for the AND model and OR Model (Edge-chasing algorithm)."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Consensus, Agreement & Recovery",
            hours: 12,
            topics: [
              "Consensus and Agreement Algorithms: Problem Definition, Overview of Results, Agreement in a Failure-Free System (Synchronous and Asynchronous).",
              "Agreement in Synchronous Systems with Failures: Crash failures, Byzantine generals problem, Impossibility of Distributed Consensus in Asynchronous Systems (FLP Theorem).",
              "Checkpointing and Rollback Recovery: Introduction, Background and Definitions, Issues in Failure Recovery, Checkpoint-based Recovery, Domino effect, Coordinated Checkpointing Algorithm, Algorithm for Asynchronous Checkpointing and Recovery, Message logging."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Cloud Computing & Distributed Applications",
            hours: 12,
            topics: [
              "Definition of Cloud Computing, Characteristics of Cloud, Cloud Deployment Models (Public, Private, Hybrid, Community).",
              "Cloud Service Models (IaaS, PaaS, SaaS), Driving Factors and Challenges of Cloud.",
              "Virtualization, Hypervisors, Load Balancing algorithms, Scalability and Elasticity, Replication strategies, Monitoring.",
              "Cloud Services and Platforms: Compute Services (AWS EC2, Google Compute Engine), Storage Services (S3, GCS), Application Services and Serverless computing."
            ]
          }
        ],
        textBooks: [
          "Kshemkalyani Ajay D, Mukesh Singhal, 'Distributed Computing: Principles, Algorithms and Systems', Cambridge Press, 2011.",
          "Mukesh Singhal, Niranjan G Shivaratri, 'Advanced Concepts in Operating Systems', McGraw Hill Publishers, 1994."
        ],
        referenceBooks: [
          "George Coulouris, Jean Dollimore, Tim Kindberg, 'Distributed Systems: Concepts and Design', 5th Edition, Pearson Education, 2012.",
          "Pradeep L Sinha, 'Distributed Operating Systems: Concepts and Design', Prentice Hall of India, 2007.",
          "Tanenbaum A S, Van Steen M, 'Distributed Systems: Principles and Paradigms', Pearson Education, 2007.",
          "Nancy A Lynch, 'Distributed Algorithms', Morgan Kaufmann Publishers, 2003.",
          "Arshdeep Bahga, Vijay Madisetti, 'Cloud Computing: A Hands-On Approach', Universities Press, 2014."
        ]
      },
      {
        code: "2604OE505A",
        title: "Elective-I: Data Engineering",
        type: "PEC",
        typeFullName: "Programme Elective Course - I",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Design and Analysis of Algorithms, Databases",
        description: "Data lifecycle, ingestion, columnar formats (Parquet, ORC), modern data warehouses & lakehouses (Delta Lake, Iceberg), ETL/ELT pipelines, distributed stream processing with Kafka and Spark, and data orchestration.",
        courseOutcomes: [
          { id: "CO1", text: "Explain the core concepts, lifecycle, and goals of data engineering." },
          { id: "CO2", text: "Design data pipelines for data ingestion, storage, and processing." },
          { id: "CO3", text: "Apply data transformation and ETL principles using conceptual tools." },
          { id: "CO4", text: "Evaluate batch vs stream processing architectures and their use cases." },
          { id: "CO5", text: "Analyze challenges of scalability, security, quality, and ethics in data workflows." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Introduction to Data Engineering",
            hours: 8,
            topics: [
              "Introduction to data engineering, role in the AI/ML lifecycle, types of data: Structured, Semi-structured, Unstructured.",
              "Data engineering for data science and ML engineering, data lifecycle: ingestion, storage, processing, analysis.",
              "Data formats: CSV, JSON, Avro, Parquet, ORC, Row-oriented vs Columnar storage advantages.",
              "Overview of data engineering roles, responsibilities, and real-world architectures."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Storage Solutions, Data Lakes & Lakehouses",
            hours: 8,
            topics: [
              "Data sources: Databases, APIs, IoT, Social Media, Logs; Batch and Real-time ingestion patterns.",
              "Storage systems: File systems, HDFS, Object storage (AWS S3, Google Cloud Storage, Azure Blob).",
              "Relational vs NoSQL databases (PostgreSQL, MongoDB, Cassandra).",
              "Data Lakes vs Data Warehouses, Concepts of modern Data Lakehouse: Delta Lake, Apache Iceberg, Apache Hudi ACID guarantees on object storage."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Data Transformation and ETL/ELT",
            hours: 8,
            topics: [
              "ETL vs ELT pipelines: concepts, trade-offs, and use cases.",
              "Data cleansing, enrichment, deduplication, normalization, data validation and quality checks.",
              "Dimensional data modeling: Star schema, Snowflake schema, fact tables and dimension tables, Slowly Changing Dimensions (SCD).",
              "Modern transformation tools: Apache NiFi, Airbyte, dbt (data build tool), Informatica, handling schema evolution."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Distributed Data Processing & Streaming",
            hours: 8,
            topics: [
              "Need for distributed processing, batch processing: Hadoop MapReduce limitations, Apache Spark architecture, RDDs, DataFrames, Spark SQL.",
              "Stream processing: Apache Kafka architecture (producers, consumers, brokers, topics, partitions), Apache Flink, Spark Structured Streaming.",
              "Data partitioning, shuffling, fault tolerance, and parallelism.",
              "AI/ML pipelines: Feature stores, training at scale, real-time ML feature serving."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Data Governance, Orchestration & Applications",
            hours: 8,
            topics: [
              "Data orchestration: Apache Airflow (DAGs, operators, schedulers), Prefect, Dagster.",
              "Metadata management, data lineage, data cataloging.",
              "Data security: Encryption in transit and at rest, Role-Based Access Control (RBAC), data anonymization and GDPR/privacy compliance.",
              "Industry Applications: Real-time fraud detection pipelines, Recommendation systems, IoT analytics."
            ]
          }
        ],
        textBooks: [
          "Joe Reis and Matt Housley, 'Fundamentals of Data Engineering', 1st Edition, O'Reilly, 2022.",
          "Yupo Chan, John R. Talburt, Tery M. Tally, 'Data Engineering: Mining, Information and Intelligence', Springer."
        ],
        referenceBooks: [
          "Martin Kleppmann, 'Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems', O'Reilly, 2017.",
          "Paul Crickard, 'Data Engineering with Python', Packt Publishing, 2020.",
          "Databricks, 'Big Book of Data Engineering', 3rd Edition."
        ]
      },
      {
        code: "2604OE505B",
        title: "Elective-I: Business Intelligence",
        type: "PEC",
        typeFullName: "Programme Elective Course - I",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Linear Algebra, Probability, Database Systems",
        description: "Exploiting information assets, decision support systems, enterprise data warehousing, OLAP cubes, data profiling, information compliance, ETL integration, and data enhancement methodologies.",
        courseOutcomes: [
          { id: "CO1", text: "Critically appraise current theory and practice in Big Data Analytics, Decision Support Systems and Business Intelligence." },
          { id: "CO2", text: "Appraise the role of BI strategy in driving companies' insight." },
          { id: "CO3", text: "Apply data analysis and visualization on sample datasets to provide recommendations." },
          { id: "CO4", text: "Identify and appraise emerging trends and evaluate social/ethical aspects." },
          { id: "CO5", text: "Communicate complex concepts effectively via report writing and presentations." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Business Intelligence and Information Exploitation",
            hours: 8,
            topics: [
              "Why Business Intelligence? The Information Asset, Exploiting Information, Business Intelligence and Program Success.",
              "What is Business Intelligence? Actionable Knowledge, Business Case for BI.",
              "Business Intelligence Process, System Infrastructure, Information Access, Delivery, and Analysis Services, Management Issues."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Business Models & Data Warehousing",
            hours: 8,
            topics: [
              "Business Models and Information Flow: The Business Case, Information Processing and Information Flow.",
              "The Information Flow Model Usage in Practice, Modeling Frameworks Management.",
              "Data Warehouses, Online Analytical Processing (OLAP), and Metadata: The Business Case, Data Models, The Data Warehouse, The Data Mart, OLAP Operations (Roll-up, Drill-down, Slice, Dice, Pivot), Metadata Management Issues."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Data Quality and Information Compliance",
            hours: 8,
            topics: [
              "Business Rules: Business Case, Business Rules Approach, What is a Business Rule? What is a Business Rule System? Sources of Business Rules.",
              "Data Profiling: The Business Case, Data Profiling Activities, Data Model Inference, Attribute Analysis, Relationship Analysis.",
              "Data Quality and Information Compliance: Business Case, Types of Errors, Data Cleansing, Business Rule-Based Information Compliance."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Information Integration & Parallelism",
            hours: 8,
            topics: [
              "Information Integration: The Business Case, ETL (Extract, Transform, Load), Enterprise Application Integration (EAI) and Web Services.",
              "Record Linkage and Entity Consolidation, Management Issues.",
              "The Value of Parallelism: Business Case, Parallelism and Granularity, Parallel Processing Systems, Dependence, Parallelism in BI.",
              "Alternate Information Contexts: Psychographics and Demographics, Geographic Data, Web Behavior Intelligence."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Data Enhancement, Knowledge Discovery and Data Mining",
            hours: 8,
            topics: [
              "Data Enhancement: The Business Case, Types of Data Enhancement, Incremental Enhancements, Batch Enhancements, Standardization Example (Address Standardization), Enhancement Methodologies.",
              "Knowledge Discovery and Data Mining: The Business Case, Data Mining and the Data Warehouse, The Virtuous Cycle, Directed versus Undirected Knowledge Discovery, Six Basic Tasks of Data Mining.",
              "Using Publicly Available Data: Public Data Resources, Semi-Structured Data, Ethical Issues and The Myth of Privacy."
            ]
          }
        ],
        textBooks: [
          "Douglas K. Barry and David Loshin, 'Business Intelligence: The Savvy Manager's Guide', Morgan Kaufmann Publishers, 2003.",
          "Ahmed Sherif, 'Practical Business Intelligence', Packt Publishing Ltd., 2016."
        ],
        referenceBooks: [
          "Sartaj Singh, 'Business Intelligence', Excel Books Private Limited, 2011."
        ]
      },
      {
        code: "2604OE505C",
        title: "Elective-I: Internet of Things",
        type: "PEC",
        typeFullName: "Programme Elective Course - I",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Computer Networks, Microcontrollers / Embedded Systems",
        description: "IoT architecture, sensing & actuation, Wireless Sensor Networks (WSN), communication protocols (MQTT, CoAP, Zigbee), platform design, Python APIs, cloud integration with AWS IoT, and smart city case studies.",
        courseOutcomes: [
          { id: "CO1", text: "Summarize the concepts of network connected embedded devices." },
          { id: "CO2", text: "Design suitable network architecture and use appropriate protocols for a given IoT application." },
          { id: "CO3", text: "Identify and summarize different components required for IoT applications." },
          { id: "CO4", text: "Analyse the system through Data Analytics tools." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Introduction & Basics of IoT",
            hours: 8,
            topics: [
              "Definition, Characteristics, Physical and Logical Designs of IoT.",
              "IoT Enabling Technologies, Challenges, Technological trends in IoT.",
              "IoT Examples, Machine to Machine (M2M) communication versus IoT."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Components, Communication & Networking",
            hours: 8,
            topics: [
              "Introduction to Sensing and Networking: Sensing & Actuation, Transducers.",
              "Wireless Sensor Networks (WSN), Sensor nodes, Hardware architectures.",
              "Communication Protocols: IEEE 802.15.4, ZigBee, 6LoWPAN, Bluetooth Low Energy (BLE), LoRaWAN.",
              "Application Layer Protocols: MQTT, CoAP, AMQP, HTTP REST APIs."
            ]
          },
          {
            unitNo: "Unit III",
            title: "IoT System Management & Design Methodology",
            hours: 8,
            topics: [
              "Network Operator Requirements, IoT Platform Design Specification.",
              "Design steps: Purpose & Requirements, Process Specification, Domain Model, Information Model, Service Specification, IoT Level, Functional View, Operational View, Device & Component Integration, Application Development."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Networking and Computing with Python",
            hours: 8,
            topics: [
              "File Handling, Python Packages for IoT (paho-mqtt, RPi.GPIO, socket).",
              "IoT Physical Servers and Edge Nodes: Raspberry Pi, ESP32, Arduino.",
              "Cloud Storage Models, Communication APIs."
            ]
          },
          {
            unitNo: "Unit V",
            title: "IoT Clouds, Data Analytics and Applications",
            hours: 8,
            topics: [
              "RESTful Web APIs, Amazon Web Services (AWS) IoT Core, Apache Hadoop, Batch Data Analysis.",
              "DevOps tools for IoT: Chef, Puppet, NETCONF-YANG.",
              "Real-world Case Studies: Smart cities, Smart homes, Connected vehicles, Industrial IoT (IIoT 4.0)."
            ]
          }
        ],
        textBooks: [
          "Kamal, R., 'Internet of Things - Architecture and Design Principles', 1st Edition, McGraw Hill, 2017.",
          "Simone Cirani, 'Internet of Things - Architectures, Protocols and Standards', Wiley, 2018.",
          "Alessandro Bassi, 'Enabling Things to Talk - Designing IoT solutions with the IoT Architectural Reference Model', Springer, 2013."
        ],
        referenceBooks: [
          "D. Patranabis, 'Sensors & Transducers', PHI Learning, 2nd Edition, 2009.",
          "Jacob Fraden, 'Handbook of Modern Sensors', 5th Edition, Springer, 2016."
        ]
      },
      {
        code: "2604OE505D",
        title: "Elective-I: Quantum Computing",
        type: "PEC",
        typeFullName: "Programme Elective Course - I",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        prerequisite: "Linear Algebra, Complex Numbers, Probability, Fundamentals of Computing",
        description: "Physics of computation, Qubits, Bloch sphere, quantum logic gates, Deutsch-Jozsa, Grover and Shor algorithms, Qiskit programming, quantum key exchange (BB84, EPR), and quantum hardware implementations.",
        courseOutcomes: [
          { id: "CO1", text: "Explain how the physics of quantum computation is different from classical computational models." },
          { id: "CO2", text: "Describe theoretical performance improvements quantum algorithms offer compared to classical algorithms." },
          { id: "CO3", text: "Analyze the life cycle of hybrid applications and decompose execution on a hybrid quantum-classical continuum." },
          { id: "CO4", text: "Develop hybrid quantum algorithms and implement them using quantum toolkits such as Qiskit." }
        ],
        units: [
          {
            unitNo: "Unit I",
            title: "Introduction and The Leap from Classical to Quantum",
            hours: 12,
            topics: [
              "Introduction: Classical bits (Cbits) and Quantum bits (Qubits), Superposition, Bloch Sphere representation.",
              "Reversible computation: Landauer's principle, Toffoli and Fredkin gates.",
              "Circuit diagrams, Measurement gates, State preparation, Constructing arbitrary 1-qubit and 2-qubit states.",
              "The Leap from Classical to Quantum: Deterministic systems, Probabilistic systems, Quantum systems, Tensor products of states."
            ]
          },
          {
            unitNo: "Unit II",
            title: "Basic Quantum Theory & Architecture",
            hours: 12,
            topics: [
              "Basic Quantum Theory: Quantum states, Hilbert space, Observables, Hermitian operators, Measuring, Dynamics (Schrödinger equation).",
              "Assembling Quantum Systems, Entanglement, Bell states (EPR pairs), No-cloning theorem.",
              "Quantum Gate Architecture: Pauli-X, Y, Z gates, Hadamard gate (H), Phase shift (S, T), CNOT gate, SWAP gate, Universal quantum gate sets."
            ]
          },
          {
            unitNo: "Unit III",
            title: "Algorithms & Programming Languages",
            hours: 12,
            topics: [
              "Quantum Algorithms: Deutsch's Algorithm, The Deutsch-Jozsa Algorithm (constant vs balanced function test in 1 query).",
              "Simon's Periodicity Algorithm.",
              "Grover's Search Algorithm (quadratic speedup, amplitude amplification).",
              "Shor's Factoring Algorithm (Quantum Fourier Transform - QFT, order finding, breaking RSA).",
              "Quantum Programming Languages: Programming in a Quantum World, Qiskit framework, OpenQASM, Quantum assembly, Hybrid quantum-classical execution (VQE, QAOA)."
            ]
          },
          {
            unitNo: "Unit IV",
            title: "Theoretical Computer Science and Cryptography",
            hours: 12,
            topics: [
              "Theoretical Computer Science: Deterministic, Nondeterministic, Probabilistic (BPP), and Bounded-Error Quantum Polynomial-time (BQP) complexity classes.",
              "Quantum Cryptography: Classical vs Quantum Cryptography, Quantum Key Distribution (QKD): The BB84 Protocol, The B92 Protocol, The EPR Protocol (E91), Quantum Teleportation protocol."
            ]
          },
          {
            unitNo: "Unit V",
            title: "Information Theory & Quantum Hardware",
            hours: 12,
            topics: [
              "Information Theory: Classical Information and Shannon Entropy, Quantum Information and von Neumann Entropy, Classical and Quantum Data Compression, Quantum Error-Correcting Codes (Shor 9-qubit code, Steane code).",
              "Hardware Realizations: Goals and Challenges (DiVincenzo criteria), Ion Traps, Linear Optics, Superconducting circuits (Transmon qubits), NMR, Future of Quantum Ware and Fault-Tolerant Quantum Computing."
            ]
          }
        ],
        textBooks: [
          "Eleanor Rieffel and Wolfgang Polak, 'Quantum Computing: A Gentle Introduction', The MIT Press, 2011.",
          "Michael A. Nielsen and Isaac L. Chuang, 'Quantum Computation and Quantum Information', Cambridge University Press.",
          "Scott Aaronson, 'Quantum Computing Since Democritus', Cambridge University Press, 2013."
        ],
        referenceBooks: [
          "N. David Mermin, 'Quantum Computer Science: An Introduction', Cambridge University Press, 2007.",
          "Noson S. Yanofsky and Mirco A. Mannucci, 'Quantum Computing for Computer Scientists', Cambridge University Press, 2008.",
          "IBM Quantum Computing - Qiskit Documentation (ibm.com/quantum/qiskit)."
        ]
      },
      {
        code: "2604PCC526",
        title: "Lab Practice - I",
        type: "PCC_LAB",
        typeFullName: "Programme Core Course - Practical",
        credits: 1,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 4, total: 4 },
        examScheme: { termWork: 25, oral: 25, total: 50 },
        prerequisite: "Advanced Algorithms, Advanced Database System, Machine Learning, Distributed Computing",
        description: "Practical implementations across all 4 Semester-I core subjects. Hands-on coding in C++, Python, SQL, and MongoDB with real-world case studies.",
        courseOutcomes: [
          { id: "CO1", text: "Apply matrices, Vectors for solving Linear systems." },
          { id: "CO2", text: "Analyze Eigenvalues and Eigenvectors problems." },
          { id: "CO3", text: "Explore databases for database-driven applications and transaction management." },
          { id: "CO4", text: "Solve examples using Inner product and dot product." },
          { id: "CO5", text: "Demonstrate various PDFs with a suitable example." },
          { id: "CO6", text: "Create Contingency Tables using Statistics." }
        ],
        parts: [
          {
            part: "Part A",
            subject: "Advanced Algorithms (Any TWO)",
            assignments: [
              {
                id: "ALGO_1",
                title: "0/1 Knapsack Problem (Dynamic Programming)",
                description: "Given values val[0...n-1] and weights wt[0...n-1] with knapsack capacity W, find maximum value subset without breaking items (0-1 property)."
              },
              {
                id: "ALGO_2",
                title: "Train Platform Allocation (Greedy Scheduling)",
                description: "Given arrival and departure times of trains, find minimum number of railway platforms needed at the station to prevent any delay."
              },
              {
                id: "ALGO_3",
                title: "Optimal Binary Search Tree (OBST)",
                description: "Construct an Optimal Binary Search Tree using Dynamic Programming given key access probabilities."
              },
              {
                id: "ALGO_4",
                title: "Red-Black Tree Construction",
                description: "Construct a Red-Black Tree by inserting sequence of values, demonstrating color flips, and Left/Right rotations."
              }
            ]
          },
          {
            part: "Part B",
            subject: "Advanced Database Systems (Any TWO)",
            assignments: [
              {
                id: "ADBMS_1",
                title: "DDL Schema & Comprehensive Constraints",
                description: "Create relational schema using DDL with Not Null, Check, Unique, Primary Key, and Foreign Key constraints at column and table level."
              },
              {
                id: "ADBMS_2",
                title: "Complex SQL Joins",
                description: "Execution and optimization of SQL Joins: Equi-join, Self-join, Non-equi join, Left/Right/Full Outer joins on normalized databases."
              },
              {
                id: "ADBMS_3",
                title: "Single Row & Aggregate SQL Functions",
                description: "Character, numeric, date, and group functions with GROUP BY, HAVING, and ORDER BY clauses."
              },
              {
                id: "ADBMS_4",
                title: "MongoDB Document Store CRUD Operations",
                description: "Implement a NoSQL document database using MongoDB with create, read, update, delete operations and aggregation pipelines."
              }
            ]
          },
          {
            part: "Part C",
            subject: "Machine Learning",
            assignments: [
              {
                id: "ML_1",
                title: "Multiclass SVM Topic Classification",
                description: "Implement a multiclass classification model using Support Vector Machines in Python (Scikit-Learn) for news articles (e.g. 20 Newsgroups dataset)."
              },
              {
                id: "ML_2",
                title: "CNN AI Face Recognition Entry Agent",
                description: "Real-world AI entry security agent using Convolutional Neural Networks (CNN) to detect and recognize authorized faces in real-time."
              }
            ]
          },
          {
            part: "Part D",
            subject: "Distributed Computing",
            assignments: [
              {
                id: "DC_1",
                title: "Coordination Problem over Unreliable Channel",
                description: "Devise and simulate a protocol between processes A & B communicating over a lossy bidirectional channel (Two Generals / Agreement protocol)."
              },
              {
                id: "DC_2",
                title: "Distributed Leader Election Problem",
                description: "Set of processes P1...Pn with unique identifiers uid(i) electing a leader using reliable broadcast (Bully or Ring Election algorithm)."
              }
            ]
          }
        ]
      },
      {
        code: "2604VSEC506",
        title: "Introduction to Constitution of India",
        type: "VSEC",
        typeFullName: "Vocational & Skill Enhancement Course",
        credits: 1,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 0, total: 0 },
        examScheme: { audit: true, grade: "Satisfactory / Non-Satisfactory" },
        prerequisite: "None",
        description: "Study of Constitutional history, Preamble, Fundamental Rights, Directive Principles of State Policy, Union & State Executive, Judiciary, and Emergency provisions.",
        courseOutcomes: [
          { id: "CO1", text: "Understand historical background and philosophy of the Constitution of India." },
          { id: "CO2", text: "Identify Fundamental Rights and Duties of an Indian citizen." },
          { id: "CO3", text: "Analyze the governance structure of Union and State legislative bodies." }
        ],
        units: [
          {
            unitNo: "Module 1",
            title: "Constitutional Framework & Philosophy",
            hours: 4,
            topics: [
              "Historical perspective of the Constitution of India, Drafting Committee, Constituent Assembly.",
              "Philosophy of the Constitution: Preamble, Sovereign, Socialist, Secular, Democratic, Republic, Justice, Liberty, Equality, Fraternity.",
              "Salient features of the Indian Constitution."
            ]
          },
          {
            unitNo: "Module 2",
            title: "Fundamental Rights, Duties & Directive Principles",
            hours: 4,
            topics: [
              "Fundamental Rights (Articles 12-35): Right to Equality, Right to Freedom, Right against Exploitation, Right to Freedom of Religion, Cultural & Educational Rights, Constitutional Remedies (Writs: Habeas Corpus, Mandamus, etc.).",
              "Directive Principles of State Policy (DPSP, Articles 36-51).",
              "Fundamental Duties (Article 51A)."
            ]
          },
          {
            unitNo: "Module 3",
            title: "Structure of Government & Judiciary",
            hours: 4,
            topics: [
              "Union Executive: President, Prime Minister, Council of Ministers.",
              "Parliament: Lok Sabha, Rajya Sabha, Law-making procedure.",
              "Judiciary: Supreme Court of India, High Courts, Judicial Review and Public Interest Litigation (PIL).",
              "Emergency Provisions (Articles 352, 356, 360) and Constitutional Amendments (Article 368)."
            ]
          }
        ]
      }
    ]
  },
  {
    id: "sem2",
    name: "Semester II",
    totalCredits: 22,
    totalTeachingHours: 26,
    totalMarks: 600,
    courses: [
      {
        code: "2604PCC551",
        title: "Information Retrieval",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        description: "Boolean retrieval, inverted index, vector space model, TF-IDF, evaluation metrics (MAP, NDCG), probabilistic IR, link analysis (PageRank), and neural IR."
      },
      {
        code: "2604PCC552",
        title: "Natural Language Processing",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        description: "Morphological analysis, POS tagging, CFG parsing, word embeddings (Word2Vec, GloVe), Transformers, BERT, GPT models, and language generation."
      },
      {
        code: "2604PCC553",
        title: "Deep Learning",
        type: "PCC",
        typeFullName: "Programme Core Course",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        description: "Deep Feedforward Networks, Regularization, Optimization algorithms (Adam, RMSProp), Autoencoders, GANs, Diffusion Models, and Vision Transformers."
      },
      {
        code: "2604PCC576",
        title: "Lab Practice - II",
        type: "PCC_LAB",
        typeFullName: "Programme Core Course - Practical",
        credits: 2,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 4, total: 4 },
        examScheme: { termWork: 25, oral: 25, total: 50 },
        description: "Hands-on implementations in Information Retrieval, NLP transformer pipelines, and Deep Learning vision/generative models."
      },
      {
        code: "2604PEC554A-D",
        title: "Elective-II: Cloud/Edge / GenAI / Game Theory / Bio Inspired",
        type: "PEC",
        typeFullName: "Programme Elective Course - II",
        credits: 3,
        teachingScheme: { lectures: 3, tutorial: 0, practical: 0, total: 3 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        description: "Choice of: A) Cloud and Edge Technology, B) Generative Artificial Intelligence, C) Game Theory and Applications, D) Bio Inspired Computing."
      },
      {
        code: "2604PEC555A-D",
        title: "Elective-III: RTOS / Federated Learning / SNA / NGN",
        type: "PEC",
        typeFullName: "Major Elective Course - III",
        credits: 3,
        teachingScheme: { lectures: 3, tutorial: 0, practical: 0, total: 3 },
        examScheme: { tae: 20, cae: 20, ese: 60, total: 100 },
        description: "Choice of: A) Real-time Operating System, B) Federated Learning, C) Social Network Analytics, D) Next Generation Networks."
      },
      {
        code: "2604ELCSI556",
        title: "Seminar-I",
        type: "ELC_SI",
        typeFullName: "Experiential Learning Course - Seminar",
        credits: 1,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 4, total: 4 },
        examScheme: { termWork: 25, oral: 25, total: 50 },
        description: "Literature survey, state-of-the-art topic investigation, technical presentation and report writing."
      },
      {
        code: "2604VSEC557",
        title: "Skill Courses: Cyber Security",
        type: "VSEC",
        typeFullName: "Skill Course",
        credits: 1,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 0, total: 0 },
        examScheme: { audit: true, grade: "Satisfactory / Non-Satisfactory" },
        description: "Applied cryptography, threat modeling, network security, web penetration testing, and ethical hacking fundamentals."
      }
    ]
  },
  {
    id: "sem3",
    name: "Semester III",
    totalCredits: 22,
    totalTeachingHours: 36,
    totalMarks: 250,
    courses: [
      {
        code: "2604RM601",
        title: "Research Methodology",
        type: "RM",
        typeFullName: "Research Methodology",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { cae: 40, ese: 60, total: 100 },
        description: "Research design, formulation of research hypotheses, data collection, statistical hypothesis testing (t-test, ANOVA, Chi-square), research ethics, and paper publishing."
      },
      {
        code: "2604ELCSI602",
        title: "Industry Internship",
        type: "ELC_SI",
        typeFullName: "Experiential Learning - Internship",
        credits: 5,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 10, total: 10 },
        examScheme: { termWork: 50, oral: 50, total: 100 },
        description: "Immersion in leading IT/R&D industry solving real-world production engineering problems."
      },
      {
        code: "2604ELCSI603",
        title: "Seminar-II",
        type: "ELC_SI",
        typeFullName: "Experiential Learning - Seminar",
        credits: 4,
        teachingScheme: { lectures: 4, tutorial: 0, practical: 0, total: 4 },
        examScheme: { termWork: 25, oral: 25, total: 50 },
        description: "Deep research seminar on dissertation topic with extensive bibliography and problem definition."
      },
      {
        code: "2604ELCPR604",
        title: "Research Project Stage - I",
        type: "ELC_PR",
        typeFullName: "Experiential Learning - Project Stage I",
        credits: 9,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 18, total: 18 },
        examScheme: { termWork: 25, oral: 25, total: 50 },
        description: "Problem formulation, system architecture design, baseline experimental benchmarking, and preliminary defense."
      }
    ]
  },
  {
    id: "sem4",
    name: "Semester IV",
    totalCredits: 22,
    totalTeachingHours: 44,
    totalMarks: 300,
    courses: [
      {
        code: "2604ELC SI 651",
        title: "Seminar-III",
        type: "ELC_SI",
        typeFullName: "Experiential Learning - Seminar III",
        credits: 4,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 8, total: 8 },
        examScheme: { termWork: 50, oral: 50, total: 100 },
        description: "Progress evaluation seminar, research paper peer-review results, and patent/publication status."
      },
      {
        code: "2604ELC PR 652",
        title: "Research Project Stage - II (Dissertation)",
        type: "ELC_PR",
        typeFullName: "Experiential Learning - Project Stage II",
        credits: 18,
        teachingScheme: { lectures: 0, tutorial: 0, practical: 36, total: 36 },
        examScheme: { termWork: 150, oral: 50, total: 200 },
        description: "Full dissertation implementation, rigorous empirical evaluation, comparative baseline analysis, thesis submission, and external viva defense."
      }
    ]
  }
];
