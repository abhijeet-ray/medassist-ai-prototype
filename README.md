# MedAssist AI – Multilingual Healthcare Intelligence System

MedAssist AI is a multilingual, AI-powered healthcare information assistant designed to improve medical understanding across India.

This prototype is being developed for the AWS AI Hackathon and leverages AWS-native AI services to responsibly process and summarize medical documents.

---

## 🚀 Problem We Are Solving

Medical documents such as discharge summaries and lab reports are:

- Complex and difficult for patients to understand
- Time-consuming for doctors to review
- Not available in regional Indian languages
- Prone to misinterpretation

This creates confusion, delays, and reduced treatment adherence.

MedAssist AI bridges this gap by transforming medical documents into clear, role-specific explanations.

---

## 🧠 Core Features

- 📄 Medical document upload (PDF)
- 🩺 Role-based summarization:
  - Doctor → Structured clinical summary
  - Patient → Simplified explanation
  - ASHA Worker → Action-oriented guidance
- 🌐 Multilingual output (English + Hindi)
- 🔎 Retrieval-Augmented Generation (RAG) to reduce hallucinations
- 📊 Medical entity extraction (conditions, medications, procedures)
- ⚖ Responsible AI guardrails (no diagnosis, no prescriptions)
- 📈 Confidence score indicator

---

## 🛠 Architecture Stack

### Frontend
- React Native (Expo)

### Backend (Planned AWS Integration)
- FastAPI (Python)

### AWS Services
- Amazon Bedrock (Claude 3 Sonnet)
- Amazon Titan Embeddings
- Amazon Textract
- Amazon Comprehend Medical
- Amazon OpenSearch Serverless
- Amazon Translate
- Amazon S3
- AWS Lambda / EC2
- AWS Amplify

---

## 🔄 System Flow

1. User uploads medical document
2. Document stored temporarily in Amazon S3
3. Text extracted using Amazon Textract
4. Medical entities identified using Comprehend Medical
5. Context retrieved using OpenSearch (RAG)
6. Summary generated via Claude 3 Sonnet (Bedrock)
7. Output translated (if required)
8. Structured response displayed in app

---

## 🔐 Responsible AI Commitment

- No medical diagnosis
- No prescription recommendations
- No permanent storage of PHI
- Encrypted storage
- IAM-based access control
- Confidence scoring for transparency

MedAssist AI enhances understanding — it does not replace medical professionals.

---

## 📦 Local Development

```bash
npm install
npx expo start
