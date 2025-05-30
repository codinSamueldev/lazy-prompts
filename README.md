# Lazy Prompts

A social platform for sharing and discovering prompts for Large Language Models (LLMs).

## 🚀 About

Lazy Prompts is a community-driven platform where users can share their best prompts and discover prompts created by others. The platform aims to solve the problem of content creators "gatekeeping" prompts behind engagement requirements by making high-quality prompts freely available to everyone.

### Key Features

- **Share Your Prompts**: Create and share your best prompts with the community
- **Discover Prompts**: Browse a feed of prompts from other users
- **Copy & Use**: Easily copy prompts to use with your favorite LLMs
- **Categorization**: Find prompts by topics/categories
- **Social Features**: Like, save, and interact with prompts
- **User Profiles**: Customize your profile and track your contributions
- **Authentication**: Register with email or sign in with Google/GitHub

## 🛠️ Tech Stack

- **Backend**: Django 5.2
- **Database**: PostgreSQL
- **Caching**: Redis
- **Authentication**: Django Allauth (with social auth providers)
- **Frontend**: HTML, CSS, JavaScript
- **Deployment**: [TBD]

## 🔧 Installation

### Prerequisites

- Python 3.10+
- PostgreSQL
- Redis

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/lazy_prompts.git
   cd lazy_prompts
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the project root with the following variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/lazy_prompts
   DJANGO_SECRET_KEY=your_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   REDIS_URL=redis://localhost:6379/0
   ```

5. Run migrations:
   ```bash
   python manage.py migrate
   ```

6. Create a superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run the development server:
   ```bash
   python manage.py runserver
   ```

8. Visit `http://127.0.0.1:8000/` in your browser.

## 📝 Usage

### Sharing a Prompt

1. Sign in to your account
2. Click on "Create Prompt" button
3. Fill in the prompt details (title, content, topic)
4. Optionally add an image
5. Click "Share" to publish your prompt

### Discovering Prompts

- Browse the home feed to see the latest prompts
- Use the sort options (New, Hot, Top) to filter the feed
- Check out the "Hot Prompts" sidebar for popular content
- Browse by topic using the "Topics" sidebar

### Interacting with Prompts

- Click the heart icon to like a prompt
- Click the bookmark icon to save a prompt for later
- Click the copy button to copy the prompt to your clipboard
- Share prompts on social media using the share buttons

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 🙏 Acknowledgements

- [Django](https://www.djangoproject.com/)
- [Django Allauth](https://django-allauth.readthedocs.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Redis](https://redis.io/)
