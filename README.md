# 🎓 Academic Performance Evaluation System

An automated system designed to evaluate and determine students' academic standing based on CGPA, course completion, and institutional academic regulations. The system streamlines the annual evaluation process to ensure fairness, consistency, and transparency.

---

## 📌 Features

- ✅ **Automated Evaluation**: Assesses student academic performance annually using key indicators such as Overall CGPA, Major CGPA, and specific course grades.
- 📊 **Outcome Classification**: Determines student status as:
  - Good Standing
  - Academic Warning
  - Continue in Alternate Program
  - Dismissed from Program
- ⚙️ **Rule-Based Criteria**: Status outcomes are driven by predefined academic thresholds set by the degree program.
- 🔔 **Action Triggers**: Automatically initiates academic probation, program continuation, or dismissal workflows based on results.
- 🔍 **Transparent Evaluation**: Ensures clarity and alignment with institutional academic policies.

---

## 🧠 Evaluation Logic

The system performs the following annually:

1. **Collect Data**: Gathers CGPA values and course completion records.
2. **Compare with Thresholds**: Checks if the student meets the minimum program-specific CGPA and grade requirements.
3. **Classify Status**: Based on performance:
   - **Good Standing**: Meets all criteria.
   - **Academic Warning**: Below threshold but eligible to continue.
   - **Continue in Alternate Program**: Suggested redirection based on repeated underperformance.
   - **Dismissed from Program**: Severely below academic expectations.

---

## 📁 Repository Structure

