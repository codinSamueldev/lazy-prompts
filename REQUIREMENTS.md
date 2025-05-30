# Lazy Prompts - Requirements Specification

## 1. Introduction

### 1.1 Purpose
This document outlines the requirements for the Lazy Prompts platform, a social media application designed for sharing and discovering prompts for Large Language Models (LLMs).

### 1.2 Project Scope
Lazy Prompts aims to create a community where users can freely share their best prompts and discover prompts created by others, without the gatekeeping often seen on other platforms where creators hide prompts behind engagement requirements.

### 1.3 Definitions
- **Prompt**: A text input designed to elicit specific responses from Large Language Models (LLMs) like ChatGPT, Claude, etc.
- **Topic**: A category or tag that classifies prompts by their intended use or subject matter.
- **Hot Prompt**: A prompt that has gained significant engagement (likes, saves, copies) in a short period.
- **Top Prompt**: A prompt with the highest overall engagement metrics.

## 2. System Architecture

### 2.1 Technology Stack
- **Backend Framework**: Django 5.2
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: Django Allauth with social providers (Google, GitHub)
- **Frontend**: HTML, CSS, JavaScript
- **Static Files**: Django's built-in static file handling
- **Media Files**: Django's built-in media file handling

### 2.2 System Components
- User Management System
- Prompt Management System
- Feed and Discovery System
- Interaction System (likes, saves)
- Search System

## 3. Database Models

### 3.1 User Model
Extends Django's built-in User model with a Profile model:

| Field | Type | Description |
|-------|------|-------------|
| user | OneToOneField | Link to Django User model |
| avatar | ImageField | User's profile picture |
| bio | TextField | User's biography |
| website | URLField | User's website |
| twitter | CharField | User's Twitter handle |
| github | CharField | User's GitHub username |
| created_at | DateTimeField | When the profile was created |
| updated_at | DateTimeField | When the profile was last updated |

### 3.2 Topic Model
For categorizing prompts:

| Field | Type | Description |
|-------|------|-------------|
| name | CharField | Topic name |
| slug | SlugField | URL-friendly version of name |
| description | TextField | Topic description |
| icon | CharField | Icon class name |
| created_at | DateTimeField | When the topic was created |

### 3.3 Prompt Model
The core model for storing prompts:

| Field | Type | Description |
|-------|------|-------------|
| title | CharField | Prompt title |
| content | TextField | The actual prompt text |
| author | ForeignKey | Link to User model |
| topic | ForeignKey | Link to Topic model |
| image | ImageField | Optional image for the prompt |
| view_count | PositiveIntegerField | Number of views |
| copy_count | PositiveIntegerField | Number of times copied |
| created_at | DateTimeField | When the prompt was created |
| updated_at | DateTimeField | When the prompt was last updated |

### 3.4 Like Model
For tracking likes on prompts:

| Field | Type | Description |
|-------|------|-------------|
| user | ForeignKey | User who liked |
| prompt | ForeignKey | Prompt that was liked |
| created_at | DateTimeField | When the like was created |

### 3.5 SavedPrompt Model
For users to save prompts for later:

| Field | Type | Description |
|-------|------|-------------|
| user | ForeignKey | User who saved |
| prompt | ForeignKey | Prompt that was saved |
| created_at | DateTimeField | When the save was created |

### 3.6 Comment Model (Optional)
If commenting functionality is desired:

| Field | Type | Description |
|-------|------|-------------|
| user | ForeignKey | User who commented |
| prompt | ForeignKey | Prompt that was commented on |
| content | TextField | Comment content |
| created_at | DateTimeField | When the comment was created |
| updated_at | DateTimeField | When the comment was last updated |

## 4. Functional Requirements

### 4.1 User Authentication

#### 4.1.1 Registration
- Users can register with email, username, and password
- Users can register using Google or GitHub accounts
- Email verification is required for new accounts

#### 4.1.2 Login
- Users can log in with username/email and password
- Users can log in using Google or GitHub accounts

#### 4.1.3 Profile Management
- Users can view and edit their profiles
- Users can upload a profile picture
- Users can add bio and social links

### 4.2 Prompt Management

#### 4.2.1 Create Prompt
- Users can create new prompts with title and content
- Users can assign a topic to their prompt
- Users can optionally add an image to their prompt

#### 4.2.2 Edit Prompt
- Users can edit their own prompts
- Editing updates the 'updated_at' timestamp

#### 4.2.3 Delete Prompt
- Users can delete their own prompts
- Soft deletion may be implemented to preserve data integrity

#### 4.2.4 View Prompt
- Users can view prompt details
- View count is incremented when a prompt is viewed

#### 4.2.5 Copy Prompt
- Users can copy prompt content to clipboard
- Copy count is incremented when a prompt is copied

### 4.3 Feed and Discovery

#### 4.3.1 Home Feed
- Display a feed of prompts on the home page
- Infinite scroll

#### 4.3.2 Sorting Options
- Sort by New (most recent)
- Sort by Hot (trending based on recent engagement)
- Sort by Top (highest overall engagement)

#### 4.3.3 Topic Filtering
- Filter prompts by topic
- Display a sidebar of available topics

#### 4.3.4 Hot Prompts
- Display a sidebar of hot/trending prompts
- Algorithm to determine "hotness" based on recent engagement

### 4.4 Interaction

#### 4.4.1 Likes
- Users can like/unlike prompts
- Like count is displayed on prompts

#### 4.4.2 Saves
- Users can save/unsave prompts
- Save count is displayed on prompts
- Users can view their saved prompts

#### 4.4.3 Copying
- Users can copy prompt content with one click
- Copy count is tracked and displayed

#### 4.4.4 Comments (Optional)
- Users can comment on prompts
- Comments are displayed in chronological order

### 4.5 Search

#### 4.5.1 Basic Search
- Search prompts by title and content
- Display search results with highlighting

#### 4.5.2 Advanced Search
- Filter search results by topic
- Sort search results by relevance, date, popularity

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time under 2 seconds
- Support for at least 1000 concurrent users
- Efficient database queries with proper indexing
- Caching of frequently accessed data with Redis

### 5.2 Security
- HTTPS for all connections
- CSRF protection for all forms
- Secure password storage with Django's built-in hashing
- Input validation and sanitization
- Protection against SQL injection, XSS, and CSRF attacks

### 5.3 Scalability
- Horizontal scaling capability
- Database connection pooling
- Efficient use of caching

### 5.4 Usability
- Responsive design for mobile and desktop
- Intuitive user interface
- Accessibility compliance (WCAG 2.1 AA)
- Clear error messages and feedback

### 5.5 Reliability
- 99.9% uptime
- Regular database backups
- Error logging and monitoring

## 6. Future Enhancements

### 6.1 Potential Features
- Prompt versioning
- Collaborative prompts
- Premium prompts (paid content)
- User following system
- Notifications system
- API for third-party integrations
- Direct integration with LLM platforms

## 7. Appendices

### 7.1 User Flow Diagrams
[To be added]

### 7.2 Wireframes
[To be added]

### 7.3 API Documentation
[To be added]
