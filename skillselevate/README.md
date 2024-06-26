# SkillsElevate Web Application

## Overview

SkillsElevate is a comprehensive web application designed to help students enhance their quantitative, verbal, logical, and data interpretation skills through an engaging and interactive platform. This document provides an overview of the project, including its objectives, features, and how to get started.

## Objectives

- To create a platform where students can practice and assess their aptitude across various domains.
- To offer immediate feedback on responses and detailed results upon completion of tests.
- To ensure a user-friendly interface that encourages continuous learning and improvement.

## Features

### User Authentication

- **Registration**: New users can sign up using their email addresses.
- **Login**: Existing users can log in to access their profiles and test history.

### Main Sections

- **Practice Section**: Offers an endless stream of practice questions across all skill domains. Questions are randomized to prevent repetition and encourage continuous learning.
- **Take Test Section**: Provides a selection of structured tests, each with a specific number of questions and a time limit. Tests cover various topics and difficulty levels.

### Feedback and Results

- **Instant Feedback**: Users receive immediate feedback on their responses within the practice section.
- **Detailed Results**: Upon completing a test in the "Take Test" section, users are presented with a detailed analysis of their performance, including scores and areas for improvement.

### Motivation and Badges

- **Pop-up Rewards**: Correct answers trigger motivational pop-ups, encouraging continued engagement.
- **Profile Score Updates**: Performance in both practice and tests updates the user's profile score.
- **Badges**: Completing tests earns users badges, which they can display on their profile to showcase their achievements.

## Getting Started

To start using AptiTest, follow these steps:

1. **Visit the Website**: Open your browser and navigate to the AptiTest website.
2. **Register/Login**: If you're new, click on "Register" to create an account. Existing users can log in using their credentials.
3. **Navigate Home Page**: After logging in, you'll be directed to the main home page where you can select either "Practice" or "Take Test".
   - **Practice**: Choose this option for an endless stream of practice questions.
   - **Take Test**: Select from available tests, each with a specified number of questions and a time limit.

## Installation (To run locally)
- clone the reposistory
- create `.env` file in project's root directory
- add your firebase API Key and Gemini API as `REACT_APP_FIREBASE_API` and `REACT_APP_GEN_AI`
- modify config in `firebase.js` to your firestore server
- run `npm install`
- run `npm start`


## Contributing

Contributions to SkillsElevate are welcome Whether you're interested in adding new features, improving existing ones, or fixing bugs, please reach out to us via our contact

## License

This project is licensed under the GNU GPLv3 License. See the `LICENSE.txt` file for details.

## Contact

For any inquiries, feedback, or contributions, please [Contact Us here](mailto:atharvaj321@gmail.com).

