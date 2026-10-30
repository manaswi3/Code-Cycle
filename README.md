# AlgoRecall — Pattern-First DSA Spaced Repetition Platform

> **A Research-Backed Revision System for Software Engineering Campus Placements**  
> Built with **MongoDB, Express, React, Node.js (MERN)** & integrated with the **LeetCode GraphQL API**.

---

## 🎯 Abstract & Problem Statement
Computer science students preparing for software engineering technical interviews typically solve hundreds of problems across platforms like LeetCode and Codeforces. However, due to the cognitive **Ebbinghaus Forgetting Curve**, after 2–3 weeks students frequently forget the approaches, invariants, and edge cases, leading to anxiety and inefficient re-solving from scratch.

Existing tools (Notion, spreadsheets) are **static repositories**—they fail to prompt the learner when recall is at risk. 

**AlgoRecall** solves this by introducing:
1. **Algorithmic Spaced Repetition (SuperMemo SM-2):** Dynamically adjusts revision intervals ($I$) and Easiness Factors ($EF$) based on student recall quality $q \in [0, 5]$.
2. **Cognitive Pattern Clustering:** Encourages revision of generalized algorithmic patterns (e.g., Sliding Window, Monotonic Stack, Two Pointers) rather than memorizing isolated questions.
3. **Active Recall "Recall Room":** Tests intuitive retrieval and edge-case anticipation in a timed, blind stage before revealing past solutions.
4. **LeetCode GraphQL Proxy:** Automatically fetches problem difficulty, official tags, and metadata in <200ms by URL titleSlug.

---

## 📐 Mathematical Formulation (Evaluator Highlights)

### 1. SuperMemo SM-2 Interval Calculation
For each revision attempt with user rating $q \in [0, 5]$:

$$EF' = EF + (0.1 - (5 - q) \times (0.08 + (5 - q) \times 0.02)) \quad (EF' \ge 1.3)$$

$$I(n) = \begin{cases} 
1 \text{ day} & n = 1 \\ 
6 \text{ days} & n = 2 \\ 
I(n-1) \times EF' & n > 2 
\end{cases}$$

If $q < 3$ (Failed recall), repetition count $n$ resets to 0 and interval restarts at 1 day.

### 2. Ebbinghaus Memory Decay Metric
$$\text{Retention } R = e^{-\frac{\Delta t}{S}}$$
- $\Delta t$: Days elapsed since last review.
- $S$: Memory stability window (proportional to current interval $I$).
- **Color Thresholds:** Green (Fresh, $R \ge 75\%$), Yellow (Fading, $50\% \le R < 75\%$), Red (Critical, $R < 50\%$).

---

## 🏗️ System Architecture

```
[ React + Tailwind + Vite (Frontend) ]
                  │
                  ▼ REST API (JWT Authenticated)
[ Express.js + Node.js (Backend) ]
    ├── LeetCode GraphQL Reverse Proxy
    ├── SM-2 Spaced Repetition Engine
    └── MongoDB Aggregation Pipelines
                  │
                  ▼
         [ MongoDB Database ]
    (Users, Problems, ReviewLogs)
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js (v18+ or v22+)
- MongoDB (Local service or MongoDB Atlas free cloud cluster)

### 1. Backend Setup
```bash
cd backend
npm install
npm test            # Runs unit tests for SM-2 and LeetCode slug extractor
npm run seed        # (Optional) Seeds sample DSA problems with SM-2 states
npm run dev         # Starts backend on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev         # Starts Vite dev server on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

---

## 💡 Quick Evaluator / Demo Login
Click the **"1-Click Evaluator / Demo Login"** button on the sign-in modal to immediately test the application with pre-loaded problems, daily revision queues, and memory decay charts!
