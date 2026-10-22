// Lab Practice - I (Course Code: 2604PCC526) Complete Implementations & Playground

export const LAB_ASSIGNMENTS = [
  {
    id: "ALGO_1",
    subject: "Advanced Algorithms",
    part: "Part A",
    title: "0/1 Knapsack Problem using Dynamic Programming",
    problemStatement: "Given two integer arrays val[0...n-1] and wt[0...n-1] which represent values and weights associated with n items respectively, and an integer W representing knapsack capacity, find the maximum value subset of val[] such that sum of weights <= W. Items cannot be broken (0-1 property).",
    timeComplexity: "O(n * W)",
    spaceComplexity: "O(n * W)",
    pythonCode: `def knapsack_01(values, weights, W):
    """
    0/1 Knapsack Problem using Dynamic Programming (Bottom-Up Table)
    Returns: (max_value, selected_items_indices, dp_table)
    """
    n = len(values)
    dp = [[0 for _ in range(W + 1)] for _ in range(n + 1)]

    # Build table dp[][] in bottom-up manner
    for i in range(1, n + 1):
        v = values[i - 1]
        w = weights[i - 1]
        for c in range(1, W + 1):
            if w <= c:
                dp[i][c] = max(dp[i - 1][c], v + dp[i - 1][c - w])
            else:
                dp[i][c] = dp[i - 1][c]

    # Backtrack to identify selected items
    selected = []
    res = dp[n][W]
    c = W
    for i in range(n, 0, -1):
        if res <= 0:
            break
        # If value comes from top, item i was not included
        if res != dp[i - 1][c]:
            selected.append(i - 1)
            res -= values[i - 1]
            c -= weights[i - 1]

    selected.reverse()
    return dp[n][W], selected, dp

# Driver Test
if __name__ == "__main__":
    val = [60, 100, 120]
    wt = [10, 20, 30]
    capacity = 50
    max_val, items, _ = knapsack_01(val, wt, capacity)
    print(f"Maximum Profit: \${max_val}")
    print(f"Selected Item Indices: {items}")
    # Output: Maximum Profit: 220 (Items 1 and 2: weights 20+30=50, values 100+120=220)`,
    interactiveType: "knapsack"
  },
  {
    id: "ALGO_2",
    subject: "Advanced Algorithms",
    part: "Part A",
    title: "Train Platform Allocation (Minimum Railway Platforms)",
    problemStatement: "Given a schedule containing arrival and departure time of trains in a station, find minimum number of platforms needed at the station so to avoid any delay in arrival of any train.",
    timeComplexity: "O(n log n)",
    spaceComplexity: "O(1)",
    pythonCode: `def find_min_platforms(arrival, departure):
    """
    Greedy approach: Sort arrival and departure times separately.
    Increment platform count on arrival, decrement on departure.
    """
    arrival.sort()
    departure.sort()

    n = len(arrival)
    platforms_needed = 0
    max_platforms = 0

    i = 0  # pointer for arrival
    j = 0  # pointer for departure

    timeline_events = []

    while i < n and j < n:
        if arrival[i] <= departure[j]:
            platforms_needed += 1
            timeline_events.append((arrival[i], "ARRIVE", platforms_needed))
            if platforms_needed > max_platforms:
                max_platforms = platforms_needed
            i += 1
        else:
            platforms_needed -= 1
            timeline_events.append((departure[j], "DEPART", platforms_needed))
            j += 1

    return max_platforms, timeline_events

# Driver Test
if __name__ == "__main__":
    arr = ["09:00", "09:40", "09:50", "11:00", "15:00", "18:00"]
    dep = ["09:10", "12:00", "11:20", "11:30", "19:00", "20:00"]
    min_plat, _ = find_min_platforms(arr, dep)
    print(f"Minimum Platforms Required: {min_plat}")
    # Output: 3 platforms`,
    interactiveType: "platforms"
  },
  {
    id: "ALGO_3",
    subject: "Advanced Algorithms",
    part: "Part A",
    title: "Optimal Binary Search Tree (OBST)",
    problemStatement: "Implement Optimal Binary Search Tree using Dynamic Programming approach given keys and their search probabilities.",
    timeComplexity: "O(n^3)",
    spaceComplexity: "O(n^2)",
    pythonCode: `def optimal_bst(keys, p, q, n):
    """
    keys: sorted array of n keys
    p: probabilities of searching keys [1..n]
    q: probabilities of searching dummy keys [0..n]
    """
    e = [[0 for _ in range(n + 2)] for _ in range(n + 2)]
    w = [[0 for _ in range(n + 2)] for _ in range(n + 2)]
    root = [[0 for _ in range(n + 1)] for _ in range(n + 1)]

    for i in range(1, n + 2):
        e[i][i - 1] = q[i - 1]
        w[i][i - 1] = q[i - 1]

    for l in range(1, n + 1):  # l is length of sub-tree
        for i in range(1, n - l + 2):
            j = i + l - 1
            e[i][j] = float('inf')
            w[i][j] = w[i][j - 1] + p[j - 1] + q[j]
            for r in range(i, j + 1):
                t = e[i][r - 1] + e[r + 1][j] + w[i][j]
                if t < e[i][j]:
                    e[i][j] = t
                    root[i][j] = r

    return e[1][n], root`,
    interactiveType: "obst"
  },
  {
    id: "ALGO_4",
    subject: "Advanced Algorithms",
    part: "Part A",
    title: "Red-Black Tree Insertion & Rotations",
    problemStatement: "Construct a Red-Black Tree by inserting sequence of values, demonstrating self-balancing properties, recoloring, and Left/Right rotations.",
    timeComplexity: "O(log n) for search, insert, and delete",
    spaceComplexity: "O(n)",
    pythonCode: `class Node:
    def __init__(self, data, color="RED"):
        self.data = data
        self.color = color  # "RED" or "BLACK"
        self.left = None
        self.right = None
        self.parent = None

class RedBlackTree:
    def __init__(self):
        self.TNULL = Node(0, color="BLACK")
        self.root = self.TNULL

    def left_rotate(self, x):
        y = x.right
        x.right = y.left
        if y.left != self.TNULL:
            y.left.parent = x
        y.parent = x.parent
        if x.parent == None:
            self.root = y
        elif x == x.parent.left:
            x.parent.left = y
        else:
            x.parent.right = y
        y.left = x
        x.parent = y

    def right_rotate(self, x):
        y = x.left
        x.left = y.right
        if y.right != self.TNULL:
            y.right.parent = x
        y.parent = x.parent
        if x.parent == None:
            self.root = y
        elif x == x.parent.right:
            x.parent.right = y
        else:
            x.parent.left = y
        y.right = x
        x.parent = y`,
    interactiveType: "rbtree"
  },
  {
    id: "ADBMS_1",
    subject: "Advanced Database Systems",
    part: "Part B",
    title: "DDL Schema with Multi-Level Constraints",
    problemStatement: "Create schema using Commands in DDL. Apply Not Null constraint, Check constraint, Unique key constraint, Primary Key Constraint, Foreign key constraint at Column level and Table level.",
    timeComplexity: "Schema Definition (DDL)",
    spaceComplexity: "Relational Tables",
    pythonCode: `-- ========================================================
-- ADVANCED DATABASE SYSTEMS LAB: DDL & CONSTRAINTS
-- Schema: University Department & Course Allocation System
-- ========================================================

-- Drop tables if already exist (order respects FK constraints)
DROP TABLE IF EXISTS student_enrollments;
DROP TABLE IF EXISTS courses;
DROP TABLE IF EXISTS faculty;
DROP TABLE IF EXISTS departments;

-- 1. Departments Table with Column & Table Level Constraints
CREATE TABLE departments (
    dept_id VARCHAR(10),
    dept_name VARCHAR(100) NOT NULL,
    building_location VARCHAR(50) NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 100000.00,
    -- Column level NOT NULL applied above
    -- Table level PRIMARY KEY and CHECK constraints:
    CONSTRAINT pk_departments PRIMARY KEY (dept_id),
    CONSTRAINT chk_dept_budget CHECK (budget >= 50000.00),
    CONSTRAINT uq_dept_name UNIQUE (dept_name)
);

-- 2. Faculty Table with Foreign Key & Check Constraints
CREATE TABLE faculty (
    faculty_id INT GENERATED ALWAYS AS IDENTITY,
    emp_code VARCHAR(20) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone_number VARCHAR(15),
    salary NUMERIC(10, 2) NOT NULL,
    dept_id VARCHAR(10) NOT NULL,
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    
    -- Table-level constraints
    CONSTRAINT pk_faculty PRIMARY KEY (faculty_id),
    CONSTRAINT uq_faculty_emp_code UNIQUE (emp_code),
    CONSTRAINT uq_faculty_email UNIQUE (email),
    CONSTRAINT chk_faculty_salary CHECK (salary >= 30000.00),
    CONSTRAINT fk_faculty_department FOREIGN KEY (dept_id) 
        REFERENCES departments(dept_id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- 3. Courses Table
CREATE TABLE courses (
    course_code VARCHAR(15) PRIMARY KEY, -- Column level PK
    course_title VARCHAR(150) NOT NULL,
    credits INT NOT NULL CHECK (credits BETWEEN 1 AND 5), -- Column level Check
    dept_id VARCHAR(10) NOT NULL REFERENCES departments(dept_id), -- Column level FK
    coordinator_id INT REFERENCES faculty(faculty_id)
);

-- 4. Modifying Constraints via ALTER TABLE
ALTER TABLE faculty ADD CONSTRAINT chk_email_format 
    CHECK (email LIKE '%@%._%');

-- Verify Schema
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';`,
    interactiveType: "sql_ddl"
  },
  {
    id: "ADBMS_2",
    subject: "Advanced Database Systems",
    part: "Part B",
    title: "SQL Joins (Equi, Self, Non-Equi, Outer)",
    problemStatement: "Execution of joins: Equi join, Self join, Non equi-join, Outer join in SQL with analytical explanations.",
    timeComplexity: "O(M + N) with Hash Join",
    spaceComplexity: "Relational Queries",
    pythonCode: `-- ========================================================
-- ADVANCED DATABASE SYSTEMS LAB: SQL JOINS
-- ========================================================

-- 1. EQUI JOIN (Inner Join on equality)
SELECT c.course_code, c.course_title, d.dept_name, f.full_name AS coordinator
FROM courses c
JOIN departments d ON c.dept_id = d.dept_id
JOIN faculty f ON c.coordinator_id = f.faculty_id;

-- 2. SELF JOIN (Faculty and their Research Mentors)
SELECT 
    f.full_name AS faculty_member,
    m.full_name AS mentor_name,
    f.salary AS faculty_salary
FROM faculty f
LEFT JOIN faculty m ON f.mentor_id = m.faculty_id;

-- 3. NON-EQUI JOIN (Matching Salary with Pay Bands)
-- Given table: salary_bands (grade CHAR, min_sal NUMERIC, max_sal NUMERIC)
SELECT 
    f.full_name,
    f.salary,
    sb.grade AS salary_grade
FROM faculty f
JOIN salary_bands sb 
    ON f.salary >= sb.min_sal AND f.salary <= sb.max_sal;

-- 4. FULL OUTER JOIN (All courses and all faculty, including unassigned)
SELECT 
    c.course_code, 
    c.course_title, 
    f.full_name AS faculty_assigned
FROM courses c
FULL OUTER JOIN faculty f ON c.coordinator_id = f.faculty_id;`,
    interactiveType: "sql_joins"
  },
  {
    id: "ADBMS_4",
    subject: "Advanced Database Systems",
    part: "Part B",
    title: "MongoDB Document CRUD & Aggregation Pipeline",
    problemStatement: "Implement database with suitable example using MongoDB: implement CRUD operations and aggregation pipeline.",
    timeComplexity: "O(1) to O(log N) indexed queries",
    spaceComplexity: "BSON Documents",
    pythonCode: `from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB Local / Atlas
client = MongoClient("mongodb://localhost:27017/")
db = client["mtech_academics"]
courses_col = db["courses"]

# 1. CREATE: Insert Single & Multiple Documents
def insert_sample_data():
    sample_courses = [
        {
            "code": "2604PCC501",
            "title": "Advanced Algorithms",
            "credits": 4,
            "category": "Core",
            "enrolled_students": 45,
            "tags": ["algorithms", "graphs", "geometry"],
            "created_at": datetime.utcnow()
        },
        {
            "code": "2604PCC503",
            "title": "Machine Learning",
            "credits": 4,
            "category": "Core",
            "enrolled_students": 60,
            "tags": ["AI", "neural_networks", "statistics"],
            "created_at": datetime.utcnow()
        }
    ]
    res = courses_col.insert_many(sample_courses)
    print(f"Inserted IDs: {res.inserted_ids}")

# 2. READ: Query with projection and filtering
def read_courses():
    query = {"credits": {"$gte": 4}}
    projection = {"_id": 0, "code": 1, "title": 1, "enrolled_students": 1}
    for doc in courses_col.find(query, projection):
        print(doc)

# 3. UPDATE: Increase enrollment & add tags
def update_course(code):
    courses_col.update_one(
        {"code": code},
        {
            "$inc": {"enrolled_students": 5},
            "$addToSet": {"tags": "deep_learning"}
        }
    )

# 4. DELETE
def delete_course(code):
    courses_col.delete_one({"code": code})

# 5. AGGREGATION PIPELINE: Group by category and compute stats
def aggregate_stats():
    pipeline = [
        {"$match": {"credits": {"$gte": 3}}},
        {"$group": {
            "_id": "$category",
            "total_courses": {"$sum": 1},
            "avg_enrollment": {"$avg": "$enrolled_students"},
            "total_students": {"$sum": "$enrolled_students"}
        }},
        {"$sort": {"total_students": -1}}
    ]
    for result in courses_col.aggregate(pipeline):
        print(result)`,
    interactiveType: "mongodb"
  },
  {
    id: "ML_1",
    subject: "Machine Learning",
    part: "Part C",
    title: "Multiclass Topic Classification using SVM",
    problemStatement: "Implement a classification model using Support Vector Machine algorithm for news article topic classification (science, technology, politics, sports). Use sklearn dataset.",
    timeComplexity: "O(n_samples^2 * n_features)",
    spaceComplexity: "O(n_samples * n_features)",
    pythonCode: `import numpy as np
from sklearn.datasets import fetch_20newsgroups
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix

# 1. Select specific categories for demonstration
categories = [
    'comp.graphics',       # Technology
    'sci.med',             # Science / Medical
    'rec.sport.baseball',  # Sports
    'talk.politics.guns'   # Politics
]

print("Loading 20 Newsgroups dataset...")
train_data = fetch_20newsgroups(subset='train', categories=categories, shuffle=True, random_state=42)
test_data = fetch_20newsgroups(subset='test', categories=categories, shuffle=True, random_state=42)

# 2. Build Pipeline: TF-IDF Vectorizer + Multiclass Linear SVM (One-vs-Rest)
model = Pipeline([
    ('tfidf', TfidfVectorizer(stop_words='english', max_features=5000, ngram_range=(1, 2))),
    ('svm', SVC(kernel='linear', C=1.0, probability=True, random_state=42))
])

# 3. Train Model
print("Training Support Vector Classifier...")
model.fit(train_data.data, train_data.target)

# 4. Evaluate
preds = model.predict(test_data.data)
print("\\n--- Classification Report ---")
print(classification_report(test_data.target, preds, target_names=categories))

# 5. Test Sample News Snippet
test_sample = ["NASA's James Webb telescope captures stunning new infrared images of distant galaxy cluster."]
pred_idx = model.predict(test_sample)[0]
probs = model.predict_proba(test_sample)[0]
print(f"Sample: '{test_sample[0]}'")
print(f"Predicted Category: {categories[pred_idx]} (Confidence: {probs[pred_idx]:.2%})")`,
    interactiveType: "svm"
  },
  {
    id: "ML_2",
    subject: "Machine Learning",
    part: "Part C",
    title: "AI Face Recognition Entry Agent using CNN",
    problemStatement: "Implement a real-world application like AI Face Recognition Entry Agent using CNN. It detects and recognizes faces in real-time environment, granting or denying entry based on known faces in pre-trained databases.",
    timeComplexity: "O(Layers * Ops) ~ Real-time 30 FPS",
    spaceComplexity: "Model Weights (~25MB)",
    pythonCode: `import cv2
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers, models

def build_face_embedding_cnn(input_shape=(112, 112, 3), embedding_dim=128):
    """
    CNN Architecture for Facial Feature Embedding (Siamese / Cosine Similarity Backbone)
    """
    model = models.Sequential([
        # Block 1
        layers.Conv2D(32, (3, 3), padding='same', activation='relu', input_shape=input_shape),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),

        # Block 2
        layers.Conv2D(64, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),

        # Block 3
        layers.Conv2D(128, (3, 3), padding='same', activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),

        # Flatten & Dense Embedding
        layers.Flatten(),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.4),
        layers.Dense(embedding_dim, activation=None), # L2 Normalization Layer
        layers.Lambda(lambda x: tf.math.l2_normalize(x, axis=1))
    ])
    return model

class FaceRecognitionEntryAgent:
    def __init__(self, authorized_database, threshold=0.65):
        self.embedding_model = build_face_embedding_cnn()
        self.authorized_db = authorized_database  # dict: {name: 128-d vector}
        self.threshold = threshold

    def verify_face(self, face_image):
        """
        Extracts face embedding and computes cosine distance with authorized DB
        Returns: (status: 'ACCESS GRANTED' / 'ACCESS DENIED', name, distance)
        """
        # Preprocess image
        face_resized = cv2.resize(face_image, (112, 112)) / 255.0
        face_input = np.expand_dims(face_resized, axis=0)

        # Generate 128-d embedding
        query_embedding = self.embedding_model.predict(face_input, verbose=0)[0]

        best_match = None
        min_distance = float('inf')

        for name, emb in self.authorized_db.items():
            # Euclidean distance between normalized embeddings
            dist = np.linalg.norm(query_embedding - emb)
            if dist < min_distance:
                min_distance = dist
                best_match = name

        if min_distance <= self.threshold:
            return ("ACCESS GRANTED", best_match, min_distance)
        else:
            return ("ACCESS DENIED (UNAUTHORIZED)", "Unknown", min_distance)`,
    interactiveType: "cnn_face"
  },
  {
    id: "DC_1",
    subject: "Distributed Computing",
    part: "Part D",
    title: "Coordination Problem over Lossy Channel (Two Generals)",
    problemStatement: "Two processes A and B communicate by sending and receiving messages on a bidirectional channel. Neither process fails, but channel experiences transient failures (message loss). Devise and analyze protocol where either action alpha or beta is taken, but both take same action and neither take both.",
    timeComplexity: "Impossibility Theorem Proof & Heuristic Retransmission",
    spaceComplexity: "O(1)",
    pythonCode: `"""
DISTRIBUTED COORDINATION PROBLEM OVER TRANSIENT FAULTY CHANNEL
Demonstrating the Two Generals / Consensus Impossibility Theorem:
It is mathematically impossible to guarantee 100% atomic consensus 
over an unreliable channel with bounded messages.
Practical approach: Retransmission with Acknowledgment (ACK-ACK) & Timeouts.
"""

import random
import time

class LossyChannel:
    def __init__(self, drop_probability=0.3):
        self.drop_prob = drop_probability

    def transmit(self, message):
        # Simulate network packet loss
        if random.random() < self.drop_prob:
            return None  # Dropped
        return message  # Delivered

class Process:
    def __init__(self, name, channel):
        self.name = name
        self.channel = channel
        self.state = "INIT"
        self.decided_action = None

    def propose_action(self, action="ALPHA", max_retries=5):
        print(f"[{self.name}] Initiating Coordination for Action: {action}")
        for attempt in range(1, max_retries + 1):
            msg = {"sender": self.name, "action": action, "attempt": attempt}
            delivered = self.channel.transmit(msg)
            if delivered:
                print(f"[{self.name}] Proposal delivered on attempt {attempt}")
                return True
            else:
                print(f"[{self.name}] Packet loss on attempt {attempt}, retransmitting...")
                time.sleep(0.1)
        return False

# Driver
if __name__ == "__main__":
    channel = LossyChannel(drop_probability=0.4)
    proc_A = Process("Node-A", channel)
    success = proc_A.propose_action("ALPHA", max_retries=6)
    if success:
        print("Coordination: Both processes commit to action ALPHA with high confidence.")
    else:
        print("Coordination FAILED: Reverting to fallback safe state BETA.")`,
    interactiveType: "two_generals"
  },
  {
    id: "DC_2",
    subject: "Distributed Computing",
    part: "Part D",
    title: "Distributed Leader Election Problem (Bully Algorithm)",
    problemStatement: "A set of processes P1, P2, ... Pn must select a leader. Each process Pi has a unique identifier uid(i). Devise a protocol so that all processes learn the identity of the leader using reliable broadcast.",
    timeComplexity: "O(n^2) message complexity in worst case",
    spaceComplexity: "O(n)",
    pythonCode: `class Process:
    def __init__(self, uid, total_processes):
        self.uid = uid
        self.total = total_processes
        self.is_alive = True
        self.current_leader = None

    def start_election(self, network):
        print(f"[P{self.uid}] Detected coordinator failure. STARTING ELECTION!")
        higher_nodes = [i for i in range(self.uid + 1, self.total + 1)]
        got_response = False

        for target in higher_nodes:
            if network[target].is_alive:
                print(f"[P{self.uid}] -> Sent ELECTION to P{target}")
                got_response = True
                network[target].receive_election(self.uid, network)

        if not got_response:
            # No higher node responded: I AM THE LEADER!
            self.become_leader(network)

    def receive_election(self, sender_uid, network):
        print(f"[P{self.uid}] Responded OK to P{sender_uid}")
        # Start own election to ensure highest alive node wins
        self.start_election(network)

    def become_leader(self, network):
        self.current_leader = self.uid
        print(f"\\n👑 [P{self.uid}] Broadcasts: 'I AM THE NEW COORDINATOR' to all alive processes!\\n")
        for p in network.values():
            if p.is_alive:
                p.current_leader = self.uid

# Simulation
if __name__ == "__main__":
    processes = {i: Process(i, 5) for i in range(1, 6)}
    # Current leader is highest: P5
    for p in processes.values():
        p.current_leader = 5

    print("Initial Leader: P5")
    # Simulate P5 crash
    print("Simulating Crash: P5 fails!")
    processes[5].is_alive = False

    # P2 notices failure and triggers election
    processes[2].start_election(processes)

    print("Election Completed. Final Leader:", processes[1].current_leader)`,
    interactiveType: "bully_election"
  }
];
