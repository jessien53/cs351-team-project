# CS351 Team Project: Campus Marketplace

This project is a full-stack web application, similar to Etsy, for UIC students to post goods and services. It uses a React frontend, a Django backend, and a Supabase (PostgreSQL) database.

## Requirements

  * Python 3.10+
  * Node.js 18+
  * A Supabase project

## Backend Setup (Django) 

This server runs on port 8000 and connects to your Supabase database.

1.  **Open your first terminal** and navigate to the project's root directory.

2.  **Create and activate a virtual environment:**

    ```bash
    # Create the venv
    python -m venv venv

    # Activate on Windows
    .\venv\Scripts\activate

    # Activate on Mac/Linux
    source venv/bin/activate
    ```

3.  **Install Python dependencies:**

    ```bash
    pip install -r backend/requirements.txt
    ```

4.  **Create the Backend `.env` file:**
    In the root of the project, create a file named `.env` and add your credentials. This file is loaded by `backend/mysite/settings.py`.

    ```.env
    SECRET_KEY='your-django-secret-key-here'

    DB_NAME=postgres
    DB_USER=postgres
    DB_HOST='your-supabase-host-here'
    DB_PASSWORD='your-supabase-db-password-here'
    DB_PORT=5432
    ```

    To generate a secure `SECRET_KEY`, run the following command in your terminal and paste the output into the `.env` file:

    ```bash
    python -c "import secrets; print(secrets.token_urlsafe(50))"
    ```

5.  **Run Database Migrations:**
    This command sets up the initial Django tables (like for admin users).

    ```bash
    python backend/manage.py migrate
    ```

## Frontend Setup (React) ⚛️

This server runs on port 5173 and serves the website to your browser.

1.  **Open a second, separate terminal.**

2.  **Navigate into the `frontend` directory:**

    ```bash
    cd frontend
    ```

3.  **Install Node.js dependencies:**

    ```bash
    npm install
    ```

4.  **Add the Frontend Environment Vatiables in `.env` file:**

    ```.env
    VITE_API_BASE="http://localhost:8000"
    VITE_USE_MOCK=0
    ```

## Running the Application

You must have **both** servers running at the same time in their respective terminals.

1.  **Run the Backend Server:**
    *(In your first terminal, from the project root)*

    ```bash
    python backend/manage.py runserver
    ```

    Wait until you see it running on `http://127.0.0.1:8000/` and it says "Trie populated with... words."

2.  **Run the Frontend Server:**
    *(In your second terminal, from the `frontend` directory)*

    ```bash
    npm run dev
    ```

    This will automatically open the website (e.g., `http://localhost:5173`) in your browser.

## Troubleshooting

### Error: `could not translate host name... to address: Name or service not known`

This is a network DNS error. It means your computer is failing to find the IP address for your Supabase database host.

**Causes & Solutions:**

1.  **Supabase Project is Paused (Most Common):** Free-tier Supabase projects are paused after 7 days of inactivity.

      * **Fix:** Log in to your Supabase account, find the project, and click the **"Restore project"** button. Wait 2-3 minutes and try running the server again.

2.  **Network DNS Issue:** Your current Wi-Fi network (especially public or campus Wi-Fi) might be blocking the connection or having DNS problems.

      * **Fix:** Switch to a different network. **Using a mobile hotspot** is a reliable way to solve this.

3.  **Typo in `.env`:** Double-check your `DB_HOST` in the main `.env` file. Copy and paste it directly from your Supabase dashboard (Settings \> Database) to be sure.
