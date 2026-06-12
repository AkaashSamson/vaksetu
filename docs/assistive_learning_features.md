# 7. ASSISTIVE LEARNING FEATURES

The assistive learning module of Vaksetu is designed to reinforce Indian Sign Language (ISL) vocabulary, alphabet finger spelling, and alphanumeric structures. It achieves this through gamified assessments and collaborative learning communities. By combining individual practice with community-driven accountability, the platform maintains learner engagement and tracks progress. 

The primary focus of this section is the technical implementation and testing aspects of these features, detailing how each component was constructed, verified, and debugged during the cloud staging phase.

---

## 7.1 Quizzes

### 7.1.1 Implementation
*   **General Context & Previous Work**: The previous milestone introduced the frontend quiz interface, including the image-to-text (image_mcq) and sign-to-text (sign_mcq) modes, the 50% passing progression gate, and TypeScript types.
*   **New Implementation Details**: In this milestone, we updated the Supabase database schema to relocate the quiz format type. Originally, a database enum forced the entire quiz to share a single format. We removed the "type" column and nested the format directly within individual question metadata in the JSONB content column. Additionally, we implemented a backend hydration technique in Drizzle ORM that resolves dictionary ID references into fully formatted visuals by batch-fetching entries, which optimizes loading times and prevents N+1 query limits.

### 7.1.2 Testing and Debugging
During staging and manual testing, we validated the quiz APIs against the Cloud Supabase database. Although the cloud database was connected previously, active database testing had not been performed. Testing in this phase revealed that while user login worked, loading and submitting quizzes crashed. 
*   **Database Schema Drift**: We discovered that the cloud database could not process queries on the custom enum types. We resolved this by dropping the enum type entirely, moving format parsing to the application layer, and running a synchronization migration.
*   **Database Seed Replication**: To fix blank dictionary outputs on the cloud, we built a data replication script that cascadingly truncates remote tables and restores a clean copy of our local dataset.
*   **Authentication & Profile Sync**: We found that new signups failed to create public profile rows, breaking quiz attempt foreign keys. We resolved this by setting trigger permissions to SECURITY DEFINER and scheduling a default group assignment trigger.

---

## 7.2 Communities

### 7.2.1 Implementation
*   **General Context & Previous Work**: The community module provides collaborative spaces for users. In this phase, we completed the core backend tables linking users, memberships, and group-assigned quizzes.
*   **New Implementation Details**: We created the user_group, group_member, and quiz_group tables in Supabase. Users can create public or private groups, join using invite codes, leave groups, and link quizzes. Admins can toggle group-linked quizzes as active Weekly Challenges.

### 7.2.2 Testing and Debugging
We manually tested the community features on the cloud staging server using multiple test accounts.
*   **Group Access & Toggles**: Verified that private groups remained hidden and rejected incorrect codes while accepting the correct code. Admin toggles shifted quizzes between Weekly Challenges and Other Quizzes sections in real-time.
*   **Membership Cascades**: Confirmed that leaving a group deleted the member row cleanly while preserving individual quiz attempt logs.

---

## 7.3 Group Leaderboards & Scoring Engine

### 7.3.1 Implementation
*   **General Context & Previous Work**: The leaderboard system ranks group members to encourage active learning. 
*   **New Implementation Details**: We implemented a scoring engine with two key formulas. First, the attempt score rewards speed and accuracy:
    `Attempt Score = Round(Correct * 100 + Max(0, Target_Time - Time_Taken) * 2 * (Correct / Total))`
    The target time is 15 seconds per question, and the speed bonus is scaled by accuracy to prevent guessing exploits. Second, the weekly group score aggregates the best score of active weekly quizzes but subtracts a 20-point penalty for each additional attempt to prevent brute-forcing:
    `Effective Quiz Score = Max(0, Best_Score - (Attempts_Required - 1) * 20)`
    `Weekly Leaderboard Score = Sum of Effective Quiz Scores`
    We also implemented chronological tie-breaking (earliest completion wins) and a lazy weekly rollover that rolls scores over to all-time rankings.

### 7.3.2 Testing and Debugging
We tested the leaderboard calculations by submitting multiple quiz attempts under different test accounts.
*   **Formula & Penalty Checks**: Verified that the accuracy-scaled speed bonus calculated correctly. Repeated quiz submissions successfully applied the 20-point penalty to the effective score.
*   **Reset & Ties**: Confirmed that ties were ordered correctly by completion date. Manually backdating the last weekly reset verified that new submissions successfully archived scores to the all-time column and reset the weekly leaderboard.
*   **Future Improvements**: Recommendations include setting up server-side cron reset tasks, difficulty-based time allocations, and practice streak multipliers.

---

## 7.4 Supplementary Learning Hub Pages

### 7.4.1 Implementation
The Dictionary page reads localized JSON records to render translation cards, while the Learning Resources page queries database rows to display external courses and video tutorials.

### 7.4.2 Testing and Debugging
We verified that searches normalized and filtered translation cards in real-time without layout shifting, and confirmed that resources loaded correct images and opened external video links in new browser tabs.
