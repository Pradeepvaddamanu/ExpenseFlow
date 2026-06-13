import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
def send_welcome_email(user_email, user_name):

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": user_email,
        "subject": "Welcome to ExpenseFlow 🎉",
        "html": f"""
        <h2>Welcome to ExpenseFlow, {user_name}!</h2>

        <p>Thank you for registering.</p>

        <p>You can now:</p>

        <ul>
            <li>Create Groups</li>
            <li>Add Expenses</li>
            <li>Calculate Settlements</li>
            <li>Generate AI Insights</li>
        </ul>

        <p>Happy expense tracking!</p>
        """
    })