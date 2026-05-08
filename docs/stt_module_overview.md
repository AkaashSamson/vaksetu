# 6. Text to Sign

## 6.1 Speech-to-Text Module

The integration of a Speech-to-Text (STT) module is a foundational requirement for enabling seamless Speech-to-Indian Sign Language (ISL) capabilities. The primary objective of this module is to accurately transcribe spoken audio into structured text, which serves as the crucial step before generating the corresponding sign language representation. A critical goal of this implementation is to support robust multilingual access, ensuring that the system can process and transcribe various spoken languages effectively, with a particular focus on regional Indian languages. This broad language support is essential for maximizing the reach and inclusivity of the platform.

When exploring for existing models we came across 2 STT solutions. the following sections describe them in detail.

### 6.1.1 Web Speech API

The Web Speech API is a browser-native interface that allows web applications to incorporate voice transcription capabilities easily. It leverages the underlying speech recognition engines provided directly by the user's web browser or operating system. Because it is deeply integrated into the client-side environment, it is highly efficient at processing audio inputs quickly without maintaining persistent remote server connections.

A significant advantage of the Web Speech API is its accessibility and cost-effectiveness; it operates natively within most modern web browsers and does not incur any direct usage fees. This free-to-use nature, combined with its capacity for live, real-time transcription, makes it a highly attractive option for applications prioritizing immediate feedback and zero API integration costs.

### 6.1.2 Sarvam AI API

Sarvam AI provides an advanced enterprise-grade AI platform specifically tailored for processing Indian languages. It offers highly sophisticated speech-to-text models designed to capture the nuances and complexities of regional dialects accurately. Rather than relying on local browser-based engines, Sarvam processes audio through its dedicated scalable infrastructure via API integrations.

The platform offers a comprehensive suite of models, including specialized transcription and translation services, which are designed to work synergistically. By leveraging state-of-the-art machine learning techniques trained extensively on diverse Indian linguistic datasets, Sarvam provides robust performance capable of handling a wide variety of accents and linguistic contexts across numerous regional languages.

### 6.1.3 Comparison and Selection

To select the most appropriate STT engine, a detailed comparison of their respective advantages and limitations was conducted.

**Advantages of the Web Speech API:**
The primary benefits of the Web Speech API include its capability for live, real-time transcription, its seamless execution directly within the user's browser, and the fact that it is completely free to use.

**Advantages of Sarvam AI API:**
Conversely, Sarvam AI excels in its specialized support and fine-tuning for Indian languages. It effectively processes and translates 22 distinct Indian languages with demonstrably higher accuracy and overall model performance compared to generalized browser engines. Both its transcription and translation models demonstrate superior proficiency across these languages. Furthermore, as an actively expanding service focused on the Indian context, Sarvam promises continued semantic upgrades, new model releases, and enhanced accessibility features in the long term.

**Drawbacks and Limitations:**
While the Web Speech API is fast and free, it generally lacks deep, specialized fine-tuning for nuanced Indian accents and dialects. On the other hand, relying on Sarvam introduces certain trade-offs, notably higher processing latency due to network API calls and complex server-side inference, as well as ongoing operational costs based on their proprietary pricing model.

**Conclusion:**
Despite the attractive zero-cost and real-time nature of the Web Speech API, we ultimately selected **Sarvam AI** as our core STT provider. This decision is rooted in the strategic priority of delivering high accuracy and multilingual support across India's incredibly diverse linguistic landscape. Sarvam's superior generative performance, its dedicated fine-tuning for 22 scheduled Indian languages across both transcription and translation, and its high growth potential ensure that our ecosystem remains highly effective, scalable, and inclusive for our target demographic.
